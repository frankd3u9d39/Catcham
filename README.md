# CATCHAM

Multi-agency incident reporting, investigation and evidence management for
Nigeria. Citizens submit reports — anonymously if they choose — which are routed
to the agency responsible for that category and jurisdiction. Officers triage
them, open cases, collect evidence under a verifiable chain of custody, and move
cases through a workflow their agency configures.

## What it does

**For citizens**

- Submit a report without an account. An anonymous submission stores no name,
  email or phone number.
- Receive a reference number and a one-time tracking code. Only a hash of the
  code is stored, so a leaked database does not grant access to reports.
- Track a report with both values. A reference number alone returns nothing.

**For agency staff**

- A triage queue, with the routing decision recorded on each report's timeline.
- Cases scoped to the agencies you belong to, with per-transition permission
  checks drawn from a workflow definition held in the database.
- Evidence hashed at intake, with a hash-chained custody ledger that fails
  verification if a record is altered.
- An append-only activity log, and dashboards for workload and overdue cases.

## Stack

| Part        | Technology                                                    |
| ----------- | ------------------------------------------------------------- |
| API         | NestJS 10, Prisma 5, SQLite                                   |
| Web portal  | Next.js 14 (App Router), Tailwind CSS, TanStack Query          |
| Mobile app  | Expo 51, Expo Router, React Native                             |
| Auth        | JWT access and refresh tokens, Argon2id password hashing       |
| Storage     | Local filesystem, addressed by generated key                   |

It runs as a single Node process against a SQLite file. There is no Redis, no
object store and no separate services to orchestrate — `pnpm dev` is the whole
development environment.

## Layout

```
apps/
  api/          NestJS server
    src/modules/    identity, organization, reporting, investigation,
                    evidence, workflow, rules, geo, analytics, audit,
                    notification
  web/          Next.js portal for agency staff and the public forms
  mobile/       Expo app for citizens, with a read-only officer view
prisma/
  schema.prisma Data model
  seeds/        Reference data (idempotent) and demonstration data
  data/         Jurisdiction reference data
docs/           Architecture notes and decision records
tests/          End-to-end and integration suites
```

## Running it

Requires Node 20.11 or later and pnpm 10.

```bash
cp .env.example .env
```

Set `JWT_ACCESS_SECRET` and `JWT_REFRESH_SECRET` to random values of at least 32
characters. The server refuses to start otherwise:

```bash
openssl rand -base64 48
```

Then install, migrate, seed and start:

```bash
pnpm install
pnpm db:generate && pnpm db:migrate && pnpm db:seed
pnpm dev
```

- API: <http://localhost:4000/api/v1>
- API reference: <http://localhost:4000/docs>
- Web portal: <http://localhost:3000>
- Mobile: `pnpm --filter @catcham/mobile dev`, then scan the QR code

The seed prints the tracking codes for the sample anonymous reports. Every
seeded account shares the password in `SEED_ADMIN_PASSWORD`:

| Account                            | Role                  |
| ---------------------------------- | --------------------- |
| `admin@catcham.local`              | System administrator  |
| `supervisor.efcc@catcham.local`    | Supervisor (EFCC)     |
| `investigator.efcc@catcham.local`  | Investigator (EFCC)   |
| `intake@catcham.local`             | Intake officer        |
| `auditor@catcham.local`            | Auditor               |
| `supervisor.nosdra@catcham.local`  | Supervisor (NOSDRA)   |

Demonstration data is skipped when `NODE_ENV=production` or `SEED_DEMO=false`.
Reference data — permissions, roles, jurisdictions, categories, agencies,
routing and the default workflow — is idempotent and safe to re-run anywhere.

### Pointing the mobile app at the API

`localhost` on a device means the device itself. The client substitutes the
Android emulator alias automatically and falls back to the host serving the Expo
bundle on a physical device. To override it, set `EXPO_PUBLIC_API_URL` in
`apps/mobile/.env`.

## How the moving parts work

**Routing.** A report's category and jurisdiction select an agency from the
`routing_rules` table, highest priority first; a jurisdiction-scoped rule beats a
national one for the same category. The business rules engine then runs and can
raise the priority, force supervisor review, or override the agency outright. The
decision and the rules that fired are written to the report timeline.

**Workflow.** Case states and their transitions live in `workflow_definitions` as
JSON, so an agency can change its progression without a deployment. Each
transition declares the permissions needed to take it, which is why a supervisor
and an investigator see different buttons on the same case.

**Chain of custody.** Every custody entry's SHA-256 covers its own fields plus
the previous entry's hash. Re-deriving the chain detects an altered or removed
row. This is tamper *evidence*, not tamper prevention: anyone with write access
to the whole table could recompute it, so the activity log and filesystem
permissions remain the other half of the control.

**Uploads.** A file's type is determined from its magic bytes, not the declared
`Content-Type`, and a mismatch between contents and extension is rejected.
Uploads are buffered in memory so they can be hashed and checked before anything
reaches disk, bounded by `UPLOAD_MAX_BYTES`.

**Geography.** SQLite has no spatial extension, so each jurisdiction stores a
bounding box and a centroid. Resolution filters by bounding box in SQL, then
picks the nearest centroid. Boxes overlap at borders, which is why the centroid
breaks the tie. The result is approximate and a triage officer can override it.

## Commands

```bash
pnpm dev           # API and web portal
pnpm build         # Build everything
pnpm test          # Unit tests
pnpm typecheck     # Typecheck every workspace
pnpm db:studio     # Browse the database
pnpm db:reset      # Drop, migrate and re-seed
```

## Known limitations

- **SQLite** suits a single process. Concurrent writes serialise, so a
  multi-instance deployment needs PostgreSQL; the Prisma schema is portable,
  but the migrations are SQLite-specific and would need regenerating.
- **Evidence lives on local disk.** There is no replication or lifecycle policy.
  Back up `STORAGE_ROOT` alongside the database — they are only meaningful
  together.
- **Citizens cannot attach files.** Evidence upload requires an authenticated
  officer, so the mobile and public web forms accept text and location only.
- **Email is best-effort.** Notifications are sent inline and a failure is
  recorded on the row; there is no retry worker. With no `SMTP_HOST` set they are
  logged rather than sent.
- **Jurisdiction data is partial.** All 37 states are loaded; LGAs cover only the
  states used in the sample data. The schema and lookup handle the full 774 —
  it is a reference-data import, not a code change.
- **No MFA.** The schema carries the columns; the flow is not implemented.
