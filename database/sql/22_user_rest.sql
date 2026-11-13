/*************************************************************************************
 * Studyflow: REST Functions for users
 *************************************************************************************/

BEGIN;

/* Cleanup */

DROP FUNCTION IF EXISTS post_user   (          _data JSONB);
DROP FUNCTION IF EXISTS put_user    (_id TEXT, _data JSONB);
DROP FUNCTION IF EXISTS patch_user  (_id TEXT, _data JSONB);
DROP FUNCTION IF EXISTS delete_user (_id TEXT);

/* Functions */

CREATE FUNCTION post_user(_data JSONB) RETURNS TABLE (result JSONB)
    SECURITY DEFINER
    LANGUAGE plpgsql
AS
$$
BEGIN
    RETURN QUERY
        SELECT rest_helper
            (   'INSERT INTO users(email, password, dark_mode, language)
                VALUES( json_attr_value_d_safe_text($2, ''email'',  NULL),
                        ($2->>''password'')::TEXT,
                        COALESCE(($2->>''darkMode'')::BOOLEAN, FALSE),
                        COALESCE(json_attr_value_d_safe_text($2,''language'', NULL), ''de'')
                )',
            _data => _data, _http_status => 201
           );
END
$$
;

CREATE FUNCTION put_user(_id TEXT, _data JSONB) RETURNS TABLE (result JSONB)
    SECURITY DEFINER
    LANGUAGE plpgsql
AS
$$
BEGIN
    RETURN QUERY
        SELECT rest_helper -- $1 = _id, $2 = _data
            (   'UPDATE users
                SET     email     = json_attr_value_d_safe_text($2, ''email'',  NULL),
                        password = COALESCE(($2->>''password'')::TEXT, password),
                        dark_mode = COALESCE(($2->>''darkMode'')::BOOLEAN, dark_mode),
                        language = COALESCE(json_attr_value_d_safe_text($2, ''language'', NULL), language)
                WHERE  id = $1
              ',
                _id => _id, _data => _data, _constraint => 'user_must_exist'
               );
END
$$
;

CREATE FUNCTION patch_user(_id TEXT, _data JSONB) RETURNS TABLE (result JSONB)
    SECURITY DEFINER
    LANGUAGE plpgsql
AS
$$
BEGIN
    RETURN QUERY
        SELECT rest_helper -- $1 = _id, $2 = _data
            (   'UPDATE users
                SET     email    = json_attr_value_d_safe_text($2, ''email'', email),
                        password = json_attr_value_not_null   ($2, ''password'', password)::TEXT,
                        dark_mode = COALESCE(($2->>''darkMode'')::BOOLEAN, dark_mode),
                        language = COALESCE(json_attr_value_d_safe_text($2, ''language'', NULL), language)
                WHERE   id = $1
            ',
            _id => _id, _data => _data, _constraint => 'user_must_exist'
            );
END
$$
;

CREATE FUNCTION delete_user(_id TEXT) RETURNS TABLE (result JSONB)
    SECURITY DEFINER
    LANGUAGE plpgsql
AS
$$
BEGIN
    RETURN QUERY
        SELECT rest_helper -- $1 = _id
        (   'DELETE
            FROM   users
            WHERE  id = $1
        ',
        _id => _id, _constraint => 'user_must_exist'
        );
END
$$
;

COMMIT;

-- BEGIN;
--
-- SELECT *
-- FROM   post_user
--        ( '{  "email":    "rest_user@test.com",
--              "password": "changeit",
--              "darkMode" : "true",
--              "language": "en"
--           }'
--        );

-- select * from users;
-- SELECT *
-- FROM   put_user
--        ( (SELECT id::TEXT from users where email = 'rest_user@test.com'),
--         '{   "email":    "rest_user_put@test.com",
--              "password":   "changed_put",
--              "darkMode" : "true",
--              "language": "en"
--         }'
--        );
--
-- select * from users;
-- SELECT *
-- FROM   patch_user
--        ( (SELECT id::TEXT from users where email = 'rest_user_patch_2@test.com'),
--         '{   "password":"changed_patch_2",
--              "email": "rest_user_patch_2@test.com",
--              "language": "es"
--         }
--         '
--        );
--
-- select * from users;
--
-- select * from delete_user
-- ( (select id::TEXT from users where email = 'rest_user@test.com'));
--
-- select * from users;
--
-- rollback;