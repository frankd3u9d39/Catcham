# ADR-0002: Modular Monolith vs Microservices
## Status: Accepted
## Context
Avoid premature distributed systems complexity while allowing future service extraction.
## Decision
Build as a NestJS modular monolith with strict package boundaries in `packages/*`.
## Consequences
Fast local development, unified transactions where needed, zero network latency between modules.
