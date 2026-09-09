#!/usr/bin/env bash
set -euo pipefail

fail() {
  echo "ARCHITECTURE VIOLATION: $1" >&2
  exit 1
}

# Domain/contract layers must not import application frameworks.
if grep -RInE "from (fastify|fastapi|pydantic|typeorm)|require\\((\"|')(fastify|fastapi|pydantic|typeorm)" packages/contracts packages/ontology packages/data-domain packages/retrieval-domain packages/calculation-domain packages/verification-domain 2>/dev/null; then
  fail "framework dependency detected in a domain/contract package"
fi

# Cognitive code must not contain arbitrary SQL access.
if grep -RInE '\\b(SELECT|INSERT|UPDATE|DELETE)\\b|\\b(sqlalchemy|psycopg|asyncpg|pg8000)\\b' apps/intelligence-api workers/cognitive 2>/dev/null; then
  fail "direct SQL/database dependency detected in cognitive code"
fi

# Architecture documents must remain present.
for file in \
  architecture/MASTER-ARCHITECTURE.md \
  architecture/AUTHORITY-MODEL.md \
  architecture/CONTRACT-ARCHITECTURE.md \
  architecture/REPOSITORY-ARCHITECTURE.md; do
  test -f "$file" || fail "required architecture document missing: $file"
done

echo "Architecture guard passed."
