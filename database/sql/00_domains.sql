/*************************************************************************************
 * Domains
 *************************************************************************************/
BEGIN;

-- pgcrypto for password encryption
CREATE EXTENSION IF NOT EXISTS pgcrypto;

DROP DOMAIN IF EXISTS D_EMAIL CASCADE;
DROP DOMAIN IF EXISTS D_SAFE_TEXT CASCADE;

-- type for email - can only contain these characters
CREATE DOMAIN D_EMAIL AS VARCHAR
    CHECK (
    value ~* '^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$'
    );

-- text can't have these characters
CREATE DOMAIN D_SAFE_TEXT AS VARCHAR
    CHECK (
    value !~ '[<>"'';]|--|/\*'
    );

COMMIT;