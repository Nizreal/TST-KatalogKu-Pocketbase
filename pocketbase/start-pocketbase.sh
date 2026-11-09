#!/bin/sh
set -eu

: "${POCKETBASE_SCHEMA:?Set POCKETBASE_SCHEMA to a schema JSON basename}"
: "${PB_SUPERUSER_EMAIL:?Set PB_SUPERUSER_EMAIL}"
: "${PB_SUPERUSER_PASSWORD:?Set PB_SUPERUSER_PASSWORD}"

pocketbase superuser upsert "$PB_SUPERUSER_EMAIL" "$PB_SUPERUSER_PASSWORD" --dir=/pb_data
exec pocketbase serve --http=0.0.0.0:8090 --dir=/pb_data --migrationsDir=/pb_migrations
