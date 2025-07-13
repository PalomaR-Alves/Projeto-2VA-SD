#!/bin/sh

HOST="${DJANGO_DB_HOST:-localhost}"
PORT="${DJANGO_DB_PORT:-5432}"

echo "Aguardando o banco de dados em $HOST:$PORT..."

while ! nc -z "$HOST" "$PORT"; do
  sleep 1
done

echo "Banco de dados está pronto 🎉"

exec "$@"