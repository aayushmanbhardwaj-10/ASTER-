# ASTER AI — Contract Architecture

**Document ID:** ASTER-CON-001  
**Version:** 1.1  
**Status:** CONTRACT ARCHITECTURE FROZEN  
**Depends on:** ASTER-MAS-001 v1.0  
**Red-Team:** 15-point gate resolved; five critical implementation attacks incorporated

## 1. Purpose

This specification defines the canonical cross-plane contracts that connect ASTER's frozen architecture to implementation. Contracts define identity, ownership, lifecycle, immutability, versioning, provenance, authorization scope, validation responsibility, serialization, payload boundaries, and producer/consumer boundaries.

A contract is an architectural boundary, not an implementation-specific class, ORM entity, database table, or API framework type.

## 2. Contract Rules

1. Contracts are language-independent at the domain level.
2. TypeScript and Python representations must preserve the same semantic contract.
3. Database schemas, API DTOs, ORM models, and internal types may be projections/adapters of canonical contracts.
4. Canonical contracts must not depend on Fastify, FastAPI, TypeORM, Pydantic, or any other framework.
5. Identity is distinct from display names and external identifiers.
6. Tenant/workspace scope is explicit wherever data can be private or tenant-owned.
7. Temporal fields are explicit where historical interpretation matters.
8. Epistemic state is never inferred merely from object type.
9. Provenance is part of material financial results.
10. Mutable operational state and immutable analytical artifacts are distinct concepts.
11. Version changes are explicit; silent semantic mutation is prohibited.
12. Secrets, credentials, tokens, and raw chain-of-thought are never domain-contract fields.
13. Non-finite numerical values are never serialized as bare JSON numbers, strings, or null equivalents.
14. Large analytical payloads are separated from control-plane metadata through explicit artifact references.
15. Security context is established by trusted execution context; identifiers are not security credentials.
16. Historical financial periods use explicit temporal boundaries and calendar semantics rather than fiscal labels alone.
17. Deleted or inaccessible referenced objects have explicit tombstone semantics so consumers can degrade without dereference crashes.

## 3. Contract Envelope

Where applicable, persisted or cross-service domain objects use a common conceptual envelope:

```text
contract_type
contract_version
object_id
scope
created_at
updated_at
status
provenance_ref
schema_version
```

Not every object requires every field. The envelope is a design pattern, not a mandatory database row shape.

`tenant_id` and `workspace_id` are represented through `scope` where applicable. They remain mandatory for tenant-owned resources but are not blindly repeated into every global object.

## 4. Identity Contracts

### 4.1 Entity

Represents a legal/economic organization or other canonical financial entity.

Required semantics:
- entity_id
- entity_type
- canonical_name
- jurisdiction where applicable
- lifecycle/status
- provenance
- temporal validity

Owner: GEM / Data Plane.  
Identity is immutable; attributes may have versioned temporal states.

### 4.2 Security

Represents an investable financial instrument distinct from its issuer/entity.

Required semantics:
- security_id
- issuer_entity_id where applicable
- security_type
- venue/jurisdiction where applicable
- lifecycle
- temporal validity
- provenance

Owner: Data Plane / GEM.

### 4.3 Identifier

Represents an external identifier or alias.

Required semantics:
- identifier_id
- identifier_type
- identifier_value
- target_type
- target_id
- issuer/venue/jurisdiction context where applicable
- effective_from/effective_to
- source
- confidence/verification state

Owner: GEM.

An identifier is never itself the canonical entity or security identity.

## 5. Knowledge Contracts

### 5.1 FinancialConcept

Represents a canonical financial meaning in the Master Ontology.

Fields conceptually include:
- concept_id
- concept_version
- canonical_name
- definition
- category/domain
- semantic relationships
- applicable accounting frameworks
- industry context
- jurisdiction context
- unit semantics
- formula specification references where applicable
- constraints
- source references
- effective/version dates

Owner: Knowledge Plane.

### 5.2 FormulaSpecification

Represents semantic calculation requirements without embedding executable code as the authoritative definition.

Includes:
- formula_id/version
- semantic definition
- input specifications
- output specification
- units/dimensions
- constraints
- assumptions
- applicable context
- implementation reference

Owner: Knowledge/Calculation boundary.

## 6. Data Contracts

### 6.1 Source

Represents an external or user-provided source and its evidentiary/rights profile.

