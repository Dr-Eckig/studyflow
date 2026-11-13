#!/usr/bin/env bash
set -e

# $1 password for superuser "postgres" (default: postgres; must be changed in production mode)
# $2 password for user "app" (default: app, must be changed in production mode)
# $3 password for user "web" (default: web, must be changed in production mode)
# $4 frontend port (default: 5173)
# $5 backend port (default: 4000)
# $6 adminer port (default: 11000)
# $7 postgres port (default:5432)
# $8 rest host (default: http://localhost)
# $9 number of seconds until the access token expires (default: 3600)

IMAGE_TAG="studyflow"
APP_DATABASE="studyflow"

POSTGRES_CONTAINER_PORT="5432"
ADMINER_CONTAINER_PORT="8080"
BACKEND_PORT="${5-4000}"
POSTGRES_PORT="${7-5432}"

ADMINER_PORT="${6-11000}"
FRONTEND_PORT="${4-5173}"
FRONTEND_PORT_PRODUCTION="8888"

POSTGRES_PASSWORD_PRODUCTION=$(openssl rand -hex 64)
APP_PASSWORD_PRODUCTION=$(openssl rand -hex 64)
WEB_PASSWORD_PRODUCTION=$(openssl rand -hex 64)

FRONTEND_BACKEND_HOST=http://localhost:$BACKEND_PORT
FRONTEND_BACKEND_HOST_DEVELOPMENT=http://${IMAGE_TAG}_backend:$BACKEND_PORT
FRONTEND_BACKEND_HOST_PRODUCTION=http://${IMAGE_TAG}_production_backend:${BACKEND_PORT}/v1/

TOKEN_EXPIRES="${9-3600}"

declare -A frontend=(
  ["dir"]="frontend"
  ["FRONTEND_PORT"]="$FRONTEND_PORT"
  ["FRONTEND_BACKEND_HOST"]="$FRONTEND_BACKEND_HOST"
  ["FRONTEND_BACKEND_HOST_DEVELOPMENT"]="$FRONTEND_BACKEND_HOST_DEVELOPMENT"
)

declare -A backend=(
  ["dir"]="backend"
  ["PORT"]="$BACKEND_PORT"
  ["SERVER"]="${9-http://localhost}:$BACKEND_PORT"
  ["PG_HOST"]="localhost"
  ["PG_USER"]="web"
  ["PG_PASSWORD"]="${2-web}"
  ["PG_PASSWORD_PRODUCTION"]="$APP_PASSWORD_PRODUCTION"
  ["PG_DATABASE"]="$APP_DATABASE"
  ["PG_PORT"]="$POSTGRES_PORT"
  ["TOKEN_SECRET"]=$(openssl rand -hex 64)
  ["TOKEN_EXPIRES"]="$TOKEN_EXPIRES"
  ["REFRESH_TOKEN_SECRET"]=$(openssl rand -hex 64)
)

declare -A docker=(
  ["dir"]="."
  ["IMAGE_TAG"]="$IMAGE_TAG"

  ["FRONTEND_PORT"]="$FRONTEND_PORT"
  ["FRONTEND_CONTAINER_PORT"]="$FRONTEND_PORT"
  ["FRONTEND_PORT_PRODUCTION"]="$FRONTEND_PORT_PRODUCTION"

  ["FRONTEND_BACKEND_HOST"]="$FRONTEND_BACKEND_HOST"
  ["FRONTEND_BACKEND_HOST_DEVELOPMENT"]="$FRONTEND_BACKEND_HOST_DEVELOPMENT"
  ["FRONTEND_BACKEND_HOST_PRODUCTION"]="$FRONTEND_BACKEND_HOST_PRODUCTION"

  ["BACKEND_PORT"]="$BACKEND_PORT"
  ["BACKEND_CONTAINER_PORT"]="$BACKEND_PORT"
  ["BACKEND_DEVELOPMENT_MODE"]="development"
  ["BACKEND_PRODUCTION_MODE"]="production"
  ["ACCESS_TOKEN_SECRET"]=$(openssl rand -hex 64)
  ["REFRESH_TOKEN_SECRET"]=$(openssl rand -hex 64)

  ["DATABASE_PORT"]="$POSTGRES_PORT"
  ["DATABASE_CONTAINER_PORT"]="$POSTGRES_CONTAINER_PORT"
  ["ADMINER_PORT"]="$ADMINER_PORT"
  ["ADMINER_CONTAINER_PORT"]="$ADMINER_CONTAINER_PORT"
  ["POSTGRES_USER"]="postgres"
  ["POSTGRES_PASSWORD"]="${1-postgres}"
  ["POSTGRES_PASSWORD_PRODUCTION"]="$POSTGRES_PASSWORD_PRODUCTION"
  ["POSTGRES_DATABASE"]="postgres"
  ["APP_USER"]="app"
  ["APP_PASSWORD"]="${2-app}"
  ["APP_PASSWORD_PRODUCTION"]="$APP_PASSWORD_PRODUCTION"
  ["APP_DATABASE"]="$APP_DATABASE"
  ["WEB_USER"]="web"
  ["WEB_PASSWORD"]="${3-web}"
  ["WEB_PASSWORD_PRODUCTION"]="$WEB_PASSWORD_PRODUCTION"
)

create_env_variables(){
  for env in $1
  do
    declare -n dict=$env
    directory=${dict[dir]}
    cd $directory
    echo "Creating $env $2 in $directory"
    [ ! -e $2 ] || rm $2
    for var in "${!dict[@]}"
    do
      [ "$var" != "dir" ] && echo "$var=${dict[$var]}" >> $2
    done
    unset -n dict
    cd - >/dev/null
  done
}

create_env_variables 'frontend backend docker' .env

echo "------------> $0 has finished successfully"