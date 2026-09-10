# @aster/ontology-compiler

Phase 1 implementation of the deterministic Ontology Compiler boundary.

## Pipeline

1. Lexical validation
2. Context intersection and alias collision detection
3. Reference validation
4. Dependency graph construction and cycle detection
5. Recursive semantic dimensional/type checking
6. Formula-variant precedence validation
7. Reachability and primitive/derived-role validation
8. Cross-object consistency validation
9. Deterministic immutable artifact generation

The compiler never executes a financial model. Its expression tree is semantic and non-executable. A release artifact is emitted only when there are zero fatal diagnostics.

## Seed

`packages/ontology/seed/draft-001.json` is the P1.4 concept manifest. Its companion `draft-001.formulas.json` contains the structured FormulaVariant records so the seed remains reviewable without duplicating large formula objects in every concept record.

The compiler merges the companion formula manifest before compilation; a missing companion is therefore treated as a validation failure when analytical/intermediate concepts lack formula families.

## Determinism

Artifact hashing uses canonical key ordering and SHA-256 over the unsigned artifact payload. The hash excludes itself.