Includes:
- source_id
- source_type
- publisher/provider
- authority_class
- jurisdiction/coverage
- methodology
- licensing/rights metadata
- retrieval method
- update frequency
- reliability profile
- effective dates
- status

Owner: Data Plane.

### 6.2 Provenance

Represents lineage connecting an observation or derived artifact to its source and transformations.

Includes:
- provenance_id
- source references
- acquisition metadata
- raw artifact references
- transformation chain
- processing versions
- actor/system identity where relevant
- timestamps
- rights constraints

Owner: Data Plane.

### 6.3 FinancialFact

Represents a canonical contextualized financial observation/fact.

Includes:
- fact_id
- entity/security reference
- concept reference
- value
- unit
- currency
- temporal period object
- dimensions
- reporting basis
- economic time
- publication time
- vendor knowledge time where applicable
- ASTER knowledge time
- epistemic state
- source/provenance
- validation/reconciliation status

Owner: Data Plane / canonical financial store.

FinancialFact is immutable after canonicalization. Corrections/restatements create new states or facts and preserve lineage.

### 6.4 FinancialPeriod

A fiscal label is descriptive metadata, not the primary temporal identity.

A material period must preserve:
- period_type
- start_boundary
- end_boundary
- boundary_semantics
- fiscal_label where available
- fiscal_year where applicable
- fiscal_period where applicable
- calendar/fiscal-calendar reference
- timezone/date semantics appropriate to the source

For interval-based financial periods, ASTER uses an explicit boundary convention. The preferred internal representation is a half-open interval `[start, end)` where practical, avoiding invented `23:59:59` timestamps and avoiding ambiguity around leap seconds, timezone conversions, and sub-second precision.

Example:

```text
period_type: FISCAL_YEAR
start_boundary: 2023-10-01
end_boundary: 2024-10-01
boundary_semantics: [start, end)
fiscal_label: FY2023
fiscal_calendar: issuer_calendar_v1
```

Fiscal labels such as `FY2023` are never sufficient by themselves for temporal comparison.

### 6.5 DataClassification

Controlled classification:

`PUBLIC | CONFIDENTIAL | RESTRICTED | HIGHLY_RESTRICTED`

Classification is policy metadata and must not be treated as epistemic truth.

## 7. Evidence Contracts

### 7.1 Evidence

Polymorphic evidence base with:
- evidence_id
- evidence_type
- canonical_reference
- scope where applicable
- source/provenance
- context
- epistemic state
- rights/access state
- snapshot identity
- lifecycle state
- creation metadata

Evidence may be `ACTIVE`, `TOMBSTONED`, `RESTRICTED`, or `PURGED` according to policy. Consumers must handle non-active references without assuming the underlying object is dereferenceable.

Concrete types:
- FactEvidence
- DocumentEvidence
- TableSliceEvidence
- DerivedEvidence
- ConflictEvidence

### 7.2 FactEvidence

References a canonical financial fact and the exact contextual representation used for an execution.

### 7.3 DocumentEvidence

References an immutable source artifact and a structurally identified location/span/section. It must not imply that the document itself is authoritative for every extracted claim.

### 7.4 TableSliceEvidence

References a canonical table plus deterministic slice definition:
- table_id
- selected rows/columns
- cell coordinates
- units
- currency
- periods
- source location
- parent table hash
- transformation/query definition

Large slices must be represented through an immutable payload/artifact reference rather than embedded wholesale in control-plane messages.

### 7.5 DerivedEvidence

Represents evidence produced from authoritative inputs through a recorded transformation or calculation. It must reference its inputs and transformation/calculation artifact.

### 7.6 ConflictEvidence

Represents competing evidence without prematurely selecting a winner.

Includes:
- candidate references
- conflict type
- comparison context
- evidentiary weights
- reconciliation state
- resolution where established

States:
`UNRESOLVED | RECONCILED | SUPERSEDED | CONTEXTUALLY_DISTINCT | REQUIRES_REVIEW`

## 8. Numerical and Payload Contracts

### 8.1 FinancialNumber

Material numerical values must use a tagged representation rather than relying on language-specific floating-point JSON behavior.

Conceptually:

```text
FinancialNumber
├── FINITE
│   ├── value
│   ├── representation
│   ├── precision/scale where applicable
│   └── numeric metadata
└── NON_FINITE
    ├── status
    ├── error_code
    └── diagnostic metadata
```

