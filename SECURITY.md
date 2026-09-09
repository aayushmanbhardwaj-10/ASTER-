# Security Policy

## Scope

ASTER treats tenant isolation, financial-data integrity, provenance, deterministic calculation, model/data egress, and historical analytical state as security-sensitive concerns.

## Reporting

Do not disclose suspected vulnerabilities, credentials, tenant-isolation failures, or sensitive data in public issues. Use the repository's configured private security reporting mechanism when available.

## Development rules

- Never commit credentials or secrets.
- Never use production data in local fixtures.
- Never bypass tenant authorization for testing convenience.
- Never grant worker roles unrestricted database privileges.
- Never treat an opaque resource identifier as proof of authorization.
