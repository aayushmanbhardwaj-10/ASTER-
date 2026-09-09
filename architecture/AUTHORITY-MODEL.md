# ASTER AI — Authority Model

**Status:** FROZEN  
**Version:** 1.0

## Purpose

This document defines which ASTER subsystem is authoritative for each class of decision or state. No component may silently assume authority outside its boundary.

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

## Rules

1. The LLM is never authoritative for canonical financial truth, permissions, calculation results, or final verification.
2. Retrieval indexes, caches, embeddings, and runtime context are projections or acceleration layers, never canonical truth.
3. The Intelligence Plane may produce analytical results but must return authoritative application-state mutations through the System Plane state path.
4. Financial calculations execute through the authoritative Calculation Plane.
5. PostgreSQL is the authoritative structured system of record; RLS is a final tenant enforcement boundary.
6. Frameworks provide infrastructure and transport but do not own financial domain behavior.
7. Material security events are authoritative in the immutable audit system, not in an ordinary application table.
8. Any authority transfer must be explicit in an architectural contract and must preserve provenance and verification semantics.
