# ASTER AI

ASTER is a domain-specific financial artificial intelligence designed to understand financial knowledge and data, perform accurate deterministic financial calculations, analyze financial information, reason across interconnected financial concepts, and provide transparent, contextual, and verifiable financial intelligence.

## Repository status

**Architecture:** frozen  
**Repository Foundation:** established  
**Application implementation:** not yet begun

See `architecture/` for the canonical architecture, constitution, authority model, dependency graph, contract architecture, and repository architecture.

## Development principles

- Contract-first development.
- Deterministic financial computation is authoritative.
- The LLM is not financial authority.
- Canonical financial truth belongs to the data plane.
- Workspace state is authoritative in the system plane.
- Tenant authorization is enforced independently of resource identifiers.
- Architecture violations are build failures, not style issues.

## Local development

The initial local topology is defined around PostgreSQL, Redis, S3-compatible object storage, the System API, Intelligence API, and isolated workers. The local environment will be implemented incrementally after the repository foundation.
