# ADR-0009: Decoupled Business Rules Engine
## Status: Accepted
## Context
Routing policies and triage conditions change frequently without software redeployment.
## Decision
Implement a rules evaluator in `@catcham/core/rules` that matches declarative conditions against payloads.
