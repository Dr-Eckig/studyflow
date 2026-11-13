BEGIN;

DROP TABLE IF EXISTS users                  CASCADE;
DROP TABLE IF EXISTS exams                  CASCADE;
DROP TABLE IF EXISTS tasks                  CASCADE;
DROP TABLE IF EXISTS task_completion_log    CASCADE;
DROP TABLE IF EXISTS i18n_languages         CASCADE;
DROP TABLE IF EXISTS i18n_translations      CASCADE;

DROP VIEW IF EXISTS user_streak_view            CASCADE;
DROP VIEW IF EXISTS weekly_task_progress_view   CASCADE;
DROP VIEW IF EXISTS next_exam_view              CASCADE;
DROP VIEW IF EXISTS exam_with_tasks_list        CASCADE;

DROP TRIGGER  IF EXISTS encrypt_password_trigger ON users CASCADE;
DROP FUNCTION IF EXISTS encrypt_password_function           CASCADE;

-- Tables
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email D_EMAIL UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    dark_mode BOOLEAN DEFAULT FALSE,
    language VARCHAR(25) DEFAULT 'de'
);

CREATE TABLE exams (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    title D_SAFE_TEXT NOT NULL,
    note D_SAFE_TEXT,
    deadline DATE,
    tag_color VARCHAR(25) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name D_SAFE_TEXT NOT NULL,
    completed BOOLEAN DEFAULT FALSE,
    date DATE,
    exam_id UUID NOT NULL,
    FOREIGN KEY (exam_id) REFERENCES exams(id) ON DELETE CASCADE
);

-- Extra table used to measure the days streak statistic
CREATE TABLE task_completion_log (
    user_id                 UUID        NOT NULL,
    date                    DATE        NOT NULL,
    all_tasks_completed     BOOLEAN     NOT NULL,
    PRIMARY KEY (user_id, date),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Store languages supported by StudyFlow
CREATE TABLE i18n_languages (
  code TEXT PRIMARY KEY,
  name TEXT NOT NULL
);

-- Store the translations
CREATE TABLE i18n_translations (
  lang_code TEXT REFERENCES i18n_languages(code),
  key       TEXT NOT NULL,
  value     TEXT NOT NULL,
  is_error  BOOLEAN DEFAULT FALSE,
  PRIMARY KEY (lang_code, key)
);

-- Views
CREATE VIEW grouped_tasks AS
SELECT 
  exam.user_id,
  task.date AS date,
  json_agg(
    json_build_object(
      'taskId', task.id,
      'title', task.name,
      'completed', task.completed,
      'category', json_build_object(
        'examId', exam.id,
        'title', exam.title,
        'color', exam.tag_color
      )
    )
  ) AS tasks
FROM tasks AS task
JOIN exams AS exam ON task.exam_id = exam.id
GROUP BY exam.user_id, task.date
ORDER BY task.date;

-- show the current week's streak (day counted as streak only when ALL tasks for that day are done)
CREATE OR REPLACE VIEW user_streak_view AS
SELECT u.id AS user_id,
       COALESCE(s.current_streak, 0) AS current_streak
FROM users u
         LEFT JOIN (
    SELECT user_id, COUNT(*) AS current_streak
    FROM (
             SELECT user_id,
                    date,
                    ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY date DESC) -
                    ROW_NUMBER() OVER (PARTITION BY user_id, all_tasks_completed ORDER BY date DESC) AS grp
             FROM task_completion_log
             WHERE all_tasks_completed = TRUE
         ) sub
    GROUP BY user_id, grp
) s ON u.id = s.user_id;

-- tasks done for the week
CREATE VIEW weekly_task_progress_view AS
SELECT
    u.id AS user_id,
    u.email,
    COUNT(t.id) FILTER (
        WHERE DATE_TRUNC('week', t.date) = DATE_TRUNC('week', CURRENT_DATE)
        ) AS weekly_tasks,
    COUNT(t.id) FILTER (
        WHERE t.completed AND DATE_TRUNC('week', t.date) = DATE_TRUNC('week', CURRENT_DATE)
        ) AS weekly_tasks_completed
FROM users u
         LEFT JOIN exams e ON e.user_id = u.id
         LEFT JOIN tasks t ON t.exam_id = e.id
GROUP BY u.id;

-- shows the nearest exam and how many days left till the exam
CREATE VIEW next_exam_view AS
SELECT DISTINCT ON (u.id)
    u.id AS user_id,
    e.title AS exam_title,
    e.deadline AS exam_date,
    (e.deadline - CURRENT_DATE) AS days_remaining
FROM users u
    JOIN exams e ON e.user_id = u.id
WHERE e.deadline >= CURRENT_DATE
ORDER BY u.id, e.deadline ASC;

-- shows user's associated exam and all the task's names as array
CREATE VIEW exam_with_tasks_list AS
SELECT
    e.user_id,
    e.title,
    e.note AS description,
    e.deadline AS due_date,

    CASE
        WHEN COUNT(t.id) = 0 THEN 0
        ELSE ROUND(100.0 * COUNT(t.id) FILTER (WHERE t.completed) / COUNT(t.id))::INTEGER
        END AS done_percent,

    -- actual array of the open & completed tasks
    (
        SELECT json_agg(t1.name)
        FROM tasks t1
        WHERE t1.exam_id = e.id AND t1.completed
    ) AS completed_task_names,

    (
        SELECT json_agg(t2.name)
        FROM tasks t2
        WHERE t2.exam_id = e.id AND (NOT t2.completed OR t2.completed IS NULL)
    ) AS open_task_names

FROM
    exams e
        LEFT JOIN
    tasks t ON t.exam_id = e.id
GROUP BY
    e.id, e.title, e.note, e.deadline;

-- encrypt password given by user
CREATE FUNCTION encrypt_password_function()
    RETURNS TRIGGER
    LANGUAGE plpgsql
AS
$$
BEGIN
    -- If inserting a new row, or updating the password field:
    IF ( TG_OP = 'INSERT' OR
         (TG_OP = 'UPDATE' AND NEW."password" <> OLD."password")
        )
    THEN
        -- Hash the new password using bcrypt (blowfish) with salt
        NEW."password" = crypt(NEW."password", gen_salt('bf', 12));
    END IF;

    RETURN NEW; -- Required for BEFORE triggers
END
$$;

-- triggers gets fired when there's an insert or update in users table
CREATE TRIGGER encrpyt_password_trigger
    BEFORE INSERT OR UPDATE
    ON users
    FOR EACH ROW
EXECUTE PROCEDURE encrypt_password_function()
;

COMMIT;
