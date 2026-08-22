# Dayflow — Team Roles & Work Split (3 Members)

**Companion to:** PRD.md, TRD.md, Navigation-Plan.md
**Version:** 1.0

Split by full-stack vertical slice (each person owns a set of modules end-to-end: DB → API → UI) rather than a strict frontend/backend split — with 3 people, vertical ownership avoids one person blocking two others waiting on an API.

## Member A — Auth, Profiles & Admin Core (Lead / Integrator)
**Suggested for:** whoever is driving architecture decisions and coordinating merges.

- Auth module: sign up, email verification, sign in, JWT issuance/refresh, password hashing
- Role-based route/API guards (shared middleware used by everyone else's endpoints)
- Employee Profile module: view/edit (employee-scoped and admin-scoped fields)
- Employee list + employee detail screens (Admin)
- Owns: DB schema setup, Prisma config, shared `shared-types` package, CI pipeline setup
- Integration responsibility: merges other members' modules against the schema, resolves auth-guard conflicts

## Member B — Attendance & Notifications
- Attendance module: check-in/check-out endpoints + UI, daily/weekly views (employee + admin)
- Attendance status logic (Present/Absent/Half-day/Leave) including the auto-update trigger when a leave is approved
- Notifications module: in-app notification list, read/unread state, email trigger integration (verification email + leave-decision email)
- Employee & Admin dashboard "activity feed" / alerts widget

## Member C — Leave, Payroll & Reports
- Leave module: apply-for-leave form, leave list (employee), all-requests view + approve/reject flow (admin)
- Payroll module: read-only employee payroll view, admin salary-structure edit screen, audit log on salary changes
- Reports/analytics module: attendance summary reports, salary slip generation/export (Phase 1.5)
- Coordinates with Member B on the leave-approval → attendance-update handoff (shared contract, agree on it early)

## Cross-Cutting / Shared Responsibilities

| Task | Owner |
|---|---|
| Design tokens / shared UI components (buttons, tables, forms, cards) | Member A sets up, all contribute |
| API error-envelope convention | Member A defines, all follow |
| Testing conventions (unit + integration) | Each member tests their own modules; Member A reviews auth/security-critical tests |
| Deployment (staging/prod) | Member A sets up pipeline; rotates on-call for deploys |
| Excalidraw board review / UI reconciliation | Whoever gets guest access first, shares findings with all three before UI work locks in |

## Suggested Sequencing (maps to PRD §9 phases)

1. **Week 1 (Phase 0):** All three — schema review, environment setup, agree on API contracts (use TRD §4 as the starting contract, adjust together before coding).
2. **Weeks 2–3 (Phase 1–2):** Member A builds auth + profile; Member B builds attendance; Member C scaffolds leave module against mocked attendance API.
3. **Weeks 3–4 (Phase 3):** Member C finishes leave + approval flow; Member B wires the leave→attendance status update; Member A polishes admin employee views.
4. **Week 5 (Phase 4):** Member C builds payroll; Member A + B support with admin dashboard integration and QA pass.
5. **Week 6 (Phase 1.5 + polish):** Notifications, reports, responsive QA, deploy to staging for review.

Adjust week counts to actual team velocity — this is a sequencing guide, not a fixed deadline.
