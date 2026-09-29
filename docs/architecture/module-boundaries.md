# Module Boundaries

1. **core**: Workflow Engine, Rules Engine, upload presigning, base entities, domain events. No business models of specific agencies.
2. **identity**: User accounts, passwords, sessions, JWTs, permissions.
3. **organization**: Multi-tier hierarchy: Agency -> Department -> Office. Jurisdictions.
4. **reporting**: Whistleblower submissions, reference number generation, timeline.
5. **investigation**: Cases, task management, investigator assignment.
6. **evidence**: Immutable digital evidence, SHA-256 validation, chain-of-custody.
7. **notification**: Multi-channel dispatch (Email, SMS, Push, In-App).
8. **audit**: Append-only audit logger for compliance.
9. **analytics**: SLA monitoring and metrics aggregation.
10. **search**: Full-text indexing abstraction.
11. **gis**: PostGIS spatial calculations and point-in-polygon routing.
