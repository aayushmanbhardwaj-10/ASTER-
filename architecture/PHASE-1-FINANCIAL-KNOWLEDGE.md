# ASTER AI — Phase 1 Financial Knowledge Architecture

**Document ID:** ASTER-P1-FK-001  
**Version:** 1.0  
**Status:** PHASE 1 ARCHITECTURE FROZEN  
**Depends On:** ASTER-MAS-001 v1.0; ASTER-CON-001 v1.1; ASTER-RA-001 v1.0; ASTER-RF-001 v1.1  

## 1. Purpose

Phase 1 establishes the authoritative financial knowledge layer that gives ASTER a stable semantic understanding of finance before financial facts, retrieval, calculations, reasoning, and user-facing intelligence are implemented.

The objective is not to build a generic knowledge graph. The objective is to establish a versioned financial ontology that can answer:

- What does a financial concept mean?
- In what context does that meaning apply?
- How is it related to other concepts?
- What units, dimensions, constraints, and variants govern it?
- What semantic formula or dependency does it represent, if any?
- What evidence and historical ontology version support the definition?

## 2. Phase 1 Scope

Phase 1 includes:

1. Financial concept identity and definitions.
2. Concept taxonomy and semantic categories.
3. Typed financial relationships.
4. Context applicability.
5. Units and dimensional semantics.
6. Semantic formula specifications without executable formula code.
7. Concept constraints and applicability rules.
8. Concept variants by accounting framework, jurisdiction, industry, entity type, and other context.
9. Ontology versioning and historical knowledge states.
10. Ontology provenance and source references.
11. Controlled aliases, synonyms, acronyms, and labels.
12. Validation rules for ontology integrity.
13. Initial implementation contracts and tests.

Phase 1 does **not** implement:

- canonical financial fact persistence;
- market or macro observations;
- entity resolution/GEM;
- document ingestion;
- retrieval ranking or embeddings;
- executable financial calculations;
- LLM orchestration;
- claim verification;
- autonomous reasoning;
- workspace persistence.

Those belong to later phases and consume this knowledge layer through explicit contracts.

## 3. Authoritative Boundary

The Knowledge Plane is authoritative for **financial meaning**, not financial observations.

```text
Knowledge Plane
├── Concept meaning
├── Definitions
├── Relationships
├── Taxonomies
├── Semantic formulas
├── Constraints
├── Context applicability
└── Ontology versions

Data Plane
├── Reported facts
├── Observations
├── Filings
├── Market data
└── Provenance of observations

Instance / Workspace Graph
├── Company-specific models
├── User assumptions
├── Adjustments
└── Scenarios
```

The ontology must never become a hidden store for company-specific facts or user assumptions.

## 4. Canonical Knowledge Object

The primary knowledge object is `FinancialConcept`.

A concept has stable identity across ontology versions. A versioned concept definition describes its meaning at a particular ontology version and applicable context.

Required semantic components:

- `concept_id` — opaque, globally unique identifier.
- `concept_version` — immutable semantic version/state identifier.
- `canonical_name` — stable canonical label.
- `definition` — authoritative semantic definition.
- `category` — controlled ontology category.
- `status` — active, deprecated, superseded, or experimental.
- `context` — applicability constraints.
- `aliases` — controlled alternative labels/acronyms.
- `relationships` — typed links to other concepts.
- `unit_semantics` — expected dimensional meaning where applicable.
- `constraints` — semantic applicability and validity rules.
- `formula_specification` — semantic mathematical meaning where applicable.
- `source_references` — provenance for the knowledge definition.
- `effective_from` / `effective_to` — ontology validity interval.

The identity of a concept is distinct from any particular definition version.

## 5. Context Model

Financial meaning is contextual. A concept must not be treated as universally applicable merely because its name matches.

Context dimensions supported by Phase 1:

- accounting framework;
- jurisdiction;
- industry/sector;
- entity type;
- reporting basis;
- security/instrument class where relevant;
- currency/dimensional requirements where relevant;
- economic-time applicability where relevant;
- ontology knowledge-time/version.

Context matching is explicit. Missing context must not silently become universal applicability.

A concept may have multiple valid context-specific definitions or variants. Context specificity must be preserved rather than flattened into one definition.

## 6. Concept Identity vs Alias

Aliases are not identities.

Examples of aliases that may map to a concept candidate:

