# Architecture Boundary Tests

Executable boundary checks live here and in `scripts/check-architecture.sh`.

The checks intentionally validate only mechanically enforceable architectural constraints: forbidden framework/database dependencies in protected layers and required architecture documents. They do not attempt to infer financial semantics from source text.
