/*************************************************************************************
 * Studyflow: REST Functions for tasks
 *************************************************************************************/

BEGIN;

/* Cleanup */

DROP FUNCTION IF EXISTS post_task  (_user_id TEXT, _data JSONB);
DROP FUNCTION IF EXISTS put_task   (_user_id TEXT, _data JSONB);
DROP FUNCTION IF EXISTS patch_task (_user_id TEXT, _data JSONB);
DROP FUNCTION IF EXISTS delete_task(_user_id TEXT);

/* Functions */

CREATE OR REPLACE FUNCTION post_task(_user_id TEXT, _data JSONB)
    RETURNS TABLE (result JSONB)
    SECURITY DEFINER
    LANGUAGE plpgsql
AS
$$
DECLARE
    validation_result JSONB;
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM exams
        WHERE id = (_data->>'examId')::UUID
          AND user_id = _user_id::UUID
          AND deadline >= CURRENT_DATE
    ) THEN
        RETURN QUERY SELECT json_status(
            403,
            NULL,
            '42501',
            'user_must_own_exam',
            'You are not authorized to create this task'
        );
        RETURN;
    END IF;

    validation_result := validate_date(_data->>'date', (_data->>'examId')::UUID);
    IF validation_result IS NOT NULL THEN
        RETURN QUERY SELECT validation_result;
        RETURN;
    END IF;

    RETURN QUERY
        SELECT rest_helper(
            'INSERT INTO tasks (exam_id, name, completed, date)
            VALUES (
                ($2->>''examId'')::UUID,
                json_attr_value_d_safe_text($2, ''name'', NULL),
                COALESCE(($2->>''completed'')::BOOLEAN, false),
                ($2->>''date'')::DATE
            )',
            _data => _data,
            _http_status => 201
        );
END
$$
;

CREATE FUNCTION put_task(_user_id TEXT, _data JSONB) RETURNS TABLE (result JSONB)
    SECURITY DEFINER
    LANGUAGE plpgsql
AS
$$
DECLARE
    validation_result JSONB;
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM tasks t
        JOIN exams e ON t.exam_id = e.id
        WHERE t.id = (_data->>'id')::UUID AND e.user_id = _user_id::UUID
    ) THEN
        RETURN QUERY SELECT json_status(
            403,
            NULL,
            '42501',
            'user_must_own_exam',
            'You are not authorized to modify this task'
        );
        RETURN;
    END IF;

    validation_result := validate_date(_data->>'date');
    IF validation_result IS NOT NULL THEN
        RETURN QUERY SELECT validation_result;
        RETURN;
    END IF;

    RETURN QUERY
        SELECT rest_helper -- $1 = _id, $2 = _data
        (   'UPDATE tasks
            SET exam_id = ($2->>''examId'')::UUID,
                name = json_attr_value_d_safe_text($2, ''name'',  NULL),
                completed  = COALESCE(($2->>''completed'')::BOOLEAN, NULL),
                date = COALESCE(($2->>''date'')::DATE, NULL)
            WHERE id = ($2->>''id'')::UUID
        ',
        _id => _user_id, _data => _data, _constraint => 'task_must_exist'
        );
END
$$
;

CREATE FUNCTION patch_task(_user_id TEXT, _data JSONB) RETURNS TABLE (result JSONB)
    SECURITY DEFINER
    LANGUAGE plpgsql
AS
$$
DECLARE
    validation_result JSONB;
BEGIN

    IF NOT EXISTS (
        SELECT 1 FROM tasks t
        JOIN exams e ON t.exam_id = e.id
        WHERE t.id = (_data->>'id')::UUID AND e.user_id = _user_id::UUID
    ) THEN
        RETURN QUERY SELECT json_status(
            403,
            NULL,
            '42501',
            'user_must_own_exam',
            'You are not authorized to modify this task'
        );
        RETURN;
    END IF;

    IF _data ? 'date' AND (_data->>'date') IS NOT NULL THEN
        validation_result := validate_date(_data->>'date');
        IF validation_result IS NOT NULL THEN
            RETURN QUERY SELECT validation_result;
            RETURN;
        END IF;
    END IF;

    RETURN QUERY
        SELECT rest_helper -- $1 = _id, $2 = _data
        (   'UPDATE tasks
            SET exam_id = COALESCE(($2->>''examId'')::UUID, exam_id),
                name = json_attr_value_d_safe_text($2, ''name'',  name),
                completed  = COALESCE(($2->>''completed'')::BOOLEAN, completed),
                date = COALESCE(($2->>''date'')::DATE, date)
            WHERE id = ($2->>''id'')::UUID
        ',
        _id => _user_id, _data => _data, _constraint => 'task_must_exist'
        );
END
$$
;

CREATE OR REPLACE FUNCTION delete_task(_user_id TEXT, _task_id TEXT)
    RETURNS TABLE (result JSONB)
    SECURITY DEFINER
    LANGUAGE plpgsql
AS
$$
BEGIN
    -- Check if the task belongs to an exam owned by this user
    IF NOT EXISTS (
        SELECT 1
        FROM tasks t
                 JOIN exams e ON t.exam_id = e.id
        WHERE t.id = _task_id::UUID
          AND e.user_id = _user_id::UUID
    ) THEN
        RETURN QUERY SELECT json_status(
            403,
            NULL,
            '42501',
            'user_must_own_exam',
            'You are not authorized to modify this task'
        );
        RETURN;
    END IF;

    -- Perform the delete
    RETURN QUERY
        SELECT rest_helper(
            'DELETE FROM tasks WHERE id = $1',
            _id => _task_id,
            _constraint => 'task_must_exist'
        );
END
$$
;

COMMIT;

-- SELECT *
-- FROM post_task(
--         (SELECT id FROM users WHERE email = 'rest_user@test.com')::TEXT,
--         jsonb_build_object(
--                 'examId', (SELECT id FROM exams WHERE title = 'test exam rest'),
--                 'name', 'Write report 2',
--                 'completed', false,
--                 'date', CURRENT_DATE + INTERVAL '1 day'
--         )
--      );
--
-- select * from task_completion_log;
--
-- select * from tasks;
--
-- SELECT *
-- FROM put_task(
--         (SELECT id FROM users WHERE email = 'rest_user@test.com')::TEXT,
--         jsonb_build_object(
--                 'id', (SELECT id FROM tasks WHERE name = 'Write report 2'),
--                 'examId', (SELECT id FROM exams WHERE title = 'test exam rest'),
--                 'name', 'Write final report',
--                 'completed', true,
--                 'date', CURRENT_DATE + INTERVAL '5 days'
--         )
--      );
-- SELECT *
-- FROM patch_task(
--
--         (SELECT id FROM users WHERE email = 'rest_user@test.com')::TEXT,
--         jsonb_build_object(
--                 'id', (SELECT id FROM tasks WHERE name = 'Write final report'),
--                 'completed', true
--         )
--      );
--
-- SELECT *
-- FROM delete_task(
--         (SELECT id FROM users WHERE email = 'rest_user@test.com')::TEXT,
--         (SELECT id::TEXT FROM tasks WHERE name = 'Write final report')
--
--      );
