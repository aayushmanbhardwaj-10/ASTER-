# ASTER AI — Repository Foundation

**Document ID:** ASTER-RF-001  
**Version:** 1.1  
**Status:** FOUNDATION HARDENED  
**Depends On:** ASTER-RA-001 v1.0; ASTER-CON-001 v1.1  

## Scope

This document records the repository foundation and its hardening gate. It establishes repository scaffolding, contract projections, service entrypoints, local infrastructure placeholders, dependency-management policy, executable architecture boundaries, and contract semantic checks without implementing financial business logic.

## Established

- TypeScript workspace root.
- System API / Fastify foundation.
- Python Intelligence API / FastAPI foundation.
- TypeScript and Python projections of canonical contract semantics.
- Local PostgreSQL, Redis, and S3-compatible object-storage topology.
- Database migration/policy/seed ownership directories.
- Contract, financial, security, and architecture test locations.
- Architecture guard in CI.
- Executable architecture boundary tests.
- Executable contract semantic checks.
- CODEOWNERS and repository security hygiene.
- Environment example without real secrets.

## Dependency-management policy

The repository treats dependency reproducibility as a foundation requirement. TypeScript dependencies must be installed from a committed npm lockfile before dependency-heavy implementation begins. Python dependencies must likewise gain a committed lock representation before dependency-heavy Python services are introduced. Until those lockfiles are committed, CI must continue to expose the unresolved hardening state rather than implying full reproducibility.

The current foundation intentionally keeps dependency surface minimal. This gate does not fabricate lockfiles or claim reproducibility that has not been mechanically verified.

## Validation gate

CI must validate:

1. TypeScript compilation.
2. TypeScript tests.
3. Python importability.
4. Architecture boundary tests.
5. Contract semantic checks.
6. Presence of frozen architecture documents.

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
