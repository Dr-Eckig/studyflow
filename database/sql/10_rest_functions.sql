/*************************************************************************************
 * Auxiliary functions
 *************************************************************************************/

BEGIN;

/* Cleanup */

DROP FUNCTION IF EXISTS rest_helper                          CASCADE;
DROP FUNCTION IF EXISTS json_status                          CASCADE;
DROP FUNCTION IF EXISTS json_attr_value                      CASCADE;
DROP FUNCTION IF EXISTS json_attr_value_not_null             CASCADE;
DROP FUNCTION IF EXISTS json_attr_value_d_untainted          CASCADE;
DROP FUNCTION IF EXISTS json_attr_value_not_null_d_untainted CASCADE;
DROP FUNCTION IF EXISTS uuid_or_null                         CASCADE;

-- Converts a string into a UUID value, if possible
-- cmp. https://stackoverflow.com/questions/46433459/postgres-select-where-the-where-is-uuid-or-string
CREATE FUNCTION uuid_or_null(str TEXT)
    RETURNS UUID
    LANGUAGE plpgsql
AS
$$
BEGIN
    RETURN str::UUID;
EXCEPTION WHEN invalid_text_representation THEN
    RETURN NULL;
END;
$$;

/* Extraction of JSON Attributes */

-- Extracts the value of an attribute  from a JSON object,
-- if this attribute exists (even if the value equals NULL).
-- Otherwise, it returns the default value passed to the function.
CREATE OR REPLACE FUNCTION
    json_attr_value
(_data JSONB, _attr TEXT, _default TEXT)
    RETURNS TEXT
    IMMUTABLE PARALLEL SAFE
    LANGUAGE SQL
AS
$$
SELECT
    CASE WHEN _data ? _attr THEN (_data->>_attr)::TEXT ELSE _default END;
$$
;

-- json_attr_value_not_null
-- Extracts the value of an attribute from a JSON object,
-- if this attribute exists and is not equal to NULL.
-- Otherwise, it returns the default value passed to the function.
CREATE OR REPLACE FUNCTION
    json_attr_value_not_null
(_data JSONB, _attr TEXT, _default TEXT)
    RETURNS TEXT
    IMMUTABLE PARALLEL SAFE
    LANGUAGE SQL
AS
$$
SELECT
    CASE WHEN _data ? _attr AND _data->>_attr IS NOT NULL THEN (_data->>_attr)::TEXT ELSE _default END;
$$
;

-- Extracts the trimmed value of an attribute (type D_SAFE_TEXT) from a JSON object,
-- if this attribute exists (even if the value equals NULL).
-- Otherwise, it returns the default value passed to the function.
CREATE OR REPLACE FUNCTION
    json_attr_value_d_safe_text
(_data JSONB, _attr TEXT, _default D_SAFE_TEXT)
    RETURNS D_SAFE_TEXT
    IMMUTABLE PARALLEL SAFE
    LANGUAGE SQL
AS
$$
SELECT
    CASE WHEN _data ? _attr
             THEN CASE WHEN _data ->>_attr IS NULL THEN NULL
                       WHEN trim(_data->>_attr::TEXT) <> '' THEN trim(_data->>_attr)::D_SAFE_TEXT
                       ELSE _default
            END
         ELSE _default
        END;
$$
;

-- Extracts the trimmed value of an attribute (type D_SAFE_TEXT) from a JSON object,
-- if this attribute exists (even if the value equals NULL).
-- Otherwise, it returns the default value passed to the function.
CREATE OR REPLACE FUNCTION
    json_attr_value_not_null_d_safe_text
(_data JSONB, _attr TEXT, _default D_SAFE_TEXT)
    RETURNS D_SAFE_TEXT
    IMMUTABLE
    LANGUAGE SQL
AS
$$
SELECT
    CASE WHEN _data ? _attr
             THEN CASE WHEN _data ->>_attr IS NULL THEN _default
                       WHEN trim(_data->>_attr::TEXT) <> '' THEN trim(_data->>_attr)::D_SAFE_TEXT
                       ELSE _default
            END
        END;
$$
;

/* JSON Status */

-- Returns a JSON OBJECT which contains HTTP status information.
CREATE OR REPLACE FUNCTION
    json_status
(_status     INTEGER,
 _id         TEXT,
 _pgstate    TEXT  DEFAULT '00000',
 _constraint TEXT  DEFAULT NULL,
 _message    TEXT  DEFAULT NULL,
 _data       JSONB DEFAULT NULL
)
    RETURNS JSONB
    IMMUTABLE PARALLEL SAFE
    LANGUAGE SQL
AS
$$
SELECT JSONB_BUILD_OBJECT
       ('status',     _status,
        'id',         uuid_or_null(_id),
        'pgstate',    _pgstate ,
        'constraint', _constraint,
        'message',    _message,
        'data',       _data
       );
$$
;

/* REST Helper */

CREATE OR REPLACE FUNCTION
    rest_helper(_sql               TEXT,
                _id                TEXT    DEFAULT NULL,
                _data              JSONB   DEFAULT NULL,
                _content           BYTEA   DEFAULT NULL,
                _thumb             BYTEA   DEFAULT NULL,
                _constraint        TEXT    DEFAULT 'id_must_exist',
                _postgres_status   TEXT    DEFAULT '02000',
                _http_status       INTEGER DEFAULT 200,
                _http_error_status INTEGER DEFAULT 400
)
    RETURNS  TABLE (result JSONB)
    LANGUAGE plpgsql
AS
$$
DECLARE
    _id_      UUID DEFAULT NULL;
    _pgstate_ TEXT;
    _cname_   TEXT;
    _message_ TEXT;

BEGIN     -- $1 = _id, $2 = _data, $3 = _content, $4 = _thumb
EXECUTE _sql || ' RETURNING id' INTO _id_ USING uuid_or_null(_id), _data, _content, _thumb;

IF (_id_ IS NOT NULL)
THEN
    RETURN QUERY
        SELECT json_status(_http_status, _id_::TEXT);
ELSE
    RETURN QUERY
        SELECT json_status(_http_error_status, _id, _postgres_status , _constraint, _message_);
END IF;

EXCEPTION WHEN OTHERS THEN
    GET STACKED DIAGNOSTICS
        _pgstate_ = RETURNED_SQLSTATE,
        _cname_   = CONSTRAINT_NAME,
        _message_ = MESSAGE_TEXT;
    RETURN QUERY
        SELECT json_status(400,
               _id,
               _pgstate_,
               CASE WHEN _cname_ <> '' THEN _cname_ ELSE _message_ END,
               _message_
        );
END
$$
;

/* Save it */
COMMIT;
