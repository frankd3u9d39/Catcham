# Domain Modules Integration

In adherence to CATCHAM's Clean Architecture & Modular Monolith design:
- Domain modules reside as isolated packages in `packages/*`.
- `apps/api/src/app.module.ts` imports these packages directly.
- No business logic or duplicate entities should be placed inside this directory.
