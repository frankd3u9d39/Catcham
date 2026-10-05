# Architecture

## Shape

One NestJS process, one SQLite file, two clients. There is no message broker, no
object store and no separate services. That is a deliberate fit to the problem:
the workload is a few thousand reports and a few hundred officers, which a single
process handles comfortably, and every component removed is one fewer thing to
operate.

```
apps/mobile (Expo)  ─┐
                     ├─→  apps/api (NestJS)  ─→  SQLite (prisma/schema.prisma)
apps/web (Next.js)  ─┘                        └─→  Local filesystem (evidence)
```

## Modules

`apps/api/src/modules` holds one directory per domain. Modules depend on each
other through Nest's injector; there is no event bus, so a cross-module effect is
an ordinary method call and shows up in a stack trace.

| Module         | Responsibility                                                     |
| -------------- | ------------------------------------------------------------------ |
| `identity`     | Accounts, sessions, roles, permission resolution                    |
| `organization` | Agencies, departments, offices, routing rules                       |
| `reporting`    | Public submission, tracking, triage, the report queue               |
| `investigation`| Cases, assignments, tasks, notes, escalations                       |
| `evidence`     | Upload, storage, chain of custody, integrity verification           |
| `workflow`     | The case state machine and its versioned definitions                |
| `rules`        | The business rules engine                                           |
| `geo`          | Jurisdiction lookup and nearest-office search                       |
| `analytics`    | Aggregate counts, resolution times, SLA breaches                    |
| `audit`        | The append-only activity log                                        |
| `notification` | In-app and email delivery                                           |

`audit` and `notification` are `@Global()` because nearly every module writes to
them. Nothing else is.

## Request pipeline

Order matters, and it is declared in `app.module.ts`:

1. `ThrottlerGuard` — rate limiting, before any work is done.
2. `AuthGuard` — verifies the bearer token and resolves the caller's agencies,
   roles and permissions in one query. Endpoints opt out with `@Public()`.
3. `PermissionsGuard` — enforces `@RequirePermissions(...)`.
4. `ValidationPipe` — `whitelist` and `forbidNonWhitelisted`, so an unknown query
   parameter or body field is a 400 rather than silently ignored.
5. `TransformInterceptor` — wraps success responses as `{ success: true, data }`.
6. `AllExceptionsFilter` — wraps failures as `{ success: false, error }` and maps
   Prisma constraint errors to 409, 404 and 400.

Because `forbidNonWhitelisted` validates the entire query object against one DTO,
every endpoint that accepts filters declares them all on a single DTO. Splitting
them across `@Query()` and `@Query('name')` parameters causes the whitelist to
reject the named ones.

## Authorisation

A user holds memberships. Each membership binds a user to an agency with a role,
and a role carries permissions. `AuthGuard` flattens that into `agencyIds`,
`roleCodes` and `permissions` on every request.

Two checks apply independently:

- **Permission** — does the caller hold `investigation:close`? Enforced by
  `PermissionsGuard` from route metadata.
- **Scope** — is the caller a member of the agency that owns this case? Enforced
  inside each service, because the guard cannot know which record is being
  touched.

Both are needed. A supervisor in one agency holds `investigation:close` but must
not close another agency's case.

## Routing a report

1. If coordinates were submitted, `GeoService` resolves them to a state and LGA.
   Coordinates win over submitted codes: they are measured, not chosen.
2. `RoutingRule` rows for the report's category are read, highest priority first.
   A rule scoped to the report's LGA or state beats a national one.
3. The rules engine evaluates `REPORT_TRIAGE` rules against the report's facts.
   A matching rule can raise the priority, require supervisor review, or override
   the agency outright.
4. The decision and the names of the rules that fired are written to the report
   timeline and the activity log.

An officer's explicit triage decision overrides all of this.

## Workflow

Case states live in `workflow_definitions.statesJson`:

```json
{
  "EVIDENCE_COLLECTION": {
    "transitions": [
      { "to": "EVIDENCE_REVIEW", "label": "Submit for review",
        "permissions": ["investigation:transition"] },
      { "to": "CLOSED", "label": "Close case",
        "permissions": ["investigation:close"] }
    ]
  },
  "CLOSED": { "transitions": [], "terminal": true }
}
```

`workflow.engine.ts` is pure: it answers whether a transition is legal and which
transitions an actor may take. The service persists the result. Parsing rejects a
transition targeting an undeclared state, so a case cannot reach a dead end.

Publishing a new version deactivates the previous one. Existing cases keep their
state string and are evaluated against the new definition on their next move.

## Chain of custody

Each `CustodyRecord` carries a `sequence`, a `previousHash` and an `entryHash`
covering its own fields plus its predecessor's hash. Re-deriving the chain
detects an altered field, a removed row, or a re-pointed `previousHash`.

The `(evidenceId, sequence)` unique index is the backstop against a concurrent
append forking the chain.

This is tamper *evidence*, not tamper prevention. An attacker with write access
to the whole table could recompute every hash. The activity log, which is a
separate table, and filesystem permissions are the other half of the control.

## Evidence storage

Files are written under `STORAGE_ROOT` at a generated key, never the uploader's
filename. Every path is re-resolved against the root before use, and a key that
escapes it is rejected.

Uploads are buffered in memory so the file can be hashed and its magic bytes
checked before anything reaches disk. `UPLOAD_MAX_BYTES` bounds that. The stored
MIME type comes from the sniffed signature, not the declared `Content-Type`, and
a mismatch between contents and extension is refused.

Archiving marks the row and deletes the blob, keeping the custody chain readable
after the file is gone.

## Geography without a spatial extension

SQLite has no PostGIS. Each jurisdiction stores a bounding box and a centroid.
Resolution filters by bounding box in SQL, then picks the nearest centroid by
haversine distance. Boxes overlap at borders, which is exactly why the centroid
breaks the tie.

This is approximate, and the UI says so. It is accurate enough to route a report
to a state or LGA, and a triage officer can override it. A deployment needing
true point-in-polygon accuracy would move to PostgreSQL with PostGIS; the lookup
is confined to `GeoService`.

## SQLite specifics

- No native enums. Status and category columns are TEXT, constrained in
  `common/constants.ts` and validated by the DTOs.
- `journal_mode = WAL` and `synchronous = NORMAL` are set at boot. Both persist
  in the database file, so setting them once covers every pooled connection.
  Per-connection pragmas are left to Prisma's connector, which already enables
  foreign keys and a busy timeout.
- `contains` has no case-insensitive mode. Emails are stored lower-cased and
  search terms are lower-cased to match.
- Writes serialise. That is the main reason this layout suits one process.
