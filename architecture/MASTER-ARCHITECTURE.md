# ASTER AI — Master Architecture Specification

**Document ID:** ASTER-MAS-001  
**Version:** 1.0  
**Status:** ARCHITECTURE FROZEN  
**Constitution:** Laws 1–164  
**Implementation Status:** Not yet begun

## 1. Executive Definition

> ASTER is a domain-specific financial artificial intelligence designed to understand financial knowledge and data, perform accurate deterministic financial calculations, analyze financial information, reason across interconnected financial concepts, and provide transparent, contextual, and verifiable financial intelligence to support human decision-making.

ASTER is a financial intelligence system, not a language model wrapped in a financial UI. It combines financial knowledge, financial data, deterministic computation, probabilistic reasoning, evidence retrieval, verification, output governance, persistent analytical workspaces, and secure infrastructure.

## 2. Core Architectural Philosophy

ASTER must never confuse:

- Fluent language with correctness.
- Model confidence with financial truth.
- Retrieval with authority.
- Calculation with verification.
- Assumptions with observed facts.
- Inference with established fact.
- Caches or indexes with canonical truth.
- Production output with ground truth.
- The LLM with financial authority.
- Conversation with authoritative application state.

## 3. Master Invariants

1. **Financial Intelligence** — ASTER transforms financial information into trustworthy financial understanding.
2. **Context Before Interpretation** — financial information requires relevant entity, temporal, accounting, jurisdictional, dimensional, and reporting context.
3. **Canonical Financial Truth** — one authoritative financial fact layer exists; projections and indexes are subordinate.
4. **Historical & Point-in-Time Preservation** — historical states remain reconstructable.
5. **Evidence-to-Output Traceability** — material intelligence is traceable to evidence, transformations, and calculations.
6. **Epistemic Separation** — observed, derived, assumed, estimated, inferred, and hypothetical knowledge remain distinguishable.
7. **Explicit Authority** — every important operation has an explicit authoritative owner.
8. **Deterministic Financial Computation** — financial mathematics executes through controlled computational infrastructure.
9. **Evidence Retrieval** — retrieval acquires relevant evidence; it does not establish financial truth.
10. **Bounded Probabilistic Reasoning** — probabilistic reasoning operates within evidence, tool, data, and policy boundaries.
11. **Claim/Result Verification** — verification is claim/result-specific, reproducible, and evidence-based.
12. **Immutable Analytical State** — canonical and completed analytical states are preserved; changes create branches, versions, or deltas.
13. **Data Sovereignty** — classification, provenance, and policy govern data movement.
14. **Zero-Trust Security** — no single component, credential, or policy check is the sole security boundary.
15. **Operational Integrity** — infrastructure preserves application, intelligence, data, and authority boundaries.
16. **Controlled Evolution** — material changes require versioning, testing, and evaluation.

## 4. Logical Architectural Planes

ASTER consists of eight logical planes:

1. **System Plane** — TypeScript/Fastify; authentication, authorization, tenancy, workspace state, public API, realtime, request governance, and authoritative application state.
2. **Intelligence Plane** — Python/FastAPI; cognitive orchestration, semantic interpretation, retrieval orchestration, reasoning, model selection, calculation invocation, verification orchestration, and output governance.
3. **Knowledge Plane** — financial ontology, definitions, relationships, semantic formulas, taxonomies, and contextual constraints.
4. **Data Plane** — acquisition, raw preservation, canonicalization, provenance, source registry, facts, observations, entity resolution, temporal integrity, and data quality.
5. **Retrieval Plane** — structured retrieval, BM25, embeddings, reranking, ontology constraints, Evidence Registry, and evidence-pack construction.
6. **Calculation Plane** — authoritative financial mathematics, numerical policy, model execution, calculation artifacts, and reproducibility.
7. **Verification Plane** — structural, data, semantic, computational, reasoning, claim, contradiction, and output verification.
8. **Infrastructure Plane** — runtime isolation, networking, storage, jobs, secrets, observability, recovery, deployment, tenancy enforcement, egress control, and audit.

These are logical authority boundaries; they do not imply one process or deployment per plane.

## 5. Authority Model

