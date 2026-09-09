# Contributing to ASTER

ASTER follows a contract-first, architecture-gated workflow.

## Required workflow

1. Design.
2. Red-team.
3. Freeze the decision when appropriate.
4. Document it.
5. Update GitHub.
6. Verify repository state.
7. Proceed.

Implementation must not silently redefine frozen architecture.

## Change prefixes

Use focused commit prefixes such as `arch:`, `feat:`, `fix:`, `test:`, `refactor:`, `infra:`, `docs:`, and `security:`.

## Boundary rule

If a change crosses an architectural authority boundary, update the relevant architecture or contract documentation before implementation proceeds.
