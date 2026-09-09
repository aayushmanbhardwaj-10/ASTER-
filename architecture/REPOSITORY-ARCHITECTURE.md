# ASTER AI — Repository Architecture

**Document ID:** ASTER-RA-001  
**Version:** 1.0  
**Status:** ARCHITECTURE FROZEN  
**Depends On:** ASTER-MAS-001 v1.0; ASTER-CON-001 v1.1  

## 1. Purpose

This document defines the physical repository architecture used to implement ASTER while preserving the authority, dependency, security, contract, and trust boundaries established by the frozen system architecture.

The repository is a **monorepo with strict logical isolation**. Physical directories are enforcement boundaries, not an assertion that every directory is a separate deployment.

## 2. Repository Principles

1. **Monorepo With Logical Isolation** — related ASTER components evolve atomically while retaining explicit boundaries.
2. **Contract Authority** — cross-plane contracts have one canonical ownership location.
3. **Dependency Direction** — dependencies follow declared architectural direction; circular dependencies are prohibited.
4. **No Framework Leakage** — framework DTOs, ORM types, provider SDK types, and transport objects do not become domain contracts.
5. **No Authority Leakage** — technical access does not imply architectural authority.
6. **Database Access Is Bounded** — database access is permission-scoped and owned by explicit services; cognitive code cannot perform arbitrary SQL.
7. **Generated Artifacts Are Derived** — generated code is reproducible from canonical schemas and is never an independent source of truth.
8. **Tests Mirror Trust Boundaries** — tests exist at contract, domain, financial, retrieval, verification, security, integration, and system levels.
9. **Historical Versions Remain Interpretable** — historical artifacts retain the versions required to interpret them.
10. **Architecture Is Mechanically Enforced** — practical repository boundaries are checked automatically in CI.
11. **Repository Structure Does Not Equal Deployment** — logical packages may be combined or split operationally without changing authority ownership.
12. **Least Privilege in Code and Runtime** — repository organization supports least-privilege credentials, access, and execution.

## 3. Canonical Repository Tree

```text
ASTER-/
├── apps/
│   ├── system-api/                 # TypeScript / Fastify
│   └── intelligence-api/           # Python / FastAPI
│
├── workers/
│   ├── cognitive/                  # Python
│   ├── calculation/                # Python
│   └── document-ml/                # Python
│
├── packages/
│   ├── contracts/                  # Cross-plane contracts; canonical boundary
│   ├── ontology/                   # Financial semantic definitions
│   ├── data-domain/                # Canonical financial-data domain
│   ├── retrieval-domain/           # Evidence/retrieval domain
│   ├── calculation-domain/         # Calculation specifications/models
│   ├── verification-domain/        # Verification/claim domain
│   └── shared/                     # Minimal genuinely cross-cutting primitives
│
├── services/
│   ├── data/                       # Data-plane services
│   ├── retrieval/                  # Retrieval services
│   ├── calculation/                # Calculation services
│   └── verification/               # Verification services
│
├── database/
│   ├── migrations/                 # Canonical schema migration authority
│   ├── seeds/
│   └── policies/                   # RLS and database security policies
│
├── infrastructure/
│   ├── docker/
│   ├── compose/
│   ├── kubernetes/                # Reserved; orchestrator remains evaluation-dependent
│   ├── terraform/                  # Reserved; IaC technology remains evaluation-dependent
│   ├── observability/
│   └── security/
│
├── schemas/
│   ├── api/
│   ├── events/
│   └── artifacts/
│
├── tests/
│   ├── contract/
│   ├── unit/
│   ├── integration/
│   ├── e2e/
│   ├── financial/
│   ├── golden/
│   ├── reproducibility/
│   ├── retrieval/
│   ├── security/
│   ├── adversarial/
│   └── performance/
│
├── docs/
│   ├── architecture/
│   ├── development/
│   ├── operations/
│   └── security/
│
├── scripts/
├── .github/
│   ├── workflows/
│   └── CODEOWNERS
│
├── architecture/
│   ├── MASTER-ARCHITECTURE.md
│   ├── CONSTITUTION.md
│   ├── AUTHORITY-MODEL.md
│   ├── DEPENDENCY-GRAPH.md
│   ├── CONTRACT-ARCHITECTURE.md
│   └── REPOSITORY-ARCHITECTURE.md
│
├── README.md
├── SECURITY.md
└── CONTRIBUTING.md
```

