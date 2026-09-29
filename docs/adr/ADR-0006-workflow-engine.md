# ADR-0006: Centralized Workflow State Machine Engine
## Status: Accepted
## Context
Avoid scattering status transitions across different controllers.
## Decision
Centralize state machine definitions and transition execution in `@catcham/core/workflow`.
