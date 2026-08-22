# Dayflow — Technical Requirements Document (TRD)

**Companion to:** PRD.md
**Version:** 1.0

---

## 1. Architecture Overview

Standard 3-tier web architecture: SPA frontend → REST API backend → relational database. Chosen over microservices given the team size (3 members) and v1 scope — a modular monolith keeps deployment and debugging simple while the module boundaries below still map to a future service split if the project grows.

```
┌─────────────────┐      HTTPS/JSON       ┌──────────────────┐      SQL      ┌──────────────┐
│  React Frontend │  ───────────────────▶ │  Node/Express API │ ───────────▶ │  PostgreSQL   │
│  (Vite + TS)     │ ◀───────────────────  │  (REST + JWT auth) │ ◀─────────── │              │
└─────────────────┘                        └──────────────────┘               └──────────────┘
                                                     │
                                                     ▼
                                            ┌──────────────────┐
                                            │  Email service    │  (verification, notifications)
                                            │  (e.g. Resend/SES)│
                                            └──────────────────┘
```

## 2. Tech Stack

| Layer | Choice | Rationale |
|---|---|---|
| Frontend | React 18 + TypeScript + Vite | Fast dev loop, strong typing for a 3-person team, wide hiring/skill availability |
| Styling | Tailwind CSS | Utility-first, fast to build role-based dashboards consistently |
| State/data | TanStack Query + Zustand | Server cache handled by Query; small client state (auth/session) via Zustand |
| Backend | Node.js + Express + TypeScript | Matches frontend language, simple REST modeling, easy for a small team to split ownership |
| ORM | Prisma | Type-safe DB access, migrations, works well with PostgreSQL |
| Database | PostgreSQL | Relational data (users, attendance, leave, payroll) with real foreign-key integrity |
| Auth | JWT (access + refresh token) + bcrypt | Stateless auth suited to SPA + API split |
| Email | Resend or AWS SES | Verification emails, leave-status notifications |
| Hosting (API) | Render / Railway | Simple deploy for a small team, managed PostgreSQL available |
| Hosting (Frontend) | Vercel / Netlify | Zero-config static/SPA hosting |
| CI | GitHub Actions | Lint + typecheck + test on PR |

## 3. Data Model (Core Entities)

```
User
├─ id (uuid, pk)
├─ employee_id (unique)
├─ email (unique)
├─ password_hash
├─ role (enum: ADMIN, EMPLOYEE)
├─ email_verified (bool)
├─ created_at, updated_at

Profile
├─ id (pk)
├─ user_id (fk → User)
├─ full_name, phone, address
├─ profile_picture_url
├─ job_title, department, date_joined
├─ documents[] (fk → Document)

Document
├─ id (pk)
├─ profile_id (fk → Profile)
├─ file_url, file_type, uploaded_at

Attendance
├─ id (pk)
├─ user_id (fk → User)
├─ date
├─ check_in_time, check_out_time
├─ status (enum: PRESENT, ABSENT, HALF_DAY, LEAVE)

LeaveRequest
├─ id (pk)
├─ user_id (fk → User)
├─ leave_type (enum: PAID, SICK, UNPAID)
├─ start_date, end_date
├─ remarks
├─ status (enum: PENDING, APPROVED, REJECTED)
├─ reviewed_by (fk → User, nullable)
├─ admin_comment
├─ created_at, updated_at

SalaryStructure
├─ id (pk)
├─ user_id (fk → User)
├─ base_salary
├─ allowances (jsonb)
├─ deductions (jsonb)
├─ effective_from
├─ updated_by (fk → User)
├─ updated_at

Notification
├─ id (pk)
├─ user_id (fk → User)
├─ type, message, read (bool)
├─ created_at
```

**Key relationships:** One `User` → one `Profile` → many `Document`s. One `User` → many `Attendance` rows (one per day) and many `LeaveRequest`s. `LeaveRequest.status = APPROVED` should trigger an `Attendance` row update/insert with `status = LEAVE` for the covered date range (via a backend job or transaction, not client-side).

## 4. API Design (REST, versioned under `/api/v1`)

| Resource | Endpoints |
|---|---|
| Auth | `POST /auth/signup`, `POST /auth/verify-email`, `POST /auth/login`, `POST /auth/refresh`, `POST /auth/logout` |
| Profile | `GET /profile/me`, `PATCH /profile/me`, `GET /profile/:userId` (admin), `PATCH /profile/:userId` (admin) |
| Employees | `GET /employees` (admin, paginated/filterable), `GET /employees/:id` (admin) |
| Attendance | `POST /attendance/check-in`, `POST /attendance/check-out`, `GET /attendance/me?range=`, `GET /attendance/:userId` (admin), `GET /attendance` (admin, all) |
| Leave | `POST /leave`, `GET /leave/me`, `GET /leave` (admin, all/pending), `PATCH /leave/:id/decision` (admin) |
| Payroll | `GET /payroll/me`, `GET /payroll/:userId` (admin), `PATCH /payroll/:userId` (admin) |
| Notifications | `GET /notifications/me`, `PATCH /notifications/:id/read` |
| Reports | `GET /reports/attendance-summary` (admin), `GET /reports/salary-slip/:userId` |

All non-auth endpoints require `Authorization: Bearer <access_token>`; role is checked server-side via middleware, not inferred from the token alone re-checked against DB role on sensitive writes (salary, role changes).

## 5. Security Requirements

- Passwords: bcrypt (cost factor ≥ 12), never logged or returned in any response.
- JWT access tokens short-lived (~15 min), refresh tokens rotated and stored httpOnly/secure cookie.
- Email verification required before login is allowed (`email_verified = true` gate).
- Rate limiting on `/auth/login` and `/auth/signup` (e.g., express-rate-limit) to slow brute force.
- Input validation on every endpoint (Zod schemas shared between frontend forms and backend where possible).
- Salary/payroll endpoints: explicit `role === ADMIN || userId === self` check on every read, `role === ADMIN` on every write.
- CORS locked to the deployed frontend origin.
- File uploads (profile picture, documents) validated by MIME type and size limit, stored in object storage (S3-compatible), not the DB.

## 6. Non-Functional / Infra

- **Environments:** local (docker-compose: Postgres + API), staging, production.
- **Migrations:** Prisma Migrate, committed to repo, run in CI/CD pipeline before deploy.
- **Logging:** structured JSON logs (pino), request IDs for tracing.
- **Testing:** unit tests (Vitest/Jest) for services/business logic, integration tests for auth + leave-approval flow (highest-risk paths), component tests for key React forms.
- **Error handling:** consistent API error envelope `{ error: { code, message } }`; frontend maps codes to user-facing copy.

## 7. Directory Structure (proposed)

```
dayflow/
├─ apps/
│  ├─ web/                # React + Vite frontend
│  └─ api/                # Express + Prisma backend
├─ packages/
│  └─ shared-types/        # Zod schemas / TS types shared by web + api
├─ docs/                   # PRD.md, TRD.md, Navigation-Plan.md, etc.
└─ .github/workflows/      # CI
```