Directories may be introduced incrementally. A reserved directory does not freeze an implementation technology.

## 4. Monorepo Decision

ASTER uses a monorepo because its system, intelligence, domain, contract, financial-model, retrieval, verification, and infrastructure changes are strongly coupled during early development.

The monorepo must not become an unrestricted shared codebase. Import boundaries, service boundaries, ownership, database permissions, and CI architecture checks are required.

A future split into multiple repositories is an architectural change and must preserve the same authority and contract model.

## 5. Plane-to-Repository Mapping

| Logical plane | Primary repository locations |
|---|---|
| System Plane | `apps/system-api/` |
| Intelligence Plane | `apps/intelligence-api/`, `workers/cognitive/` |
| Knowledge Plane | `packages/ontology/` |
| Data Plane | `packages/data-domain/`, `services/data/`, `database/` |
| Retrieval Plane | `packages/retrieval-domain/`, `services/retrieval/` |
| Calculation Plane | `packages/calculation-domain/`, `services/calculation/`, `workers/calculation/` |
| Verification Plane | `packages/verification-domain/`, `services/verification/` |
| Infrastructure Plane | `infrastructure/`, selected runtime adapters in applications/services |

This mapping is logical. It does not require one process per plane.

## 6. Contract Boundary

`packages/contracts/` is the canonical source for language-independent cross-plane contract semantics.

Contracts may define:

- resource shapes
- value objects
- lifecycle states
- enumerations
- serialization rules
- compatibility metadata
- event envelopes
- API boundary schemas
- artifact-reference semantics

Contracts must not contain financial execution algorithms, retrieval algorithms, authorization logic, LLM prompts, or framework lifecycle behavior.

Cross-plane communication must use contract-defined structures rather than importing internal implementation classes.

## 7. Framework Anti-Corruption Boundaries

Framework and provider types terminate at adapters.

```text
Fastify request
  ↓
System API adapter
  ↓
ASTER contract/domain
```

```text
FastAPI/Pydantic request
  ↓
Intelligence adapter
  ↓
ASTER contract/domain
```

ORM entities, Redis objects, object-storage SDK objects, LLM provider responses, and HTTP framework objects must not leak into domain packages.

## 8. Dependency Rules

Allowed dependency direction is generally:

```text
contracts
  ↑
domain packages
  ↑
plane services / workers
  ↑
applications / runtime adapters
  ↑
infrastructure adapters
```

The arrow indicates that higher-level implementation layers may depend on lower-level contracts/domain abstractions; lower-level domain packages must not depend on application frameworks.

### Explicitly forbidden

- Circular dependencies between domain packages.
- `packages/contracts` depending on applications or services.
- Financial domain packages depending on Fastify/FastAPI.
- Financial domain packages depending directly on LLM provider SDKs.
- Cognitive runtime importing database implementation internals.
- System API importing calculation implementation internals.
- Calculation workers importing workspace mutation logic.
- Retrieval indexes being imported as canonical fact stores.
- UI/application code becoming a source of financial truth.

## 9. System Plane Rules

`apps/system-api/` owns:

- authentication boundary
- authorization
- workspace permissions
- public API
- request governance
- authoritative application-state transitions
- realtime gateway integration
- command acceptance

It must not own material financial mathematics or LLM-provider orchestration internals.

## 10. Intelligence Plane Rules

`apps/intelligence-api/` and `workers/cognitive/` own cognitive orchestration, including:

- semantic interpretation
- model selection
- retrieval orchestration
- tool selection
- reasoning orchestration
- hypothesis generation
- output governance orchestration
- explicit execution state

Cognitive code must not perform arbitrary SQL or mutate authoritative workspace state directly.