| Concern | Authoritative owner |
|---|---|
| Financial meaning | Knowledge Plane / Ontology |
| Canonical financial facts | Data Plane / PostgreSQL |
| Entity identity | Global Entity Master (GEM) |
| Source provenance | Data Plane |
| Retrieval candidates | Retrieval Plane |
| Runtime evidence state | Evidence Registry |
| Financial arithmetic | Calculation Plane |
| Model execution | Calculation Plane |
| User/workspace state | System Plane |
| LLM language and probabilistic reasoning | Intelligence Plane |
| Model metadata | Model Registry |
| Claim verification | Verification Plane |
| Output policy | Output Governance |
| Binary artifacts | Object Storage |
| Realtime transport | Event Gateway / Redis |
| Security audit history | Immutable audit infrastructure |

## 6. System Runtime Topology

```text
CLIENT
  ↓
EDGE / GATEWAY
  ↓
TypeScript System Plane / Fastify
  ↓ authenticated, authorized internal contract
Python Intelligence Plane / FastAPI
  ├── Cognitive Workers
  ├── Calculation Workers
  └── Document / ML Workers
  ↓
PostgreSQL / Object Storage / Redis
```

The System Plane owns authoritative application-state transitions. Intelligence workers produce analytical results and must return through the authoritative state path rather than silently mutating workspace truth.

## 7. Canonical Data Flow

```text
SOURCE
 ↓
ACQUISITION
 ↓
RAW PRESERVATION
 ↓
PARSING / EXTRACTION
 ↓
IDENTITY RESOLUTION
 ↓
SEMANTIC MAPPING
 ↓
CONTEXT RESOLUTION
 ↓
VALIDATION
 ↓
RECONCILIATION
 ↓
CANONICAL FACT
 ↓
PROJECTION / INDEX
 ↓
RETRIEVAL
 ↓
EVIDENCE
 ↓
ANALYSIS / CALCULATION
 ↓
DERIVED RESULT
 ↓
VERIFICATION
 ↓
OUTPUT GOVERNANCE
 ↓
WORKSPACE / COPILOT
```

## 8. Canonical Financial Fact

A material financial fact is contextual and provenance-aware. It includes, as applicable:

- entity
- concept
- value
- unit
- currency
- period
- reporting basis
- dimensions
- source
- provenance
- economic time
- publication time
- vendor knowledge time
- ASTER knowledge time
- epistemic state

ASTER distinguishes Entity, Security, and Identifier. Tickers are never identity by themselves.

## 9. Temporal Model

ASTER preserves:

- Economic Time
- Publication Time
- Vendor Knowledge Time
- ASTER Knowledge Time

Restatements and revisions are new states/events, not mutations of history. Historical retrieval must preserve point-in-time applicability where available.

## 10. Ontology

The ASTER Financial Ontology is a structured, contextual, and versioned representation of financial entities, concepts, relationships, formulas, constraints, and evidence. It defines semantic meaning rather than serving as the executable calculation engine.

Primary domains:

1. Accounting & Financial Reporting
2. Corporate Finance
3. Valuation
4. Investments & Capital Markets
5. Fixed Income
6. Derivatives
7. Banking & Credit
8. Private Capital
9. Quantitative Finance, Risk & Market Microstructure
10. Regulatory & Financial Constraints
11. Macroeconomics & Economic Context
12. Entity & Corporate Structure

Industry/Sector is first-class analytical context.

## 11. Epistemic Model

### Data epistemics

`REPORTED`, `RESTATED`, `DERIVED`, `ASSUMED`, `ESTIMATED`, `UNVERIFIED`, `CONFLICTED`, `UNKNOWN`

### Reasoning epistemics

`SUPPORTED`, `INFERRED`, `HYPOTHESIZED`, `UNSUPPORTED`, `UNVERIFIABLE`, `CONTRADICTORY`

Epistemic state, verification state, and trust dimensions are separate concepts.

## 12. Evidence Architecture

Canonical evidence types:

- FactEvidence
- DocumentEvidence
- TableSliceEvidence
- DerivedEvidence
- ConflictEvidence

The Evidence Registry provides runtime continuity but is not a competing source of truth. Evidence identity, canonical fact identity, and provenance identity are distinct and linked.

## 13. Retrieval Architecture

```text
Question
 ↓
Task Understanding
 ↓
Required Evidence Specification
 ↓
Candidate Retrieval
 ↓
Financial / Tenant / Temporal Constraints
 ↓
Ranking
 ↓
Context Validation
 ↓
Evidence Pack
 ↓
Evidence Registry
```

