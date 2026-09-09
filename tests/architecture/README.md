# Architecture Boundary Tests

Architecture boundaries are enforced by executable checks in `scripts/check-architecture.sh` and CI.

The guard is intentionally conservative: it checks forbidden dependency patterns and required architecture documents without attempting to infer business semantics from source text.

Future domain implementations must extend these checks as new authority boundaries become material.
