# Dayflow

**Every workday, perfectly aligned.**

Dayflow is a role-based Human Resource Management System (HRMS) that digitizes core HR operations — employee onboarding, profile management, attendance tracking, leave management, and payroll visibility — for small-to-mid-sized teams.

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Available Scripts](#available-scripts)
- [Documentation](#documentation)
- [Team](#team)
- [Roadmap](#roadmap)

---

## Overview

Dayflow replaces spreadsheet- and paper-based HR tracking with a single web app shared by employees and HR admins.

**Core modules:**
- Secure authentication (sign up / sign in, email verification, role-based access)
- Role-based dashboards (Admin vs Employee)
- Employee profile management
- Attendance tracking (check-in/out, daily & weekly views)
- Leave & time-off management with an approval workflow
- Payroll/salary visibility (employee read-only, admin full control)
- Notifications and analytics/reports (Phase 1.5)

Full requirements are in [`docs/PRD.md`](docs/PRD.md).

## Tech Stack

| Layer | Choice |
|---|---|
| Frontend | React 18 + TypeScript + Vite, Tailwind CSS, TanStack Query, Zustand |
| Backend | Node.js + Express + TypeScript, Prisma ORM |
| Database | PostgreSQL |
| Auth | JWT (access + refresh tokens), bcrypt |
| Email | Resend / AWS SES |
| Hosting | Render or Railway (API), Vercel or Netlify (frontend) |
| CI | GitHub Actions |

Full architecture and rationale in [`docs/TRD.md`](docs/TRD.md).

## Project Structure

```
dayflow/
├─ apps/
│  ├─ web/                # React + Vite frontend
│  └─ api/                # Express + Prisma backend
├─ packages/
│  └─ shared-types/        # Zod schemas / TS types shared by web + api
├─ docs/                   # PRD, TRD, Navigation Plan, Team Roles, Integration Guide
└─ .github/workflows/      # CI
```

## Getting Started

### Prerequisites
- Node.js 20+
- pnpm (or npm/yarn — adjust commands below accordingly)
- Docker (for local PostgreSQL)

### Setup

```bash
# 1. Clone the repo
git clone https://github.com/<org>/dayflow.git
cd dayflow

# 2. Install dependencies
pnpm install

# 3. Start local PostgreSQL
docker-compose up -d

# 4. Copy env files and fill in values
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env

# 5. Run database migrations
pnpm --filter api prisma migrate dev

# 6. Start the dev servers
pnpm dev
```

By default the API runs on `http://localhost:4000` and the frontend on `http://localhost:5173`.

## Environment Variables

See `.env.example` in each app for the full list. Key variables:

| Variable | Where | Purpose |
|---|---|---|
| `DATABASE_URL` | `apps/api` | PostgreSQL connection string |
| `JWT_ACCESS_SECRET` / `JWT_REFRESH_SECRET` | `apps/api` | Token signing keys |
| `EMAIL_API_KEY` | `apps/api` | Resend/SES key for verification & notification emails |
| `VITE_API_BASE_URL` | `apps/web` | API base URL the frontend calls |

Never commit real secrets — staging/production values are set in the hosting platform's env config.

## Available Scripts

| Command | Description |
|---|---|
| `pnpm dev` | Run frontend + backend in dev mode |
| `pnpm build` | Build all apps for production |
| `pnpm test` | Run unit + integration tests across the monorepo |
| `pnpm lint` | Lint all packages |
| `pnpm --filter api prisma studio` | Open Prisma Studio to inspect the DB |
| `pnpm --filter api prisma migrate dev` | Run/create a new migration |

## Documentation

| Doc | Purpose |
|---|---|
| [`docs/PRD.md`](docs/PRD.md) | Product requirements — goals, user classes, functional & non-functional requirements |
| [`docs/TRD.md`](docs/TRD.md) | Technical architecture, data model, API design, security |
| [`docs/Navigation-Plan.md`](docs/Navigation-Plan.md) | Full route map and screen-level flows |
| [`docs/Team-Roles.md`](docs/Team-Roles.md) | Team split by module (vertical slice) |
| [`docs/Team-Roles-FrontendBackend.md`](docs/Team-Roles-FrontendBackend.md) | Alternative team split by frontend/backend layer |
| [`docs/Integration-Guide.md`](docs/Integration-Guide.md) | Shared contracts between modules — auth guard, types, error format |

> Note: the original spec links an Excalidraw board for design guidance. It's a JS-rendered canvas that hasn't been reconciled against `Navigation-Plan.md` yet — open it with guest access and flag any mismatches before UI work locks in.

## Team

Three-member team — see [`docs/Team-Roles.md`](docs/Team-Roles.md) or [`docs/Team-Roles-FrontendBackend.md`](docs/Team-Roles-FrontendBackend.md) for the current split (pick one model, don't run both).

## Roadmap

- [ ] Phase 0 — Auth, roles, DB schema, scaffolding
- [ ] Phase 1 — Profile management, dashboards
- [ ] Phase 2 — Attendance tracking
- [ ] Phase 3 — Leave management + approvals
- [ ] Phase 4 — Payroll visibility
- [ ] Phase 1.5 — Notifications, analytics & reports

---

## License

TBD
