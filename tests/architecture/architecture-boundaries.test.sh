#!/usr/bin/env bash
set -euo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$repo_root"

bash scripts/check-architecture.sh

if grep -RInE 'from (fastify|fastapi|pydantic|typeorm)' packages/*/src 2>/dev/null; then
  echo "Architecture test failed: framework import leaked into a domain package." >&2
  exit 1
fi

if grep -RInE '\b(sqlalchemy|psycopg|asyncpg|pg8000)\b' apps/intelligence-api workers/cognitive 2>/dev/null; then
  echo "Architecture test failed: database client leaked into cognitive code." >&2
  exit 1
fi

echo "Architecture boundary tests passed."
