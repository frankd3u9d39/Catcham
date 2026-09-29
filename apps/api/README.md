# CATCHAM Modular Monolith API Gateway

The primary NestJS application serving REST endpoints, WebSockets, OpenAPI documentation, and queue orchestrations.

## Architecture Guidelines
- **Zero Business Logic in Controllers**: Controllers strictly handle HTTP concerns, DTO validation, and dispatch CQRS commands/queries or domain calls.
- **Import Packages as Modules**: All 11 domain modules are authored inside `packages/*` and registered cleanly in `app.module.ts`.
- **Database Abstraction**: Access through Prisma service connected with PostGIS extension.
