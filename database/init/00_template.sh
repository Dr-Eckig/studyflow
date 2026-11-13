#!/usr/bin/env bash
set -e

# pgcrypto ins necessary for DB that uses UUID
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DATABASE" <<-EOSQL
\connect $POSTGRES_DATABASE
CREATE EXTENSION IF NOT EXISTS pgcrypto;
EOSQL

echo "------------> 00_template.sh has finished successfully"
