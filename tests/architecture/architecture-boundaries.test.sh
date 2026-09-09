#!/usr/bin/env bash
set -euo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$repo_root"

bash scripts/check-architecture.sh

protected_domains=(
  packages/contracts
  packages/ontology
  packages/data-domain
  packages/retrieval-domain
  packages/calculation-domain
  packages/verification-domain
)

for domain in "${protected_domains[@]}"; do
  if grep -RInE 'from (fastify|fastapi|pydantic|typeorm)' "$domain" 2>/dev/null; then
    echo "Architecture test failed: framework import leaked into $domain." >&2
    exit 1
  fi
done

if grep -RInE '\b(sqlalchemy|psycopg|asyncpg|pg8000)\b' apps/intelligence-api workers/cognitive 2>/dev/null; then
  echo "Architecture test failed: database client leaked into cognitive code." >&2
  exit 1
fi

echo "Architecture boundary tests passed."
