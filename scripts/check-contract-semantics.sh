#!/usr/bin/env bash
set -euo pipefail

fail() {
  echo "CONTRACT VIOLATION: $1" >&2
  exit 1
}

# The wire contract must never use bare JSON non-finite numbers.
if grep -RInE '\b(NaN|Infinity|-Infinity)\b' packages/contracts schemas tests/contract 2>/dev/null; then
  fail "bare non-finite numerical token detected in contract/schema/test surface"
fi

# Financial periods must expose explicit boundaries; fiscal labels alone are insufficient.
if ! grep -RIn 'start_boundary' packages/contracts schemas 2>/dev/null; then
  fail "explicit financial-period boundaries are missing from contract surface"
fi

# Resource identifiers must not be treated as authorization material.
if grep -RInE 'object_id.*(auth|authorize|permission)|authorization.*object_id' packages/contracts schemas 2>/dev/null; then
  fail "resource identifier is coupled to authorization semantics"
fi

# Lifecycle tombstones must remain representable.
if ! grep -RIn 'TOMBSTONED' packages/contracts schemas 2>/dev/null; then
  fail "tombstone lifecycle state missing from contract surface"
fi

echo "Contract semantic checks passed."
