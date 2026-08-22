# Dayflow — Integration Guide

**Companion to:** PRD.md, TRD.md, Navigation-Plan.md, Team-Roles.md
**Version:** 1.0

Purpose: how the three members' modules plug into each other without stepping on shared code. Read this before writing any endpoint that another member's module depends on.

## 1. Repo & Branching

- Monorepo layout per TRD §7 (`apps/web`, `apps/api`, `packages/shared-types`).
- `main` = deployable. Each member works in `feature/<module>-<short-desc>` branches, PRs into `main` (or a shared `develop` branch if the team prefers a staging integration branch).
- **Member A (integrator)** reviews any PR that touches `packages/shared-types`, auth middleware, or the DB schema — those are the shared surface area everyone depends on.
- Merge order matters early on: schema + auth guard (Member A) lands first, then attendance (Member B) and leave scaffolding (Member C) can build against real endpoints instead of mocks.

## 2. Shared Contracts (define before building)

### 2.1 Auth guard contract
Every protected route uses one middleware exported from `apps/api/src/middleware/auth.ts`:
```ts
requireAuth()                 // any logged-in user
requireRole('ADMIN')          // admin-only
requireSelfOrAdmin(paramKey)  // e.g. GET /profile/:userId — self or admin
```
Member A owns this file. Members B and C import it, never reimplement role checks inline.

### 2.2 Shared types
`packages/shared-types` holds Zod schemas for every entity (User, Attendance, LeaveRequest, SalaryStructure, Notification) plus the inferred TS types. Both `apps/api` and `apps/web` import from here — this is what keeps frontend forms and backend validation from drifting apart. Any schema change is a PR that all three review, since it can silently break another member's screen.

### 2.3 API error envelope
```json
{ "error": { "code": "LEAVE_ALREADY_REVIEWED", "message": "This request was already approved or rejected." } }
```
All endpoints return this shape on failure. Frontend has one `parseApiError()` helper (Member A sets it up) that all forms use for error display — consistent UX, no per-screen error-handling reinvention.

## 3. The Leave → Attendance Handoff (highest-coordination-risk integration point)

This is the one place Member B and Member C's modules directly touch each other, so it gets its own contract:

- When Member C's `PATCH /leave/:id/decision` sets `status = APPROVED`, it must call a shared service function `applyLeaveToAttendance(userId, startDate, endDate)` — **owned and implemented by Member B**, exposed from `apps/api/src/modules/attendance/service.ts`.
- Member C's endpoint calls this function inside the same DB transaction as the status update, so a failure rolls back both — a leave should never show "Approved" without the attendance days updating, or vice versa.
- Member B defines the function signature early (Week 1–2) even before the full attendance module is done, so Member C can code against it.

## 4. Notification Hooks

Member B's notification module exposes `notify(userId, type, message)`. Any module that needs to fire a notification (leave decision from Member C, email verification from Member A) calls this function — nobody sends emails or writes notification rows directly. This keeps notification logic (email vs in-app vs both, based on `type`) in one place.

## 5. Frontend Integration

- Shared UI primitives (Button, Card, Table, FormField) live in `apps/web/src/components/ui/` — built once (Member A scaffolds, all contribute variants as needed), reused across every screen listed in Navigation-Plan.md.
- Routing: React Router with a role-aware layout wrapper (`<AuthenticatedLayout role={...}>`) that renders the correct sidebar per Navigation-Plan §2. One layout component, not three separate dashboard shells.
- Data fetching: TanStack Query hooks are colocated per module (`apps/web/src/modules/leave/hooks.ts`, etc.) but all hit the same typed API client (`apps/web/src/lib/apiClient.ts`, generated/typed against `shared-types`).

## 6. Environment & Config

- One `.env.example` at repo root, updated by whoever adds a new required variable, PR'd for visibility.
- Local dev: `docker-compose up` brings up Postgres; each member runs `apps/api` and `apps/web` locally against it.
- Secrets (JWT signing key, email API key, S3/object storage keys) never committed — staging/prod values live in the hosting platform's env config (Render/Railway + Vercel).

## 7. Definition of Done (per module, before merging)

- [ ] Endpoint(s) validated with Zod schemas from `shared-types`
- [ ] Role guard applied via the shared middleware (§2.1)
- [ ] Errors use the shared envelope (§2.3)
- [ ] Unit test for core logic, integration test if it touches the leave↔attendance handoff
- [ ] Frontend screen matches the route in Navigation-Plan.md and uses shared UI primitives
- [ ] No direct DB writes to another module's table without going through that module's owned service function (see §3, §4)

## 8. Open Coordination Item

Someone needs guest access to the Excalidraw board to confirm the intended screen layouts/flows match Navigation-Plan.md before high-fidelity UI work starts — flagged in PRD.md and Navigation-Plan.md as well so it doesn't get lost.
