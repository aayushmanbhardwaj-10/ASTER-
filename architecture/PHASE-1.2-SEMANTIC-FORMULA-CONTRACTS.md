# ASTER AI — Phase 1.2 Semantic Formula Contracts

**Document ID:** ASTER-P1.2-001  
**Version:** 1.0  
**Status:** FROZEN  
**Depends On:** ASTER-MAS-001 v1.0; ASTER-CON-001 v1.1; Phase 1.1 Ontology Core Contracts  
**Next Gate:** Phase 1.3 — Ontology Validation

## 1. Purpose

This document freezes the semantic contract between ASTER's Knowledge Plane and the future Calculation Plane.

A semantic formula describes what a financial relationship means, the context in which it applies, the semantic meaning of its inputs, valid derivations, and constraints. It does not execute arithmetic and does not contain the Calculation Plane's executable implementation.

The governing rule is:

> **The ontology defines what a financial relationship means, under which conditions it applies, what its inputs semantically represent, how those inputs relate across time and dimensions, and which valid derivations exist. It does not execute the relationship.**

## 2. Formula Family vs Formula Variant

A `FormulaFamily` represents the financial relationship for a target concept. A family may contain multiple `FormulaVariant` definitions because financial concepts frequently have multiple valid derivations.

Examples:

- EBITDA may have top-down and bottom-up derivations.
- Enterprise Value, Equity Value, and Net Debt may have multiple explicit solution variants of the same relationship.
- Accounting-framework or industry context may require different variants.

A `FormulaVariant` is independently identifiable and versioned.

The ontology must never assume one universal formula for a concept.

## 3. Variant Selection — Fidelity Ranking + Evidence Gating

Multiple variants may be applicable simultaneously. Variant selection therefore follows two distinct authorities:

1. **Ontology authority:** defines canonical fidelity/preference ordering.
2. **Evidence authority:** determines whether the required inputs currently exist and satisfy the variant's semantic requirements.

A variant with a better fidelity rank must not be selected if its required evidence is unavailable, invalid, contextually incompatible, or otherwise unusable.

Selection conceptually follows:

```text
Applicable variants
        ↓
Canonical fidelity ordering
        ↓
Evidence / semantic availability gate
        ↓
Highest-ranked executable candidate
```

`fidelity_rank` is ordinal and lower values represent higher canonical preference unless a future contract explicitly changes that rule.

Ties are not resolved by array order. If two variants have equal fidelity rank, the planner must apply deterministic secondary precedence rules defined by the ontology contract or report an ambiguity state. The LLM must never resolve such a tie by intuition.

The ontology defines preference; the Calculation Planner remains responsible for checking executable evidence availability.

## 4. Applicability Context

Applicability uses the existing structured `ApplicabilityContext` rather than a flat list of labels.

Relevant dimensions may include:

- accounting framework
- jurisdiction
- industry
- entity type
- reporting basis
- security class
- currency
- economic time
- ontology validity

A variant can be valid for a context without being preferred over another valid variant. Applicability and preference are separate semantics.

## 5. Input Binding Contract

Every formula input is an `InputBinding` with semantic metadata sufficient for a downstream planner to resolve the correct financial evidence.

Conceptually:

```text
InputBinding
├── concept
├── semantic_role
├── required / optional
├── temporal_binding
├── measure_type
├── aggregation_requirement
├── unit_semantics
├── sign_semantics
└── transformation_requirements
```

The ontology describes these semantics; it does not fetch evidence or execute transformations.

### 5.1 Semantic role

Input roles distinguish the financial purpose of an input, such as:

- numerator
- denominator
- capital component
- rate
- tax adjustment
- operating component
- valuation component
- control/threshold input

Roles are extensible and domain-defined rather than hard-coded to a single calculation engine.

## 6. Temporal Binding

Temporal semantics must not be represented only as strings such as `t_-1y`.

A temporal binding describes the relationship between the formula's anchor period and the required input period.

Conceptually:

```text
TemporalBinding
├── anchor
├── relation
├── offset
├── alignment
├── granularity
└── calendar
```

Examples of semantic relations include:

- SAME_PERIOD
- PRIOR_PERIOD
- PRIOR_COMPARABLE_PERIOD
- FOLLOWING_PERIOD
- PERIOD_START
- PERIOD_END
- TRAILING_PERIOD
- FORECAST_PERIOD

The calculation planner resolves these relationships against actual financial periods and calendars.