Retrieval uses structured SQL plus hybrid lexical/semantic retrieval. The initial vector architecture is PostgreSQL + pgvector. Vector search is candidate generation, not semantic authority.

## 14. Calculation Architecture

```text
Calculation Specification
 ↓
Validation
 ↓
Validated Calculation Plan
 ↓
Execution DAG
 ↓
Deterministic Numerical Engine
 ↓
Result
 ↓
Verification
 ↓
Calculation Artifact
```

Python is the calculation execution language. Model metadata/formula specifications are versioned separately from implementations. SQL handles set-based computation; Python handles financial model/node-graph computation.

Every material calculation preserves an input snapshot, assumption snapshot, model/formula version, execution graph, numeric policy, result, provenance, verification state, and execution environment.

## 15. Scenario Architecture

Scenarios are explicit deltas over immutable analytical states:

```text
BASE MODEL + SCENARIO DELTA → EFFECTIVE STATE → CALCULATION
```

A scenario never silently mutates its parent.

## 16. Cognitive Runtime

ASTER uses progressive cognitive escalation:

```text
Question
 ↓
Deterministic Fast Gate
 ↓
Fast Model
 ↓
Tool / Complexity Signals
 ↓
Deep Model if required
```

Escalation transfers explicit execution state through an event log and context compiler. Hidden-state or provider KV-cache continuity is not an architectural guarantee.

The LLM may understand language, propose semantics, generate hypotheses, select tools, summarize, and explain. It is not authoritative for financial facts, calculation, permissions, workspace state, or final verification.

## 17. Data Classification and Egress

Canonical classifications:

- PUBLIC
- CONFIDENTIAL
- RESTRICTED
- HIGHLY_RESTRICTED

External inference requests pass through:

```text
Evidence
 ↓
Classification + Provenance
 ↓
Workspace Policy
 ↓
Endpoint Policy
 ↓
Egress Firewall
 ↓
ALLOW / REDACT / BLOCK
```

Private data does not automatically require a local model, but unauthorized external egress is prohibited.

## 18. Tenant Isolation

Tenant identity is established by authorized execution context, not trusted from an arbitrary worker parameter.

```text
Authenticated User
 ↓
System Authorization
 ↓
Scoped Execution Context
 ↓
Worker
 ↓
Database Access Context
 ↓
PostgreSQL RLS
```

RLS is a final database enforcement boundary. Worker roles must not bypass RLS or possess unrestricted superuser-equivalent access.

Object-storage access is capability-scoped to tenant/workspace/object or prefix and is short-lived where supported.

## 19. Security and Deletion

Highly restricted data may use application-level encryption with tenant-scoped key management. Deletion combines logical deletion, access revocation, primary-data destruction, applicable key destruction, backup lifecycle controls, and verification. Crypto-shredding is not a substitute for legal retention or deletion policy.

Security and privileged-access events are written through an append-only, tamper-resistant audit boundary outside the primary application-state database. Audit records are themselves access-controlled and minimized.

## 20. Event and Job Architecture

State-changing flow:

```text
Command → Authorization → Validation → SQL Transaction → COMMIT → Durable Event → Broadcast
```

Job states:

`CREATED`, `QUEUED`, `RUNNING`, `SUCCEEDED`, `FAILED`, `CANCELLED`, `TIMED_OUT`, `RETRYING`

ASTER assumes at-least-once delivery with idempotent execution rather than relying on exactly-once distributed execution.

## 21. Infrastructure and Deployment

Workloads are isolated by function:

- Cognitive Workers — AI/orchestration
- Calculation Workers — CPU-oriented deterministic math
- Document/ML Workers — extraction/embedding/optional GPU

PostgreSQL, object storage, and durable state have independent operational lifecycles. Redis is transport/acceleration, never financial truth.

Infrastructure must be versioned and evaluation-gated. Critical execution records retain source revision, dependency lock, container/image identity, model versions, and execution configuration.

## 22. Failure and Degradation

ASTER must never replace failure with a plausible number or unsupported narrative.

Relevant failure states include:

- EVIDENCE_NOT_FOUND
- INSUFFICIENT_EVIDENCE
- ENTITY_AMBIGUOUS
- CONTEXT_AMBIGUOUS
- TEMPORAL_CONTEXT_MISSING
- PIT_UNAVAILABLE
- CONFLICTING_EVIDENCE
- SOURCE_RESTRICTED
- RIGHTS_RESTRICTED
- NUMERICAL_FAILURE
- CONSTRAINT_FAILED
- EXECUTION_FAILED
- UNSUPPORTED
- UNVERIFIABLE
- ASSUMPTION_DEPENDENT

