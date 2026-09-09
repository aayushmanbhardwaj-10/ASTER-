# ASTER AI — Contract Architecture

**Document ID:** ASTER-CON-001  
**Version:** 1.0  
**Status:** CONTRACT DESIGN / RED-TEAM PENDING  
**Depends on:** ASTER-MAS-001 v1.0

## 1. Purpose

This specification defines the canonical cross-plane contracts that connect ASTER's frozen architecture to implementation. Contracts define identity, ownership, lifecycle, immutability, versioning, provenance, authorization scope, validation responsibility, and producer/consumer boundaries.

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

## 3. Contract Envelope

Where applicable, persisted or cross-service domain objects use a common conceptual envelope:

```text
contract_type
contract_version
object_id
tenant_scope
workspace_scope
created_at
updated_at
status
provenance_ref
schema_version
```

Not every object requires every field. The envelope is a design pattern, not a mandatory database row shape.

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
Immutable identity; attributes may have versioned temporal states.

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
- period
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

### 6.4 DataClassification

Controlled classification:

`PUBLIC | CONFIDENTIAL | RESTRICTED | HIGHLY_RESTRICTED`

Classification is policy metadata and must not be treated as epistemic truth.

## 7. Evidence Contracts

### 7.1 Evidence

Polymorphic evidence base with:
- evidence_id
- evidence_type
- canonical_reference
- tenant/workspace scope
- source/provenance
- context
- epistemic state
- rights/access state
- snapshot identity
- creation metadata

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

## 8. Calculation Contracts

### 8.1 CalculationSpecification

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
- authorization context reference

The specification is declarative. It does not contain arbitrary executable code.

### 8.2 CalculationArtifact

Durable record of a completed or failed calculation.

Includes:
- calculation_id
- model/formula version
- immutable input snapshot
- assumption snapshot
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

It is immutable after completion except for separately versioned verification metadata where policy permits.

### 8.3 NumericPolicy

Includes representation, precision, scale, rounding mode, intermediate precision, output precision, and tolerance. Display formatting is separate.

## 9. Analytical Contracts

### 9.1 Model

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

### 9.2 Scenario

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

## 10. Reasoning Contracts

### 10.1 Claim

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

### 10.2 VerificationResult

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

## 11. Workspace and Runtime Contracts

### 11.1 Workspace

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

### 11.2 Execution

Represents a cognitive/analytical runtime execution.

Includes:
- execution_id
- parent/request reference
- task type
- workspace/tenant scope
- execution status
- execution event references
- evidence snapshot reference
- model registry references
- policy context
- started/completed timestamps
- terminal outcome

Execution is a traceable runtime object, not canonical financial truth.

### 11.3 Job

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

### 11.4 Event

Represents a durable domain or operational event.

Includes:
- event_id
- event_type/version
- aggregate/entity reference
- tenant/workspace scope where applicable
- event timestamp
- causation/correlation references
- payload
- schema version

Events describe committed state transitions where authoritative state is involved.

## 12. ExecutionContext Contract

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

ExecutionContext is security-sensitive and must never be accepted wholesale from an untrusted LLM or client.

## 13. Relationship Rules

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

## 14. Immutability Matrix

| Contract | Default mutation policy |
|---|---|
| Entity identity | Immutable; temporal attributes versioned |
| Security identity | Immutable; lifecycle versioned |
| Identifier | Append/version with temporal validity |
| FinancialConcept | Versioned |
| Source | Versioned metadata |
| Provenance | Append-only lineage |
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

## 15. Validation Ownership

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

## 16. Cross-Service Contract Rules

System Plane ↔ Intelligence Plane communication must use explicit versioned contracts.

Python cannot directly mutate authoritative System Plane state. Analytical results return through an authoritative state transition path.

Streaming events must distinguish:
- informational execution events
- authoritative committed-state events

No event should imply committed state before commit.

## 17. Security Rules

- Tenant scope must be explicit for tenant-owned contracts.
- Worker identity is never derived solely from a job payload field.
- Database access must be constrained by authenticated/scoped execution context and PostgreSQL RLS.
- Object storage access must be short-lived and scope-limited where possible.
- Data classification and provenance travel with evidence sufficiently to enforce egress policy.
- Secrets are references to secret-management infrastructure, never plaintext contract fields.
- Audit events are separate from ordinary application state.

## 18. Contract Anti-Patterns

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

## 19. Red-Team Questions Before Freeze

The following must be resolved before this contract architecture becomes frozen:

1. Which identity fields are globally unique versus tenant-scoped?
2. Exactly which temporal dimensions are mandatory per contract type?
3. How are currency and unit dimensions represented across TypeScript, Python, and SQL without semantic loss?
4. What is the canonical serialization format for cross-plane contracts?
5. Which fields are required for deterministic idempotency keys?
6. How are schema migrations handled for immutable historical artifacts?
7. How are deleted/crypto-shredded objects represented without leaking sensitive metadata?
8. What is the exact distinction between workspace, tenant, organization, and user scopes?
9. How are authorization claims propagated without trusting worker-supplied scopes?
10. Which events are domain events versus integration/operational events?
11. How are large evidence/document payloads represented without embedding binaries in messages?
12. How are partial calculation failures represented while preserving reproducibility?
13. How are model/version references guaranteed to remain resolvable after deprecation?
14. How are cross-contract circular dependencies prevented?
15. What contract compatibility policy governs breaking versus additive changes?

## 20. Freeze Gate

This document is intentionally **not yet frozen**. The next architectural action is a contract red-team covering identity, temporal semantics, serialization, tenancy, lifecycle, version compatibility, failure semantics, and dependency cycles.

Only after those questions are resolved should ASTER-CON-001 v1.0 be marked FROZEN and used as the direct precursor to repository/domain implementation.