Fiscal labels such as `FY2024` are not sufficient temporal identity by themselves. Explicit period boundaries and calendar semantics remain authoritative.

## 7. Measure Type

Formula inputs explicitly identify their temporal measurement behavior where material:

- FLOW
- STOCK
- POINT_IN_TIME
- DURATION
- RATE
- OTHER_DEFINED_MEASURE

This prevents invalid mixing of period flows and point-in-time observations without an explicit temporal rule.

Examples:

- Revenue → FLOW
- Net Income → FLOW
- Total Assets → STOCK
- Share Price → POINT_IN_TIME
- WACC → RATE

## 8. Temporal Aggregation Requirements

Flow/stock compatibility may require aggregation before execution.

For example, Return on Assets may conceptually use:

```text
Net Income over period
----------------------
Average Assets over period
```

The ontology can therefore require a stock aggregation such as:

```text
PERIOD_AVERAGE_BEGIN_END
```

The aggregation requirement is a semantic precondition, not an instruction to the ontology to perform arithmetic.

The planner must retrieve the required beginning/end observations and construct the appropriate calculation input before execution.

A raw end-of-period stock must not be silently substituted when the contract requires an average.

## 9. Time-Series Rollup Semantics

Financial concepts may have lawful granularity transformations.

Concepts may define time-series behavior such as:

```text
FLOW  → SUM
STOCK → AS_OF_LATEST
```

However, these are **conditional semantic rules**, not unconditional database operations.

For a flow, quarterly observations can be summed into an annual period only when:

- the observations represent non-overlapping standalone sub-periods;
- they belong to the same applicable fiscal/calendar context;
- units/currency/reporting basis are compatible;
- no duplicate or overlapping YTD representation is being summed;
- the resulting period exactly matches the requested target period;
- the evidence supports the required temporal reconstruction.

For a stock, `AS_OF_LATEST` means the latest valid observation at or within the target boundary may represent the target point only when the concept's temporal semantics and source context permit that interpretation.

Rollup semantics must never be used to manufacture evidence across incompatible periods or reporting contexts.

## 10. Sign Semantics

Formula inputs explicitly describe the semantic representation of signs.

Sign semantics distinguish at minimum:

```text
representation
├── DIRECTIONAL
└── ABSOLUTE_MAGNITUDE

economic_polarity
├── INFLOW
├── OUTFLOW
├── EXPENSE
├── BENEFIT
└── NEUTRAL
```

A source-reported value remains unchanged in the canonical fact layer. Any normalization required to satisfy the formula's input semantics must be explicit, attributable, reversible, and provenance-preserving.

The ontology defines expected semantic representation; the Calculation Plane performs and records any required normalization.

## 11. Unit and Dimensional Semantics

Formula contracts specify dimensional expectations rather than merely display units.

Examples:

```text
Currency Amount / Share Quantity → Currency Per Share
Currency Amount / Currency Amount → Dimensionless Ratio
```

The ontology defines dimensional compatibility and output semantics. The Calculation Plane enforces those rules at execution boundaries.

Currency conversion remains an explicit transformation governed by the existing currency-transformation contract; unit normalization is not currency conversion.

## 12. Semantic Expression vs Structured Expression

A formula variant may provide a human/LLM-readable semantic expression, but that string is not executable authority.

Example:

```text
Net Income + Interest Expense + Income Tax Expense + D&A
```

The contract also carries a structured expression representation describing operations and operands semantically.

Conceptually:

```text
ADD
├── Net Income
├── Interest Expense
├── Income Tax Expense
└── D&A
```

This structure is ontology metadata, not executable code. The Calculation Plane later validates and compiles the semantic specification into its own calculation plan.

## 13. Explicit Solution Variants

Algebraic equivalence is represented through explicit solution variants rather than arbitrary runtime equation rearrangement.

Example relationship:

```text
Enterprise Value = Equity Value + Net Debt
```

may have explicitly validated variants:

```text
Enterprise Value ← Equity Value + Net Debt
Equity Value     ← Enterprise Value - Net Debt
Net Debt         ← Enterprise Value - Equity Value
```

This approach supports bidirectional financial reasoning while preventing unsafe free-form algebraic manipulation of nonlinear, conditional, or multi-solution relationships.

Each solution variant has its own identity, applicability, input requirements, constraints, and version.

## 14. Constraints

Formula constraints are referenced by stable identifiers rather than opaque rule strings.

A semantic constraint may describe:

