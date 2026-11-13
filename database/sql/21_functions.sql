/*************************************************************************************
 * Studyflow: Functions for users
 *************************************************************************************/

BEGIN;

/* Cleanup */

DROP FUNCTION IF EXISTS check_password      CASCADE;
DROP FUNCTION IF EXISTS validate_date   CASCADE;

/* Passwords */

-- check_password
-- Returns TRUE if the user password is correct.
-- user_email: user's email address
-- pw:  password not encrypted
CREATE FUNCTION check_password(user_email TEXT, pw TEXT)
    RETURNS BOOLEAN
    RETURNS NULL ON NULL INPUT
    SECURITY DEFINER
    LANGUAGE SQL
AS
$$
SELECT EXISTS (
    SELECT 1
    FROM users
    WHERE users.email = user_email
      AND users.password = crypt(pw, users.password)
);
$$;

-- checks that the given date is in the date format & not in the past
-- _exam_id (optional
CREATE FUNCTION validate_date(_date TEXT, _exam_id UUID DEFAULT NULL)
    RETURNS JSONB
    LANGUAGE plpgsql
AS $$
DECLARE
    deadline_date DATE;
    exam_deadline DATE;
BEGIN
    IF _date IS NULL THEN
        RETURN NULL; -- No deadline to validate
    END IF;

    BEGIN
        deadline_date := _date::DATE;
    EXCEPTION WHEN others THEN
        RETURN json_status(
                400,
                NULL,
                '22007',
                'invalid_date_format',
                'Date format is invalid; expected YYYY-MM-DD'
               );
    END;

    IF deadline_date < CURRENT_DATE THEN
        RETURN json_status(
                400,
                NULL,
                '22023',
                'date_in_past',
                'Date cannot be in the past'
               );
    END IF;

    IF _exam_id IS NOT NULL THEN
        SELECT deadline INTO exam_deadline
        FROM exams
        WHERE id = _exam_id;

        IF NOT FOUND THEN
            RETURN json_status(
                    400,
                    NULL,
                    '02000',
                    'exam_not_found',
                    'The referenced exam does not exist'
                   );
        END IF;

        IF deadline_date > exam_deadline THEN
            RETURN json_status(
                    400,
                    NULL,
                    '22024',
                    'date_after_deadline',
                    'Task date cannot be after the exam deadline'
                   );
        END IF;
    END IF;

    RETURN NULL; -- Valid
END;
$$;

/* Save it */

COMMIT;