## 11. Calculation Plane Rules

Calculation implementation lives under calculation-specific packages/services/workers.

The calculation plane owns:

- calculation specifications
- model metadata
- versioned implementations
- numerical policy
- execution DAGs
- calculation artifacts
- deterministic and controlled stochastic execution

The System Plane must call the calculation boundary rather than reproduce financial formulas.

## 12. Data and Database Ownership

`database/migrations/` is the canonical migration authority.

PostgreSQL remains the authoritative structured system of record.

Repository structure must not imply unrestricted table access. Database roles, RLS policies, service permissions, and query boundaries remain authoritative.

Cognitive code cannot issue arbitrary SQL. Data access must occur through approved data-plane interfaces or explicitly bounded query capabilities.

Database schema definitions, RLS policies, and migrations are reviewed as security-sensitive changes.

## 13. Object Storage and Redis

Object storage adapters belong to infrastructure/data boundaries. Binary payloads are referenced through the contract-defined `PayloadReference` rather than embedded as uncontrolled control-plane responses.

Redis integrations are infrastructure/transport adapters. Redis must not become a canonical financial fact or workspace-state store.

## 14. Generated Artifacts

Generated API schemas, clients, validators, or bindings must be derived from canonical sources.

```text
Canonical schema
    ↓
Generator
    ↓
Generated artifact
```

Generated files are never manually edited. CI should detect generation drift.

The canonical source must be identifiable from repository documentation and, where practical, metadata in generated output.

## 15. Schema Locations

`schemas/api/` contains API boundary schemas where a separate schema artifact is needed.

`schemas/events/` contains durable domain-event schemas.

`schemas/artifacts/` contains artifact serialization schemas.

These schemas must not compete with `packages/contracts/`. `packages/contracts/` owns the semantic contract; schema files are its serialized/protocol representations where applicable.

## 16. Testing Architecture

Testing is organized by trust boundary rather than only by source directory.

### Contract

Serialization, compatibility, non-finite numbers, temporal boundaries, tombstones, payload references, lifecycle semantics, and event compatibility.

### Unit

Pure domain behavior and bounded implementation logic.

### Integration

Service boundaries, PostgreSQL, Redis, object storage, and external adapter behavior.

### E2E

End-to-end system flows across authoritative boundaries.

### Financial

Financial invariants, dimensional integrity, numerical stability, valuation models, pricing models, and controlled failure behavior.

### Golden

Known inputs and approved expected analytical outputs.

### Reproducibility

Repeated execution under identical versioned conditions.

### Retrieval

Recall@K, Precision@K, MRR, NDCG, entity accuracy, temporal accuracy, evidence sufficiency, and conflict recall.

### Security

Tenant isolation, RLS, object authorization, egress, privilege boundaries, secret handling, and audit behavior.

### Adversarial

Contradictions, ambiguous periods, ticker collisions, restatements, malformed XBRL, stale data, non-finite values, missing inputs, false causal narratives, unauthorized evidence, and deleted/tombstoned references.

## 17. CI Architecture Enforcement

CI must progressively enforce:

1. formatting and linting
2. type checking
3. static analysis
4. unit tests
5. contract tests
6. dependency-boundary checks
7. integration tests
8. financial tests
9. security tests
10. retrieval tests
11. golden/reproducibility tests
12. build verification
13. evaluation gates appropriate to changed components

Architecture checks should fail when practical violations include forbidden imports, direct cognitive database access, framework leakage into domain packages, circular dependencies, contract drift, or generated-code drift.

## 18. Versioning

ASTER maintains independent version identities for material artifacts, including as applicable:

- contract version
- ontology version
- data schema version
- model/formula version
- calculation engine version
- retrieval model version
- verification policy version
- execution environment version

Application release versions do not replace these identities.

Historical analytical artifacts retain the versions necessary for interpretation and reproducibility.

## 19. Configuration and Secrets

Configuration is versionable; secrets are not.

The repository should provide non-secret configuration examples such as `.env.example` while excluding actual credentials.