Bare `NaN`, `Infinity`, `-Infinity`, or language-specific non-finite float encodings are prohibited on cross-plane contracts.

A failed calculation must not serialize to `null`, zero, an empty string, or a textual fake-number representation.

Examples:

```text
GOOD
{
  "status": "FAILED",
  "error_code": "NON_CONVERGENT_INFINITY"
}

GOOD
{
  "status": "FINITE",
  "value": "0.0842",
  "representation": "DECIMAL"
}
```

The exact wire encoding may be JSON-based, but the semantic contract must remain language-independent. A later binary numerical artifact may use Arrow/Parquet or another approved format while preserving the same semantics.

### 8.2 PayloadReference

Large data is not transported through ordinary control-plane JSON responses.

A `PayloadReference` conceptually contains:
- artifact_id
- storage_class
- media_type
- serialization_format
- content_hash
- byte_size
- schema_version
- encryption/classification metadata
- scoped access reference
- expiration where applicable

Control-plane responses return metadata and references. Heavy payloads are stored in object storage or an approved analytical artifact store.

Typical large-payload formats include Apache Arrow or Parquet where their type/columnar characteristics are appropriate. The format is selected by artifact type and evaluation; it is not assumed to be the canonical domain contract itself.

Example:

```text
{
  "artifact_id": "calc_992",
  "status": "SUCCEEDED",
  "payload": {
    "format": "PARQUET",
    "object_ref": "obj_...",
    "content_hash": "sha256:...",
    "byte_size": 52428800
  }
}
```

Clients and services must not treat storage URIs alone as authorization. Access requires a scoped capability or authorized retrieval operation.

## 9. Calculation Contracts

### 9.1 CalculationSpecification

Request to execute a named/versioned financial model or formula.

Includes:
- calculation_request_id
- formula/model reference + version
- typed inputs
- assumption references
- scenario reference
- context
- numeric policy
- execution constraints
- requested output
- execution-context reference

The specification is declarative. It does not contain arbitrary executable code.

### 9.2 CalculationArtifact

Durable record of a completed or failed calculation.

Includes:
- calculation_id
- model/formula version
- immutable input snapshot reference
- assumption snapshot reference
- scenario/effective-state reference
- execution graph
- numeric policy
- result or structured failure
- units/currency
- warnings
- verification references/state
- provenance
- environment identity
- execution timestamps
- large-output PayloadReference where applicable

It is immutable after completion except for separately versioned verification metadata where policy permits. The calculation payload and its control-plane metadata remain separately addressable.

### 9.3 NumericPolicy

Includes representation, precision, scale, rounding mode, intermediate precision, output precision, and tolerance. Display formatting is separate.

## 10. Analytical Contracts

### 10.1 Model

Represents a versioned analytical model definition.

Includes:
- model_id/version
- model_type
- semantic purpose
- required inputs
- assumptions
- constraints
- outputs
- applicability context
- implementation reference
- evaluation status

### 10.2 Scenario

Represents an explicit delta over an immutable parent analytical state.

Includes:
- scenario_id
- parent_state_reference
- delta set
- assumptions introduced/changed
- provenance/author
- created_at
- status

A scenario never silently overwrites its parent.

## 11. Reasoning Contracts

### 11.1 Claim

Represents a material assertion produced or referenced by ASTER.

Includes:
- claim_id
- claim type
- content/reference
- epistemic state
- support relations
- derivation relations
- assumptions/conflicts
- materiality/governance metadata
- verification state

Claim types:
`OBSERVATIONAL | DERIVED | INFERENTIAL | CAUSAL | HYPOTHETICAL | UNKNOWN`

### 11.2 VerificationResult

Represents verification of a claim, calculation, evidence object, or analytical artifact.

Includes:
- verification_id
- target reference
- verification scope/type
- checks performed
- supporting evidence
- failures/conflicts
- verification state
- verifier/version
- timestamp
- reproducibility metadata

States:
`NOT_CHECKED | CHECKING | VERIFIED | PARTIALLY_VERIFIED | ASSUMPTION_DEPENDENT | CONFLICTED | UNSUPPORTED | UNVERIFIABLE | FAILED`

Verification does not become a universal confidence score.

## 12. Workspace and Runtime Contracts

### 12.1 Workspace

Represents the persistent user analytical environment.

