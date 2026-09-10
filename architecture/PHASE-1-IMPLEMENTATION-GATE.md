# Phase 1 Implementation Gate — Ontology Compiler

**Status:** Implementation foundation established; compiler seed verification is CI-gated.

## Canonical implementation boundary

`packages/ontology` owns semantic contracts. `packages/ontology-compiler` consumes machine-readable ontology manifests and produces an immutable `OntologyReleaseArtifact` only when fatal diagnostics are absent.

## P1.4 seed

`packages/ontology/seed/draft-001.json` contains exactly 35 canonical concepts spanning reporting inputs, operating analytics, market/capital inputs, discounting, terminal value, enterprise/equity value, and implied share price.

`draft-001.formulas.json` contains the 15 FormulaVariant families required to exercise flow, stock, rate, ratio, temporal, dimensional, and constraint semantics.

## Compiler stages

- lexical schema and ID validation
- context intersection and alias collision checks
- reference/source/constraint validation
- dependency graph and cycle detection
- recursive dimensional and temporal type checking
- formula precedence/tie detection
- reachability and primitive/derived role checks
- cross-object consistency checks
- canonical artifact hashing

## Artifact rule

The compiler hashes a canonical unsigned representation using SHA-256. The hash is excluded from its own input. The resulting artifact is immutable by identity and records compiler/version provenance.

## Gate requirements

The implementation gate is not complete until CI proves:

1. the compiler package type-checks;
2. the 35-concept seed compiles with zero fatal diagnostics;
3. the compiler rejects an unbound expression variable;
4. the compiler rejects overlapping alias collisions;
5. the compiler rejects missing formulas for analytical/intermediate concepts; and
6. architecture/contract guards continue to pass.

No calculation engine, database persistence, retrieval index, or LLM orchestration is introduced by this gate.