Required controls include secret scanning, dependency scanning, and credential-leak detection.

Secrets must never be embedded in calculation artifacts, logs, source files, generated schemas, or test fixtures.

## 20. Infrastructure Layout

Infrastructure code is separated from application/domain logic.

`infrastructure/compose/` supports the local topology.

`infrastructure/docker/` contains container build definitions.

`infrastructure/kubernetes/` and `infrastructure/terraform/` are reserved until the corresponding evaluation-dependent technologies are selected. Their presence does not constitute a frozen Kubernetes or Terraform decision.

Infrastructure must preserve:

- independent workload scaling
- least privilege
- network boundaries
- secret separation
- resource limits
- environment identity
- observability
- recovery controls

## 21. Local Development

The P0 local topology should support:

```text
PostgreSQL
Redis
S3-compatible object storage emulator
System API
Intelligence API
Cognitive worker
Calculation worker
Document/ML worker
```

Docker Compose is the initial local topology mechanism. Local infrastructure is not considered production-equivalent.

## 22. Ownership and CODEOWNERS

`.github/CODEOWNERS` should reflect architectural ownership boundaries.

At minimum, ownership should distinguish:

- architecture
- contracts
- ontology
- data/database
- calculation
- verification
- infrastructure/security

Ownership is a governance mechanism and does not itself grant runtime authority.

## 23. Git and Change Strategy

`main` remains the canonical branch.

Short-lived branches use patterns such as:

- `feature/<area>-<change>`
- `fix/<area>-<change>`
- `arch/<change>`

Suggested commit prefixes:

- `arch:`
- `feat:`
- `fix:`
- `test:`
- `refactor:`
- `infra:`
- `docs:`
- `security:`

Architecture changes require deliberate review and re-freezing.

## 24. Repository Security Boundaries

Repository permissions must not be treated as application authorization.

Source-level controls and runtime controls are separate:

```text
Repository access
    ≠
Runtime access
    ≠
Tenant authorization
```

The repository must support independent enforcement of each.

## 25. Red-Team Resolutions

### Monorepo becomes monolith
Resolved by mandatory dependency rules and CI architecture checks.

### Shared package becomes dumping ground
Resolved by treating `packages/shared/` as exceptional and minimizing it. Domain concepts belong in their owning domain package.

### Contracts become business logic
Resolved by prohibiting execution algorithms and authority logic from the contract layer.

### System API becomes financial engine
Resolved by explicit calculation-plane ownership and dependency checks.

### Python gains unrestricted database access
Resolved by bounded data interfaces, service permissions, RLS, and architecture tests.

### Database role becomes a tenant-security shortcut
Resolved by preserving authentication, authorization, execution context, service permissions, and RLS as distinct controls.

### Generated schemas become stale
Resolved by generation and drift checks in CI.

### Tests pass while architecture is violated
Resolved by architecture-specific tests alongside functional tests.

### Infrastructure placeholder freezes an implementation
Resolved by explicitly marking undecided technologies as evaluation-dependent.

### Repository tree dictates deployment topology
Resolved by defining repository boundaries as logical/authority boundaries rather than one-to-one deployment requirements.

## 26. Implementation Gate

Repository implementation may begin only after:

1. This repository architecture is frozen.
2. Cross-plane contract architecture remains frozen.
3. Dependency rules are defined.
4. Repository ownership boundaries are defined.
5. Initial test topology is established.
6. Database migration ownership is established.
7. Local development topology is defined.
8. CI architecture-enforcement strategy is established.

## 27. Architectural Change Rule

> If implementation requires violating a repository boundary, the implementation is considered incorrect until the repository architecture and any affected system architecture are deliberately reviewed, versioned, and re-frozen.

## 28. Final Statement

> ASTER's repository is a contract-first monorepo whose physical structure exists to enforce the system's logical authority boundaries. Applications, workers, services, domain packages, contracts, persistence, infrastructure, and tests are separated so that financial truth, computation, intelligence, verification, security, and application state cannot silently collapse into a single implementation layer.
