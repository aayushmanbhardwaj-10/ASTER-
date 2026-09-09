#!/usr/bin/env bash
set -euo pipefail

fail() {
  echo "CONTRACT VIOLATION: $1" >&2
  exit 1
}

contract_dirs=(packages/contracts schemas)

# The wire contract must never encode non-finite numeric values as bare numbers.
if grep -RInE 'NaN|Infinity|-Infinity' "${contract_dirs[@]}" 2>/dev/null; then
  fail "bare non-finite numerical token detected in contract/schema surface"
fi

# Financial periods must expose explicit boundaries; fiscal labels alone are insufficient.
if ! grep -RInE 'start(Boundary|_boundary)' "${contract_dirs[@]}" 2>/dev/null; then
  fail "explicit financial-period boundaries are missing from contract surface"
fi

# Resource identifiers must not be treated as authorization material.
if grep -RInE 'resource(Id|_id).*\b(auth|authorize|permission)|\b(auth|authorize|permission).*resource(Id|_id)' "${contract_dirs[@]}" 2>/dev/null; then
  fail "resource identifier is coupled to authorization semantics"
fi

# Lifecycle tombstones must remain representable.
if ! grep -RIn 'TOMBSTONED' "${contract_dirs[@]}" 2>/dev/null; then
  fail "tombstone lifecycle state missing from contract surface"
fi

# Large analytical results must have a payload-reference contract.
if ! grep -RInE 'PayloadReference|PAYLOAD|byteSize|byte_size' "${contract_dirs[@]}" 2>/dev/null; then
  fail "large-payload reference semantics missing from contract surface"
fi

echo "Contract semantic checks passed."