- applicability
- dimensional requirements
- temporal requirements
- domain restrictions
- financial invariants
- prerequisite relationships

The ontology defines the constraint's meaning. Constraint execution belongs to the appropriate downstream validation/calculation component.

## 15. Assumptions

Formula assumptions are explicit semantic metadata.

They must not be silently introduced by a planner or model implementation.

Assumptions that materially alter analytical meaning must remain visible, versioned, and traceable in the eventual Calculation Artifact.

## 16. Versioning and Provenance

Formula identity must remain stable enough to reference a specific historical semantic definition while allowing controlled evolution.

Material formula changes require a new formula version and must not rewrite the meaning of historical calculation artifacts.

A material formula reference should therefore be resolvable through:

```text
formula_family_id
formula_variant_id
formula_version
ontology_version
source references
validity interval
```

Formula provenance identifies the basis for the semantic definition. Source authority remains evidentiary weight, not automatic correctness.

## 17. Required Selection Behavior

The future Calculation Planner must not:

- select a formula solely because it appears first in an array;
- select a formula solely because an LLM prefers its wording;
- execute a formula whose required evidence is missing or semantically incompatible;
- silently substitute a lower-fidelity variant without recording the selection;
- silently normalize signs, currencies, periods, or units;
- perform arbitrary algebraic rearrangement when no explicit solution variant exists;
- use rollup semantics across overlapping or incompatible evidence;
- substitute a point-in-time stock for a required period-average stock.

The planner must preserve the selected formula variant and the reasons for selection in the eventual calculation execution state/artifact.

## 18. Non-Goals

P1.2 does not implement:

- financial arithmetic;
- database retrieval;
- Evidence Registry access;
- period lookup;
- formula execution;
- executable Python models;
- model-specific numerical policy;
- calculation caching;
- calculation verification execution;
- LLM-based formula selection as an authority.

Those belong to later phases and must consume this semantic contract rather than redefine it.

## 19. Frozen P1.2 Contract Blueprint

```text
FormulaFamily
├── identity/version
├── target_concept
├── variants[]
│   └── FormulaVariant
│       ├── identity/version
│       ├── target_concept
│       ├── applicability_context
│       ├── fidelity_rank
│       ├── input_bindings[]
│       │   ├── concept
│       │   ├── semantic_role
│       │   ├── required / optional
│       │   ├── temporal_binding
│       │   ├── measure_type
│       │   ├── aggregation_requirement
│       │   ├── unit_semantics
│       │   └── sign_semantics
│       ├── semantic_expression
│       ├── structured_expression_tree
│       ├── output_semantics
│       ├── constraints[]
│       ├── explicit_assumptions[]
│       ├── source_references[]
│       └── validity/version metadata
└── solution_variants[]
    └── independently versioned explicit derivations
```

## 20. P1.2 Invariants

1. A financial concept may have multiple valid formula variants.
2. Applicability and preference are separate semantics.
3. Fidelity ranking is canonical ontology preference, not proof of executability.
4. Evidence availability gates variant selection.
5. Equal-preference variants require deterministic secondary precedence or explicit ambiguity.
6. Temporal bindings describe semantic period relationships, not database queries.
7. Fiscal labels alone are insufficient temporal identity.
8. Flow/stock compatibility must be explicit.
9. Required aggregation must be explicit and cannot be silently substituted.
10. Rollups are conditional semantic transformations, not unconditional arithmetic rules.
11. Canonical facts remain as-reported; sign normalization is explicit and reversible.
12. Unit and dimensional semantics are distinct from display formatting.
13. Semantic expressions are not executable formulas.
14. Structured expression trees remain non-executable ontology metadata.
15. Algebraic equivalence requires explicit solution variants.
16. Constraints have stable identities and semantic definitions.
17. Material formula changes are versioned.
18. Historical calculation artifacts must remain interpretable under their original ontology/formula versions.
19. The LLM has no authority to select, rewrite, or execute financial formulas.
20. The ontology never executes financial mathematics.

## 21. Freeze Decision

**P1.2 — SEMANTIC FORMULA CONTRACTS: FROZEN v1.0**

The Knowledge Plane now provides a sufficiently expressive semantic contract for the future Calculation Plane to resolve formula variants, temporal relationships, flow/stock behavior, aggregation, dimensional semantics, sign conventions, explicit derivations, constraints, assumptions, and provenance without embedding executable financial mathematics in the ontology.

The next gate is **P1.3 — Ontology Validation**.