- acronym;
- common finance term;
- regional terminology;
- historical label;
- issuer-specific terminology;
- spelling or formatting variant.

An alias may be ambiguous and may map to multiple concepts depending on context.

Therefore:

```text
user term
  → alias candidates
  → contextual resolution
  → selected concept
```

The ontology does not declare an ambiguous alias to have one globally correct meaning.

## 7. Relationship Model

Relationships are typed and directed.

Initial supported relationship vocabulary:

- `IS_A`
- `PART_OF`
- `DERIVED_FROM`
- `CALCULATED_FROM`
- `DEPENDS_ON`
- `AFFECTS`
- `CONSTRAINS`
- `CONTRADICTS`
- `PRECEDES`
- `SUBSTITUTE_FOR`
- `RELATED_TO`
- `MEASURED_BY`
- `APPLIES_TO`
- `DEFINED_BY`

Every relationship records:

- source concept;
- target concept;
- relationship type;
- applicability context;
- effective interval;
- ontology version;
- provenance;
- status.

Relationships must not be interpreted as executable behavior merely because they are machine-readable.

## 8. Semantic Formula Boundary

The ontology stores **semantic mathematical meaning**, not executable implementation.

A formula specification may describe:

- formula identity;
- semantic definition;
- input concepts;
- output concept;
- units/dimensions;
- constraints;
- assumptions;
- applicable contexts;
- implementation reference.

The calculation plane later transforms a validated formula specification into an executable calculation plan.

```text
FinancialConcept
      ↓
FormulaSpecification
      ↓
Calculation Plane
      ↓
Validated Calculation Plan
      ↓
Execution DAG
      ↓
Result
```

Phase 1 must not introduce a custom financial formula DSL or executable code into ontology records.

## 9. Units and Dimensions

Concepts may declare dimensional semantics such as:

- currency amount;
- percentage/rate;
- ratio;
- count;
- duration;
- price;
- yield;
- probability;
- share quantity;
- index level.

Unit semantics constrain interpretation but do not perform arithmetic or currency conversion.

Currency conversion remains an explicit calculation/data transformation governed by later phases.

## 10. Constraints

Constraints describe when a concept is valid or applicable.

Examples:

- terminal growth rate must be below discount rate for a specific perpetuity formula;
- a banking concept may require financial-institution context;
- an accounting definition may require a particular reporting framework;
- a regulatory concept may require jurisdiction and effective date.

Constraints are semantic declarations in Phase 1. They do not execute financial calculations and do not replace calculation-plane validation.

## 11. Ontology Versioning

Ontology history is immutable.

A semantic change creates a new ontology version/state rather than mutating historical meaning.

Changes include:

- definition changes;
- relationship changes;
- taxonomy changes;
- formula-semantic changes;
- applicability changes;
- constraint changes;
- alias changes when they affect semantic resolution.

Concepts may be deprecated or superseded, but historical versions remain addressable.

Historical financial calculations and evidence must be able to identify the ontology version used for semantic interpretation.

## 12. No Silent Semantic Rewriting

ASTER must distinguish:

- presentation aliasing;
- semantic normalization;
- context-specific interpretation;
- true ontology change.

A new interpretation of an existing term must not silently rewrite prior analytical artifacts.

When a concept is superseded, the relationship between old and new concepts must be explicit and versioned.

## 13. Provenance

Knowledge definitions require provenance.

A source reference may identify:

- standard-setting body;
- regulatory authority;
- accounting framework;
- authoritative textbook/reference;
- ASTER-curated internal definition;
- other approved knowledge source.

Source authority determines evidentiary weight but does not automatically establish correctness. Conflicting knowledge definitions must remain observable and require explicit reconciliation.

Knowledge provenance is distinct from provenance of financial observations.

## 14. Ontology Integrity Rules

The Phase 1 validator must detect at minimum:

1. duplicate canonical identities;
2. dangling concept references;
3. invalid relationship types;
4. impossible relationship endpoints;
5. taxonomy cycles where cycles are forbidden;
6. invalid effective intervals;
7. overlapping mutually-exclusive definitions;
8. aliases that create unresolved ambiguity without declared alternatives;
9. formula specifications referencing unknown concepts;
10. dimensional inconsistencies in declared formula inputs/outputs;
11. deprecated concepts presented as current without explicit compatibility handling;
12. missing provenance for authoritative definitions;
13. uncontrolled executable content in ontology records;
14. context rules that cannot be evaluated because required dimensions are absent.

