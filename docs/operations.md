# Operations

## Configuration

Every variable is validated at boot by `apps/api/src/config/configuration.ts`.
An invalid value stops the process rather than surfacing later as a confusing
runtime failure.

| Variable                                  | Notes                                                      |
| ----------------------------------------- | ---------------------------------------------------------- |
| `DATABASE_URL`                            | SQLite path, e.g. `file:./data/catcham.db`                  |
| `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET` | At least 32 characters, and different from each other       |
| `JWT_ACCESS_TTL`, `JWT_REFRESH_TTL`       | `15m`, `7d` — the only accepted form is `<number><s\|m\|h\|d>` |
| `CORS_ORIGINS`                            | Comma-separated allowlist; an unlisted origin is refused    |
| `STORAGE_ROOT`                            | Evidence directory                                          |
| `UPLOAD_MAX_BYTES`                        | Bounds the in-memory upload buffer                          |
| `RATE_LIMIT_WINDOW_MS`, `RATE_LIMIT_MAX`  | Global default; some endpoints set tighter limits in code   |
| `SMTP_*`, `MAIL_FROM`                     | Empty `SMTP_HOST` logs email instead of sending it          |
| `SEED_DEMO`                               | `false` skips demonstration data                            |

The server refuses to start in production with the example JWT secrets.

## Rate limits

The global default applies everywhere. These endpoints are tighter, in code:

| Endpoint                     | Limit             | Why                                   |
| ---------------------------- | ----------------- | ------------------------------------- |
| `POST /auth/login`           | 5 per minute      | The endpoint worth brute-forcing      |
| `POST /auth/refresh`         | 20 per minute     | Legitimate clients rotate often       |
| `POST /public/reports`       | 5 per 10 minutes  | Unauthenticated write                 |
| `POST /public/reports/track` | 10 per minute     | Unauthenticated lookup                |

Limits are per IP and held in memory, so they reset on restart and are not shared
across instances. With one process, that is the whole picture.

## Running in production

```bash
pnpm install --prod=false
pnpm db:generate
pnpm db:deploy        # migrate deploy, never migrate dev
pnpm db:seed          # reference data only; set SEED_DEMO=false
pnpm build
node apps/api/dist/main.js
```

Put a reverse proxy in front for TLS. The API sets `trust proxy`, so `req.ip` is
read from `X-Forwarded-For` — which means the proxy must set it and must not pass
through a client-supplied value, or audit entries and rate limits can be forged.

`helmet` sets the security headers. CORS is an explicit allowlist, not a
wildcard.

## Backups

Back up two things, together:

1. The SQLite file named by `DATABASE_URL`, plus its `-wal` and `-shm` siblings.
2. The directory named by `STORAGE_ROOT`.

They are only meaningful as a pair. A database without its blobs has custody
chains pointing at missing files; blobs without the database are unattributable.

Take the database copy with `sqlite3 catcham.db ".backup"` or by stopping the
process. Copying the file while it is being written to can capture a torn state.

## Verifying evidence

`GET /evidence/:id/integrity` re-reads the blob, re-hashes it, and compares
against the hash recorded at intake. It also re-derives the custody chain. Both
must hold for the evidence to be presentable.

A `fileIntact: false` result means the stored bytes no longer match intake. A
`chain.valid: false` result names the sequence number where re-derivation
diverged. Either is worth investigating immediately — check the activity log for
who last touched the record, and the filesystem for who can write to
`STORAGE_ROOT`.

## Schema changes

```bash
pnpm db:migrate       # creates and applies a migration in development
```

Commit the generated migration. CI fails if `prisma/schema.prisma` and
`prisma/migrations` disagree, which is the common way a schema change reaches
production without its migration.

## Seeding

Reference data — permissions, roles, jurisdictions, categories, agencies,
routing rules, business rules, the workflow — is idempotent and safe to re-run
anywhere. Role permissions are replaced rather than merged, so removing a
permission from `reference.seed.ts` removes it from the role on the next run.

Demonstration data runs only when the database has no users, and is skipped
entirely when `NODE_ENV=production` or `SEED_DEMO=false`.

## Common failures

**The server exits at boot with a configuration error.** Read the message; it
names the variable and what is wrong. The usual cause is a JWT secret under 32
characters.

**A browser request fails with no `Access-Control-Allow-Origin`.** The origin is
not in `CORS_ORIGINS`. The allowlist is exact, including scheme and port.

**`PRAGMA` fails with "Execute returned results".** A pragma that returns a row
needs `$queryRawUnsafe`, not `$executeRawUnsafe`.

**An upload is refused as an unsupported type.** The file's magic bytes did not
match any accepted signature, or its contents disagree with its extension. The
declared `Content-Type` is ignored by design.
