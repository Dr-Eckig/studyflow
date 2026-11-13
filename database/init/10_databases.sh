#!/usr/bin/env bash
set -e

psql -v ON_ERROR_STOP=1 --username "${POSTGRES_USER}" -c "CREATE USER ${APP_USER} WITH LOGIN CREATEDB PASSWORD '${APP_PASSWORD}';"
psql -v ON_ERROR_STOP=1 --username "${POSTGRES_USER}" -c "CREATE USER ${WEB_USER} WITH LOGIN CREATEDB PASSWORD '${WEB_PASSWORD}';"

FILES=/tmp/*.sql

echo "Creating Database ${APP_DATABASE}"
createdb --username ${APP_USER} ${APP_DATABASE}
psql -v ON_ERROR_STOP=1 --username "${POSTGRES_USER}" -d ${APP_DATABASE} -c "GRANT EXECUTE ON FUNCTION pg_read_binary_file(text) TO ${APP_USER};"

echo "Inserting schema and data into ${APP_DATABASE}"
for f in $FILES
do
  if [ "$f" != "99_grant.sql" ]; then
    echo "Processing $f"
    psql -v ON_ERROR_STOP=1 --username ${APP_USER} -f $f ${APP_DATABASE}
  fi
done

if ls /tmp/seeds/*.sql > /dev/null 2>&1; then
  echo "Applying mock seed data..."
  for f in /tmp/seeds/*.sql; do
    echo "Seeding: $f"
    psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" -f "$f" ${APP_DATABASE}
  done
else
  echo "No seed files found. Skipping seed step."
fi

psql -v ON_ERROR_STOP=1 --username ${POSTGRES_USER} -f "/tmp/99_grant.sql" ${APP_DATABASE}
echo "------------> 10_databases.sh has finished sucessfully"