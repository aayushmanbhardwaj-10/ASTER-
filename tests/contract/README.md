# Contract Tests

This directory is reserved for language-independent contract compatibility tests.

The tests in this gate must cover, at minimum:

- finite and non-finite financial numbers;
- explicit financial periods and boundary semantics;
- resource-reference tenancy semantics without treating identifiers as authorization;
- payload references for large artifacts; and
- lifecycle tombstones for deleted or restricted evidence.

These tests validate wire semantics, not framework-specific implementations.