Includes:
- workspace_id
- tenant_id
- owner/memberships through authorization subsystem
- workspace status
- base analytical state reference
- configuration/policy references
- timestamps

Authorization is not embedded as an informal list of user IDs inside financial objects.

### 12.2 Execution

Represents a cognitive/analytical runtime execution.

Includes:
- execution_id
- parent/request reference
- task type
- tenant/workspace scope
- execution status
- execution event references
- evidence snapshot reference
- model registry references
- policy context
- started/completed timestamps
- terminal outcome

Execution is a traceable runtime object, not canonical financial truth.

### 12.3 Job

Represents durable asynchronous work.

Includes:
- job_id
- job_type
- execution reference where applicable
- tenant/workspace scope
- priority
- idempotency key
- payload reference
- state
- retry count
- resource constraints
- timestamps
- terminal result reference

States:
`CREATED | QUEUED | RUNNING | SUCCEEDED | FAILED | CANCELLED | TIMED_OUT | RETRYING`

### 12.4 Event

Represents a durable domain or operational event.

Includes:
- event_id
- event_type/version
- aggregate/entity reference
- tenant/workspace scope where applicable
- event timestamp
- causation/correlation references
- payload or PayloadReference
- schema version

Events describe committed state transitions where authoritative state is involved.

## 13. ExecutionContext Contract

ExecutionContext binds an operation to its authorized environment.

Conceptually includes:

- request_id
- trace_id
- execution_id
- job_id where applicable
- tenant_id
- workspace_id
- actor/principal reference
- authorization scope
- data classification ceiling
- allowed evidence scope
- model endpoint policy
- temporal context
- rights/export constraints
- resource limits
- expiration
- context version

ExecutionContext is security-sensitive and must never be accepted wholesale from an untrusted LLM or client.

### 13.1 Resource references and tenancy

ASTER does **not** use tenant-bearing composite URNs as the primary security mechanism.

A resource reference may carry scope context for routing, validation, or observability, but the canonical object identifier remains opaque and non-authorizing.

The security rule is:

```text
Client / LLM
   ↓ untrusted request
System authorization
   ↓
Trusted ExecutionContext
   ↓
Scoped resource reference
   ↓
Service authorization + RLS/storage policy
   ↓
Resource
```

Therefore:

- `fact_id` alone is not sufficient for an authorized cross-plane operation.
- A tenant-bearing identifier is not itself proof of authorization.
- A compromised worker cannot gain access merely by constructing another tenant's ID/reference.
- PostgreSQL RLS remains a final enforcement boundary.
- Object-storage capabilities are scoped and short-lived where supported.

Tenant identity may be visible in trusted execution context and authorization metadata without being baked into every canonical identifier. This avoids identifier-based authorization, unnecessary tenant disclosure, and rigid identity coupling.

## 14. Tombstone Semantics

Deletion, crypto-shredding, retention expiry, legal restriction, or policy revocation may make a referenced object unavailable while historical references remain.

A referenced object therefore has explicit lifecycle visibility:

```text
ACTIVE
TOMBSTONED
RESTRICTED
PURGED
```

A tombstone response may preserve only the minimum non-sensitive metadata required for referential integrity and audit semantics, for example:

```text
{
  "object_id": "fact_492",
  "lifecycle_state": "TOMBSTONED",
  "tombstone_reason": "TENANT_ERASURE",
  "deleted_at": "..."
}
```

The presence of a tombstone does not imply that the deleted financial content remains recoverable. Highly restricted data may be cryptographically destroyed while the minimum non-sensitive referential record survives under retention policy.

Consumers must:
- never crash on tombstoned references;
- never attempt unauthorized recovery;
- avoid displaying sensitive deleted metadata;
- distinguish `TOMBSTONED` from `NOT_FOUND` where policy requires;
- preserve historical relationship semantics without resurrecting erased data.

## 15. Relationship Rules

Canonical relationships include:

```text
Entity ← Identifier
Entity ← Security
FinancialFact → Entity/Security
FinancialFact → FinancialConcept
FinancialFact → Source
FinancialFact → Provenance
Evidence → FinancialFact / Document / Calculation
CalculationSpecification → Model / Formula / Inputs
CalculationArtifact → CalculationSpecification / Inputs / Scenario
Scenario → Parent Analytical State
Claim → Evidence / Calculation / Claim / Assumption
VerificationResult → Claim / Calculation / Evidence / Artifact
Execution → Evidence Snapshot / Model Registry / Events
Job → Execution
Event → Aggregate / Causation / Correlation
Workspace → Analytical State / Policies
```