The validator must fail closed for structurally invalid ontology releases.

## 15. Red-Team Resolutions

### Ambiguous finance terminology
Resolved by contextual candidate resolution rather than global synonym equivalence.

### Definition changes over time
Resolved through immutable ontology versions and effective intervals.

### Jurisdiction/accounting differences
Resolved through explicit applicability context and versioned variants.

### Ontology becoming a fact database
Prevented by a hard boundary between semantic knowledge and observed data.

### Formula execution leaking into ontology
Prevented by semantic formula specifications with no executable DSL/code.

### Graph becoming an unbounded dependency structure
Prevented by typed relationships, bounded references, cycle validation, and explicit ownership.

### Authority being mistaken for correctness
Prevented by provenance plus conflict visibility, consistent with the ASTER trust model.

### Historical artifacts breaking after ontology updates
Prevented by immutable ontology versions referenced by analytical artifacts.

### Over-normalization of issuer terminology
Prevented by preserving aliases and issuer-specific terms as contextual candidates rather than forcing a universal concept mapping.

### Regulatory meaning without temporal context
Prevented by required jurisdiction/effective applicability where relevant.

## 16. Initial Financial Knowledge Domains

Phase 1 establishes the root taxonomy for the twelve frozen financial knowledge domains:

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

Industry/Sector remains first-class context rather than a simple knowledge-domain child.

## 17. Initial Implementation Order

Implementation proceeds in this order:

### P1.1 — Ontology Core Contracts
- concept identity;
- concept version;
- context;
- status;
- aliases;
- typed relationships;
- provenance references.

### P1.2 — Semantic Formula Contracts
- formula specification;
- input/output concepts;
- dimensions;
- constraints;
- implementation references.

### P1.3 — Ontology Validation
- graph integrity;
- context integrity;
- version integrity;
- provenance integrity;
- formula-reference integrity.

### P1.4 — Initial Domain Taxonomy
Build a deliberately small, high-quality seed ontology across the twelve domains rather than attempting to encode all of finance.

### P1.5 — Semantic Resolution Fixtures
Create adversarial fixtures for ambiguous terminology, aliases, context, historical definitions, and issuer-specific terminology.

### P1.6 — Knowledge Retrieval Interface Contract
Expose read-only knowledge access to later retrieval/intelligence components without granting them authority to mutate ontology truth.

## 18. Phase 1 Completion Gate

Phase 1 is not complete when many concepts exist. It is complete when the knowledge layer can demonstrate:

- deterministic identity;
- contextual semantic resolution;
- immutable version history;
- typed relationship integrity;
- formula semantic integrity;
- provenance;
- controlled ambiguity;
- historical interpretability;
- validation failure on malformed releases;
- read-only consumption by downstream systems.

## 19. Architectural Invariants Added by Phase 1

**FK-1 — Meaning Before Fact:** financial concepts are defined independently of individual observations.

**FK-2 — Contextual Meaning:** concept resolution must account for applicable financial context.

**FK-3 — Versioned Semantics:** financial meaning is historically versioned and never silently rewritten.

**FK-4 — Typed Relationships:** machine-readable relationships do not imply executable behavior.

**FK-5 — Semantic Formula Boundary:** ontology describes mathematical meaning; calculation infrastructure executes it.

**FK-6 — Provenance of Meaning:** authoritative definitions retain their knowledge provenance.

**FK-7 — Controlled Ambiguity:** ambiguous terminology remains ambiguous until sufficient context resolves it.

**FK-8 — Knowledge/Data Separation:** ontology is not a substitute for canonical financial facts.

**FK-9 — Read-Only Downstream Consumption:** downstream intelligence may consume knowledge but cannot mutate authoritative ontology state.

**FK-10 — Historical Interpretability:** prior analytical artifacts remain interpretable against the ontology version under which they were created.

## 20. Implementation Gate

No Phase 1 implementation may:

- introduce financial fact records into the ontology package;
- execute financial formulas from ontology data directly;
- allow an LLM to mutate authoritative ontology state;
- discard historical semantic versions;
- treat aliases as identities;
- make source authority equivalent to correctness;
- make industry-specific meaning globally universal;
- bypass ontology validation before publishing a knowledge release.

The next implementation task is **P1.1 — Ontology Core Contracts**.
