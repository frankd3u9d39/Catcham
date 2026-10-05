# API

The generated reference is at `/docs` when the server is running. It is the
authoritative list of endpoints and schemas; this page covers the conventions it
does not express.

## Base path and envelope

Everything is under `/api/v1`. Successful responses are wrapped:

```json
{ "success": true, "data": { } }
```

Failures use the same shape:

```json
{
  "success": false,
  "error": {
    "statusCode": 403,
    "code": "FORBIDDEN",
    "message": "Missing required permission: investigation:close",
    "path": "/api/v1/investigations/.../close",
    "timestamp": "2026-10-04T18:22:11.004Z"
  }
}
```

`code` is stable and safe to switch on. `message` is written to be shown to a
user. Validation failures add `details`, an array of field messages.

Evidence downloads are the one exception — they stream the file with
`Content-Disposition: attachment` and no envelope.

## Authentication

`POST /auth/login` returns an access token, a refresh token, and the caller's
resolved profile. Send the access token as `Authorization: Bearer <token>`.

Refresh tokens are single-use. `POST /auth/refresh` revokes the one presented and
issues a new pair, so a replayed token fails. A password change revokes every
session.

Endpoints marked `@Public()` need no token: the citizen reporting and tracking
routes, the geography lookups, and health.

## Permissions

Permission slugs are `resource:action`. The full set is in
`apps/api/src/common/constants.ts` and seeded into the `permissions` table.
`GET /auth/me` returns the caller's resolved permissions, which is what the
clients use to decide what to render.

Holding a permission is not sufficient on its own. Agency-scoped records are
checked again in the service, so a supervisor cannot act on another agency's
case even though they hold the permission.

## Pagination

List endpoints take `page` and `pageSize` (maximum 100) and return:

```json
{ "items": [], "page": 1, "pageSize": 20, "total": 0, "totalPages": 1 }
```

## Query parameters

Validation runs with `forbidNonWhitelisted`, so a parameter not declared on the
endpoint's DTO is a 400 rather than being ignored. Booleans must be sent as
`true` or `false`.

## Status codes

| Code | Meaning                                                           |
| ---- | ----------------------------------------------------------------- |
| 200  | Read succeeded                                                    |
| 201  | Resource created, including `POST` lookups such as tracking        |
| 204  | Succeeded with no body                                            |
| 400  | Validation failed, or a business rule rejected the request        |
| 401  | Missing, malformed or expired token                               |
| 403  | Authenticated, but lacking the permission or outside the agency   |
| 404  | No such record, or not disclosable to this caller                 |
| 409  | Unique constraint violated                                        |
| 429  | Rate limited                                                      |

Tracking a report with a wrong code returns 404, not 403. Distinguishing the two
would confirm that a reference number exists.

## The citizen path

```
GET  /public/reports/categories
POST /public/reports            → { referenceNumber, trackingCode, routedTo }
POST /public/reports/track      → { status, timeline }
GET  /geo/jurisdictions?level=STATE
GET  /geo/resolve?latitude=&longitude=
GET  /geo/offices/nearby?latitude=&longitude=&radiusKm=
```

`trackingCode` is returned once, for anonymous submissions only. The server
stores a hash of it and cannot reissue it. Tracking requires both the reference
number and the code; neither alone returns anything.

The public timeline is filtered to lifecycle milestones. Investigation detail,
contact details and internal notes are never included.