Graceful degradation is allowed only when trustworthiness is not silently reduced.

## 23. Claim and Verification Model

Claims are relational:

```text
Claim
 ├── supported_by → Evidence
 ├── derived_from → Calculation
 ├── inferred_from → Evidence / Claims
 ├── qualified_by → Assumption / Conflict
 └── conflicted_by → Evidence / Claims
```

Verification states include:

`NOT_CHECKED`, `CHECKING`, `VERIFIED`, `PARTIALLY_VERIFIED`, `ASSUMPTION_DEPENDENT`, `CONFLICTED`, `UNSUPPORTED`, `UNVERIFIABLE`, `FAILED`

Verification is claim/result-specific and deterministic verification is preferred where possible. LLM critics are supplementary, never sole authority.

## 24. Workspace Model

The workspace is the persistent analytical interface. Conversation is the command/reasoning interface.

Workspace state can contain companies, statements, sources, facts, assumptions, adjustments, models, DCF/WACC artifacts, scenarios, sensitivities, evidence, calculations, and analysis.

Canonical analytical states are immutable. Branching is explicit.

## 25. Phase Dependency Graph

```text
0.1 Definition
  ↓
0.2 Financial Intelligence
  ↓
0.3 Product / Users
  ↓
0.4 Ontology
  ↓
0.5 Trust
  ├──────────────┐
  ↓              ↓
0.6 Languages   0.10 Data
  ↓              ↓
0.7 Runtime      ├────────────┐
  ↓              ↓            ↓
0.14 Infra     0.11 Calc   0.12 Retrieval
                 │            │
                 └──────┬─────┘
                        ↓
                     0.13
                  Verification
                        ↓
                  Implementation
```

Phase 0 is a prerequisite for implementation. The implementation path then proceeds through contracts, repository foundation, and the product phases.

## 26. Frozen Decisions

The following are architectural commitments:

- System/Intelligence plane separation.
- TypeScript/Python/SQL responsibility split.
- Fastify/FastAPI service boundaries.
- PostgreSQL as authoritative structured system of record.
- S3-compatible object storage for binary artifacts.
- Redis as transport/acceleration, not truth.
- pgvector as initial vector architecture.
- Canonical fact and provenance model.
- Financial ontology model.
- Evidence Registry architecture.
- Deterministic calculation authority.
- Calculation artifact architecture.
- Claim-centric verification.
- Immutable workspace and branching model.
- Tenant isolation and RLS enforcement boundary.
- Classification-bound external egress.
- Immutable audit boundary.
- Laws 1–164 and the 16 master invariants.

## 27. Evaluation-Dependent Decisions

The following remain deliberately unfrozen:

- Cloud provider.
- Container orchestrator.
- IaC technology.
- KMS implementation.
- WORM/audit provider.
- LLM providers and versions.
- Embedding and reranking models.
- Inference framework.
- GPU type.
- Market-data and filing vendors.
- Dedicated graph database.
- Dedicated vector database.
- Warehouse/time-series database.
- Exact numerical libraries.
- Exact DLP implementation.

These are engineering/evaluation decisions and must not silently redefine the architecture.

## 28. Implementation Gate

Implementation begins only after:

1. Architecture is frozen.
2. Constitutional laws are complete.
3. Authority boundaries are documented.
4. Domain contracts are defined and frozen.
5. Event contracts are defined and frozen.
6. API/service boundaries are defined.
7. Persistence schemas are derived from contracts.
8. Repository boundaries are established.
9. Initial test/evaluation strategy is established.

## 29. Architectural Change Rule

> **If implementation conflicts with this specification, implementation is considered incorrect until the architecture is deliberately reviewed, changed, versioned, and re-frozen.**

## 30. Final Architectural Statement

> ASTER is a domain-specific financial intelligence system composed of authoritative financial knowledge and data systems, deterministic financial computation, evidence retrieval, probabilistic cognitive reasoning, verification, output governance, persistent analytical workspaces, and secure operational infrastructure. The system explicitly separates what is known from what is inferred, what is calculated from what is assumed, what is retrieved from what is authoritative, and what is generated from what is verified.