References must remain resolvable according to lifecycle policy, but resolvability never overrides authorization or deletion policy.

## 16. Immutability Matrix

| Contract | Default mutation policy |
|---|---|
| Entity identity | Immutable; temporal attributes versioned |
| Security identity | Immutable; lifecycle versioned |
| Identifier | Append/version with temporal validity |
| FinancialConcept | Versioned |
| FormulaSpecification | Versioned |
| Source | Versioned metadata |
| Provenance | Append-only lineage |
| FinancialPeriod | Immutable within a fact state |
| FinancialFact | Immutable canonical fact; revisions are new states |
| Evidence snapshot | Immutable once used in execution |
| CalculationSpecification | Immutable execution request |
| CalculationArtifact | Immutable completed artifact |
| Model | Versioned |
| Scenario | Immutable delta after creation |
| Claim | Append/versioned as analytical output |
| VerificationResult | Append/versioned verification record |
| Workspace state | Immutable analytical baseline; branch/delta |
| Execution | Append-only runtime history with terminal state |
| Job | Controlled lifecycle transitions |
| Event | Append-only |
| ExecutionContext | Immutable for an execution; scoped/expiring |
| PayloadReference | Immutable content identity; access capability separately expires |

## 17. Validation Ownership

| Validation | Owner |
|---|---|
| Authentication | System Plane |
| Authorization | System Plane / policy boundary |
| Tenant isolation | System + DB RLS + storage policy |
| Financial semantic validity | Knowledge Plane |
| Canonical fact validity | Data Plane |
| Entity resolution | GEM/Data Plane |
| Evidence authorization | Retrieval/Security boundary |
| Calculation input validity | Calculation Plane |
| Numerical validity | Calculation Plane |
| Model applicability | Calculation/Knowledge/Verification |
| Claim verification | Verification Plane |
| Output policy | Output Governance |
| External egress | Egress Security boundary |
| Serialization/schema validity | Contract boundary / producer + consumer validation |
| Payload integrity | Artifact/storage boundary |

## 18. Cross-Service Contract Rules

System Plane ↔ Intelligence Plane communication must use explicit versioned contracts.

Python cannot directly mutate authoritative System Plane state. Analytical results return through an authoritative state transition path.

Streaming events must distinguish:
- informational execution events
- authoritative committed-state events

No event should imply committed state before commit.

Large analytical results must use PayloadReference rather than synchronous oversized JSON responses.

## 19. Security Rules

- Tenant scope must be explicit for tenant-owned contracts.
- Worker identity is never derived solely from a job payload field.
- Database access must be constrained by authenticated/scoped execution context and PostgreSQL RLS.
- Object storage access must be short-lived and scope-limited where possible.
- Data classification and provenance travel with evidence sufficiently to enforce egress policy.
- Secrets are references to secret-management infrastructure, never plaintext contract fields.
- Audit events are separate from ordinary application state.
- Identifiers and resource references are not authorization credentials.
- Tombstones must not leak restricted content.
- Serialization must not turn failure into a valid-looking financial value.

## 20. Contract Anti-Patterns

The following are prohibited:

- ORM entities becoming the canonical domain model by accident.
- LLM-generated JSON being accepted as authoritative without validation.
- Tenant IDs trusted from model output or client payload without authorization.
- Generic `metadata: any` replacing typed financial semantics.
- A single `confidence` number replacing epistemic/verification dimensions.
- A single `value` field without unit/currency/context for material financial facts.
- A calculation result without immutable input identity.
- A scenario that mutates parent state.
- An event emitted before authoritative commit.
- A retrieval index becoming a second financial truth store.
- Credentials embedded in execution or calculation artifacts.
- Bare `NaN`, `Infinity`, or `-Infinity` in cross-plane JSON.
- Non-finite numeric failures represented as `null`, zero, empty string, or fake numeric strings.
- Large binary/analytical payloads embedded directly in control-plane messages.
- Fiscal labels used as the sole temporal identity of financial periods.
- Tenant-bearing IDs treated as authorization proof.
- Foreign-key failure assumed to be the only possible state after deletion.

## 21. Red-Team Resolution Record

