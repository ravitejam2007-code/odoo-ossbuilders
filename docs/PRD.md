# Dayflow — Product Requirements Document (PRD)

**Tagline:** Every workday, perfectly aligned.
**Version:** 1.0
**Status:** Draft for team kickoff
**Owner:** Ajju (Javali Ajayakumar)

> Note: The source PDF links to an Excalidraw board (`link.excalidraw.com/l/65VNwvy7c4X/58RLEJ4oOwh`) as visual guidance. That board is a JS-rendered canvas and could not be read programmatically — no shapes/wireframe content came through, only the app shell. Whoever has edit access should open it directly and pull annotated screens/flows into the `/design` folder before UI work starts, since the layout decisions in this PRD are inferred from the written spec, not the board.

---

## 1. Purpose & Vision

Dayflow digitizes core HR operations — onboarding, attendance, leave, payroll visibility, and approvals — into a single role-based web application. The goal is to remove spreadsheet- and paper-based HR tracking for small-to-mid-sized teams and give employees and HR officers a shared, always-current source of truth.

## 2. Problem Statement

HR teams at small organizations typically track attendance, leave, and payroll across disconnected tools (Excel sheets, WhatsApp requests, manual registers). This causes:
- Delayed or lost leave approvals
- No single view of who's present/absent on a given day
- Employees unable to self-serve basic info (payslip, leave balance, profile)
- Admins re-entering the same data across systems

## 3. Goals & Success Metrics

| Goal | Metric |
|---|---|
| Replace manual attendance tracking | 100% of check-in/out logged digitally within 30 days of launch |
| Reduce leave approval turnaround | Average approval time < 24 hours |
| Give employees payroll visibility | 90%+ of employees view a payslip in-app within first pay cycle |
| Reduce admin data entry | Admin edits profile fields only for exceptions, not routine updates |

## 4. Non-Goals (v1)

- Full payroll *processing* / tax computation (v1 is read-only payroll visibility + admin-entered salary structure, not a payroll engine)
- Biometric/hardware attendance integration
- Mobile native apps (responsive web only in v1)
- Multi-company / multi-tenant support

## 5. User Classes

| User Type | Description | Key Permissions |
|---|---|---|
| **Admin / HR Officer** | Manages employees, approves leave & attendance, controls payroll | Full CRUD on employees, approve/reject leave, edit salary structure, view all attendance |
| **Employee** | Regular user, self-service only | View/edit own profile (limited fields), apply for leave, view own attendance & payroll |

## 6. Functional Requirements

### 6.1 Authentication & Authorization
- **Sign Up:** Employee ID, email, password, role selection (Employee/HR). Password must meet complexity rules (min 8 chars, upper/lower/number/symbol). Email verification required before first login.
- **Sign In:** Email + password. Clear, specific error messages for invalid credentials (without leaking whether the email exists). Successful login redirects to role-based dashboard.
- **Authorization:** Route- and API-level role checks (Admin vs Employee) — never trust client-side role display alone.

### 6.2 Dashboard
- **Employee Dashboard:** Quick-access cards for Profile, Attendance, Leave Requests, Logout; recent activity/alerts feed (e.g., "Your leave was approved," "Check-in reminder").
- **Admin Dashboard:** Employee list (searchable/filterable), attendance records overview, pending leave approvals queue, ability to switch into any employee's record view.

### 6.3 Employee Profile Management
- **View:** Personal details, job details, salary structure, documents, profile picture.
- **Edit (Employee):** Address, phone number, profile picture only.
- **Edit (Admin):** All fields, including job details and salary structure.

### 6.4 Attendance Management
- Daily and weekly attendance views.
- Employee check-in/check-out action.
- Status types: Present, Absent, Half-day, Leave.
- Employees see only their own records; Admin/HR sees all.

### 6.5 Leave & Time-Off Management
- **Apply (Employee):** Leave type (Paid, Sick, Unpaid), date range, remarks. Status: Pending → Approved/Rejected.
- **Approve (Admin):** View all requests, approve/reject with comments. Status change reflects immediately in the employee's attendance record (an Approved leave day should show as "Leave" in attendance).

### 6.6 Payroll / Salary Management
- **Employee:** Read-only view of own payroll/salary structure.
- **Admin:** View payroll for all employees, update salary structure, ensure payroll data accuracy (audit trail on changes).

### 6.7 Notifications & Reports (from source doc §6 "Future Enhancements," pulled into v1 scope where noted)
- Email/in-app notification on leave status change and check-in reminders.
- Analytics & reports dashboard: attendance summaries, salary slips, exportable reports (Admin-facing).

> These two items were listed under "Future Enhancements" in the source PDF but are referenced elsewhere in the functional spec (dashboard alerts, payslip view) — flagged here as **Phase 1.5**, not core v1, so the team can sequence them after the core modules (6.1–6.6) are stable.

## 7. Non-Functional Requirements

| Category | Requirement |
|---|---|
| Security | Passwords hashed (bcrypt/argon2), JWT/session-based auth, role checks server-side, HTTPS only |
| Performance | Dashboard loads < 2s on standard broadband; attendance list paginated beyond 50 records |
| Availability | Target 99% uptime for a v1 internal-tool deployment |
| Accessibility | WCAG 2.1 AA for core flows (login, dashboard, leave form) |
| Data privacy | Salary and personal data visible only to the owning employee and Admin role |
| Auditability | Leave approvals and salary edits are logged with actor + timestamp |

## 8. Assumptions & Open Questions

- Assuming single-organization deployment (no multi-tenant need in v1).
- Assuming Admin and HR Officer share one permission tier in v1 (source doc doesn't distinguish them functionally — flag if that's wrong).
- Excalidraw board access needed to confirm exact screen layouts before high-fidelity UI work begins.
- Payroll: confirm whether "Update salary structure" means raw numbers only, or needs allowance/deduction breakdown fields.

## 9. Release Plan (Phased)

| Phase | Scope |
|---|---|
| Phase 0 | Auth, roles, DB schema, project scaffolding |
| Phase 1 | Profile management, dashboards |
| Phase 2 | Attendance tracking (check-in/out, views) |
| Phase 3 | Leave management + approval workflow |
| Phase 4 | Payroll visibility (read + admin edit) |
| Phase 1.5 (parallel/after Phase 3) | Notifications, analytics/reports |
