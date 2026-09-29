# ADR-0008: Immutable Digital Chain of Custody
## Status: Accepted
## Context
Evidence must remain legally admissible in Nigerian courts.
## Decision
Compute SHA-256 hash at upload and store immutable append-only transfer records for every interaction.