The original 15-point contract gate was attacked against five high-impact implementation failures.

### 21.1 Serialization Trap — RESOLVED

Python/NumPy/Pandas non-finite values cannot cross the domain boundary as native JSON numbers. FinancialNumber uses tagged finite/non-finite semantics. Calculation failure is structurally represented and cannot degrade into `null` or a plausible value.

### 21.2 Large Payload Paradox — RESOLVED

Control-plane contracts carry metadata and PayloadReference. Heavy Monte Carlo paths, large table slices, extracted datasets, and similar artifacts are stored separately. Object-storage references are not themselves authorization credentials.

### 21.3 Temporal String Fallacy — RESOLVED

FinancialPeriod requires explicit temporal boundaries and fiscal-calendar semantics. Labels such as `FY2023` remain descriptive metadata only. Half-open interval semantics are preferred to invented end-of-day timestamps.

### 21.4 Orphaned Provenance Deletion Trap — RESOLVED

Referenced resources have explicit lifecycle/tombstone semantics. Tombstones preserve only the minimum policy-permitted referential metadata and do not imply recoverability of erased content.

### 21.5 Tenant Identity Bleed — RESOLVED WITH CORRECTION

The proposed composite URN approach is **not** adopted as the security boundary. Tenant-bearing identifiers can leak tenant context and do not prove authorization. ASTER instead mandates trusted ExecutionContext, scoped resource references, service authorization, PostgreSQL RLS, and storage policy. IDs remain opaque and non-authorizing.

## 22. Contract Compatibility Policy

Contract evolution follows explicit compatibility rules:

- **Additive optional field:** normally backward compatible.
- **Additive required field:** breaking unless a versioned migration/default contract exists.
- **Enum addition:** potentially breaking for closed-set consumers; consumers must use explicit unknown-value handling or coordinated versioning.
- **Field type/semantic change:** breaking.
- **Unit/currency meaning change:** always breaking.
- **Temporal semantic change:** always breaking.
- **Epistemic/verification meaning change:** always breaking.
- **Lifecycle-state meaning change:** always breaking.
- **Removal/renaming:** breaking.
- **Security/authorization semantic change:** breaking and requires architectural review.

Historical immutable artifacts remain interpretable through the schema/model versions under which they were created. Compatibility layers may translate old contracts into newer runtime representations, but may not rewrite historical truth.

## 23. Cross-Contract Dependency Rule

Canonical contracts must not form unbounded recursive object graphs.

Use stable references for cross-boundary relationships. Embedded objects are reserved for bounded value objects whose lifecycle is owned by the containing contract.

Examples of bounded value objects include:
- FinancialPeriod
- NumericPolicy
- DataClassification
- scoped policy descriptors

Examples of stable references include:
- Entity
- Security
- FinancialConcept
- FinancialFact
- Evidence
- CalculationArtifact
- Model
- Workspace
- Execution

This prevents payload explosions, circular serialization, and accidental ownership coupling.

## 24. Deterministic Idempotency Contract

Material asynchronous operations require an idempotency key derived from immutable request semantics, including as applicable:

- tenant/workspace scope
- operation type
- contract version
- model/formula version
- input snapshot identity
- assumption snapshot identity
- scenario/effective-state identity
- numeric policy
- relevant execution configuration

The idempotency key must not depend on mutable display labels, current time, or non-semantic ordering.

For stochastic execution, the random seed and sampling configuration are part of reproducibility semantics where deterministic replay is required.

## 25. Freeze Gate

**STATUS: PASSED — ASTER-CON-001 v1.1 FROZEN**

The five critical red-team failures have been incorporated, and the 15-point gate is resolved sufficiently to serve as the implementation contract foundation.

The following are now architectural requirements:

1. Tagged numerical unions for non-finite values.
2. Explicit control-plane versus payload-plane boundary.
3. Absolute temporal boundaries plus fiscal-calendar semantics.
4. Tombstone lifecycle semantics for referential continuity.
5. Trusted execution context and scoped authorization instead of tenant-bearing IDs as security proof.
6. Explicit contract compatibility rules.
7. Stable references to prevent recursive contract graphs.
8. Deterministic idempotency semantics for material asynchronous work.

**Implementation may now proceed to the Repository Architecture stage.**

Architecture changes after this point require explicit architectural review, a new contract version where applicable, red-team validation, documentation, and repository verification before implementation semantics are changed.
