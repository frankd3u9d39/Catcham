# Decisions

Short records of choices that are not obvious from the code, including the ones
that reversed an earlier direction.

---

## 1. SQLite, not PostgreSQL

**Decision.** One SQLite file, accessed by a single API process.

**Why.** The deployment target is one server. The workload — a few thousand
reports, a few hundred officers — is well within what SQLite handles, and it
removes a service to install, tune, back up and secure. `pnpm dev` is the entire
development environment, with no Docker.

**Cost.** Writes serialise, so horizontal scaling is not available without
moving to PostgreSQL. The Prisma schema is portable; the migrations are
SQLite-specific and would need regenerating.

**Supersedes** an earlier PostgreSQL plus PostGIS design.

---

## 2. Jurisdiction lookup by bounding box, not PostGIS

**Decision.** Store a bounding box and centroid per jurisdiction. Filter by box
in SQL, then pick the nearest centroid.

**Why.** Follows from the SQLite decision. Routing needs to answer "which state
and LGA is this point in" well enough to pick an agency, and a triage officer
reviews every report anyway.

**Cost.** Approximate near borders. A point in a thin salient of one state may
resolve to its neighbour. The UI presents it as a suggestion, and the logic is
confined to `GeoService` so a PostGIS implementation is a single-file change.

---

## 3. Local filesystem for evidence, not object storage

**Decision.** Write evidence to `STORAGE_ROOT` under a generated key.

**Why.** Follows from running as one process on one server. An S3-compatible
store would add a dependency whose only benefit here is replication, which a
filesystem backup also provides.

**Cost.** No lifecycle policies, no replication, no presigned URLs — downloads
stream through the API, which means they are permission-checked and recorded as
custody events. That is arguably better for evidence, and worse for throughput.

**Supersedes** an earlier MinIO plus S3 design.

---

## 4. Feature modules, not separate packages

**Decision.** One NestJS application with feature modules under
`apps/api/src/modules`.

**Why.** An earlier layout split the domain across eleven workspace packages with
repository interfaces, CQRS commands and handlers. For the amount of behaviour
actually present, that structure cost more in navigation and indirection than it
returned. Modules give the same boundaries with none of the build-graph overhead.

**Cost.** Nothing enforces the boundaries mechanically; a module can import
another's service. The import graph is shallow enough to review.

---

## 5. Inline notification delivery, not a queue

**Decision.** Send notifications in the request that triggers them. Record
failures on the row.

**Why.** A queue needs a broker and a worker process, which contradicts the
single-process decision. In-app notifications are a database insert. Email is the
only call that can be slow, and it is not on a path a user waits for.

**Cost.** No automatic retry. A failed send is visible in the `notifications`
table with its error, and can be retried by hand or by a future worker.

**Supersedes** an earlier BullMQ plus Redis design.

---

## 6. Workflow as data, rules as data

**Decision.** Case states and transitions live in `workflow_definitions`.
Triage and priority rules live in `business_rules`. Both are JSON validated on
write.

**Why.** Agencies change their case progression and their triage thresholds more
often than the software is deployed. Encoding those in code makes every policy
change a release.

**Cost.** Two small interpreters to maintain and test, and a class of
configuration error that only surfaces at evaluation time. Both are mitigated by
validating on write — an unparseable rule is rejected before it is stored — and
by skipping, rather than failing on, a rule that somehow becomes invalid.

**Deliberately limited.** The rules engine supports comparison operators only: no
arithmetic, no nested rule references, no expressions. Anything needing more
belongs in a service where it can be reviewed and tested.

---

## 7. Argon2id for passwords and tracking codes

**Decision.** Hash both with Argon2id at `memoryCost 19456, timeCost 2`.

**Why.** A tracking code grants read access to a report. Storing it in plaintext
would make a database leak equivalent to disclosing every anonymous report.
Hashing it means the code cannot be recovered or reissued — which is a real cost
to the submitter, and the UI is explicit about it.

**Binding.** `@node-rs/argon2`, which ships prebuilt binaries, rather than
`argon2`, which compiles at install time.

---

## 8. Tokens in browser storage

**Decision.** The web client keeps its access and refresh tokens in
`localStorage`. The mobile client keeps them in the OS keystore.

**Why.** The API is a separate origin from the web client and holds no server
session, so a `HttpOnly` cookie would need a shared domain and CSRF protection.

**Cost.** Any script on the page can read the tokens, so this trades XSS
resistance for deployment simplicity. It is mitigated by a short access-token
lifetime and single-use refresh tokens — presenting a refresh token revokes it
and issues a new pair, so a replayed token fails.

---

## 9. Anonymous reports are genuinely anonymous

**Decision.** An anonymous report stores no submitter id, email or phone number.
Tracking requires both the reference number and the code.

**Why.** A whistleblowing channel that retains identifying data is not one. The
two-factor lookup means a guessed or leaked reference number alone discloses
nothing.

**Cost.** No way to contact the submitter for clarification, and no way to
restore access to a lost code.
