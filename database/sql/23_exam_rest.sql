/*************************************************************************************
 * Studyflow: REST Functions for exams
 *************************************************************************************/

BEGIN;

/* Cleanup */

DROP FUNCTION IF EXISTS post_exam  (_user_id TEXT, _data JSONB);
DROP FUNCTION IF EXISTS put_exam   (_user_id TEXT, _data JSONB);
DROP FUNCTION IF EXISTS patch_exam (_user_id TEXT, _data JSONB);
DROP FUNCTION IF EXISTS delete_exam(_user_id TEXT);

/* Functions */

CREATE FUNCTION post_exam(_user_id TEXT, _data JSONB)
    RETURNS TABLE (result JSONB)
    SECURITY DEFINER
    LANGUAGE plpgsql
AS
$$
DECLARE
    validation_result JSONB;
BEGIN
    IF (_data->>'userId')::UUID IS DISTINCT FROM _user_id::UUID
    THEN
        RETURN QUERY SELECT json_status(
                                    403,
                                    NULL,
                                    '42501',
                                    'user_id_mismatch',
                                    'The provided userId does not match the authenticated user'
                            );
        RETURN;
    END IF;

    validation_result := validate_date(_data->>'deadline');
    IF validation_result IS NOT NULL THEN
        RETURN QUERY SELECT validation_result;
        RETURN;
    END IF;

    RETURN QUERY
        SELECT rest_helper -- $1 = _id, $2 = _data
        (   'INSERT INTO exams (user_id, title, note, deadline, tag_color)
            VALUES(($1)::UUID,
            json_attr_value_d_safe_text($2, ''title'',  NULL),
            json_attr_value_d_safe_text($2, ''note'',  NULL),
            ($2->>''deadline'')::DATE,
            json_attr_value_d_safe_text($2, ''tagColor'',  NULL)
        )
        ',
        _id := _user_id, _data => _data, _http_status => 201
        );
END
$$
;

CREATE OR REPLACE FUNCTION put_exam(_user_id TEXT, _data JSONB)
    RETURNS TABLE (result JSONB)
    SECURITY DEFINER
    LANGUAGE plpgsql
AS
$$
DECLARE
    validation_result JSONB;
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM exams WHERE id = (_data->>'id')::UUID AND user_id = _user_id::UUID
    ) THEN
        RETURN QUERY SELECT json_status(
            403,
            NULL,
            '42501',
            'user_id_mismatch',
            'The provided user_id does not match the authenticated user'
        );
        RETURN;
    END IF;

    validation_result := validate_date(_data->>'deadline');
    IF validation_result IS NOT NULL THEN
        RETURN QUERY SELECT validation_result;
        RETURN;
    END IF;

    RETURN QUERY
        SELECT rest_helper(
           'UPDATE exams
            SET title = json_attr_value_d_safe_text($2, ''title'', NULL),
                note = json_attr_value_d_safe_text($2, ''note'', NULL),
                deadline = COALESCE(($2->>''deadline'')::DATE, NULL),
                tag_color = json_attr_value_d_safe_text($2, ''tagColor'', NULL)
            WHERE id = ($2->>''id'')::UUID',
           _id => _user_id, -- for audit/logging, not used in query string
           _data => _data,
           _constraint => 'exam_must_exist'
        );
END
$$
;

CREATE FUNCTION patch_exam(_user_id TEXT, _data JSONB) RETURNS TABLE (result JSONB)
    SECURITY DEFINER
    LANGUAGE plpgsql
AS
$$
DECLARE
    validation_result JSONB;
BEGIN

    IF NOT EXISTS (
        SELECT 1 FROM exams WHERE id = (_data->>'id')::UUID AND user_id = _user_id::UUID
    ) THEN
        RETURN QUERY SELECT json_status(
            403,
            NULL,
            '42501',
            'user_id_mismatch',
            'The provided user_id does not match the authenticated user'
        );
        RETURN;
    END IF;

    IF _data ? 'deadline' AND (_data->>'deadline') IS NOT NULL THEN
        validation_result := validate_date(_data->>'deadline');
        IF validation_result IS NOT NULL THEN
            RETURN QUERY SELECT validation_result;
            RETURN;
        END IF;
    END IF;

    RETURN QUERY
        SELECT rest_helper -- $1 = _id, $2 = _data
        (   'UPDATE exams
            SET title = json_attr_value_d_safe_text($2, ''title'',  title),
                note = json_attr_value_d_safe_text($2, ''note'',  note),
                deadline = COALESCE(($2->>''deadline'')::DATE, deadline),
                tag_color = json_attr_value_d_safe_text($2, ''tagColor'',  tag_color)
            WHERE id = ($2->>''id'')::UUID
        ',
        _id => _user_id, _data => _data, _constraint => 'exam_must_exist'
        );
END
$$
;

CREATE OR REPLACE FUNCTION delete_exam(_user_id TEXT, _exam_id TEXT)
    RETURNS TABLE (result JSONB)
    SECURITY DEFINER
    LANGUAGE plpgsql
AS
$$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM exams WHERE id = _exam_id::UUID AND user_id = _user_id::UUID
    ) THEN
        RETURN QUERY SELECT json_status(
            403,
            NULL,
            '42501',
            'user_id_mismatch',
            'The provided user_id does not match the authenticated user'
        );
        RETURN;
    END IF;

    RETURN QUERY
        SELECT rest_helper(
            'DELETE FROM exams WHERE id = $1',
            _id => _exam_id,
            _constraint => 'exam_must_exist'
        );
END
$$
;

COMMIT;

-- BEGIN;
--
-- SELECT *
-- FROM   post_exam(
--         (SELECT id FROM users WHERE email = 'rest_user@test.com')::TEXT,
--         jsonb_build_object(
--                 'userId', (SELECT id FROM users WHERE email = 'rest_user@test.com'),
--                 'title', 'test exam rest',
--                 'deadline', CURRENT_DATE + interval '2 days',
--                 'tagColor', 'black'
--         )
--        );
--
-- select * from exams;
--
-- SELECT *
-- FROM   put_exam(
--         (SELECT id FROM users WHERE email = 'rest_user_2@test.com')::TEXT,
--         jsonb_build_object(
--                 'id', (SELECT id FROM exams WHERE title = 'test exam rest'),
--                 'title', 'Updated Exam Title',
--                 'deadline', CURRENT_DATE + INTERVAL '2 days',
--                 'tag_color', 'red'
--         )
--        );
--
-- select * from exams;
--
-- SELECT *
-- FROM   patch_exam(
--         (SELECT id FROM users WHERE email = 'rest_user@test.com')::TEXT,
--         jsonb_build_object(
--                 'id', (SELECT id FROM exams WHERE title = 'Updated Exam Title'),
--                 'note', 'Patched Title',
--                 'tag_color', 'blue'
--         )
--        );
--
-- select * from exams;
--
-- delete from exams;
-- SELECT *
-- FROM   delete_exam(
--         (SELECT id FROM users WHERE email = 'rest_user@test.com')::TEXT,
--         (SELECT id FROM exams WHERE title = 'test exam rest')::TEXT
--        );
-- select * from exams;
--
-- ROLLBACK;