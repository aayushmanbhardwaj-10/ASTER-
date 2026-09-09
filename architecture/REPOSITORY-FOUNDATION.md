# ASTER AI — Repository Foundation

**Document ID:** ASTER-RF-001  
**Version:** 1.0  
**Status:** FOUNDATION ESTABLISHED  
**Depends On:** ASTER-RA-001 v1.0; ASTER-CON-001 v1.1  

## Scope

This document records the initial implementation foundation. It establishes repository scaffolding, contract projections, service entrypoints, local infrastructure placeholders, and CI enforcement without implementing financial business logic.

## Established

- TypeScript workspace root.
- System API / Fastify foundation.
- Python Intelligence API / FastAPI foundation.
- TypeScript and Python projections of canonical contract semantics.
- Local PostgreSQL, Redis, and S3-compatible object-storage topology.
- Database migration/policy/seed ownership directories.
- Contract, financial, security, and architecture test locations.
- Architecture guard in CI.
- CODEOWNERS and repository security hygiene.
- Environment example without real secrets.

## Explicitly not implemented

- Financial models.
- Canonical financial fact persistence.
- Retrieval algorithms.
- LLM orchestration.
- Entity resolution.
- Verification engine.
- Workspace persistence.
- Production infrastructure.

Those components require their own domain contracts and implementation gates.

## Foundation validation

The foundation is intentionally minimal. CI validates TypeScript compilation/tests, Python importability, and presence of frozen architecture documents. Stronger architecture-boundary tests will be added before the first material domain implementation.

## Dependency-management note

The repository currently uses npm workspaces for the TypeScript foundation and standard PEP 621 metadata for Python. Exact lockfile/tooling strategy remains an implementation detail to be hardened before dependency-heavy services are introduced. This does not change the frozen architecture.
