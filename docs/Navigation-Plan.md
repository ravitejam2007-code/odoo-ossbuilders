# Dayflow — Navigation Plan

**Companion to:** PRD.md, TRD.md
**Version:** 1.0

> The source Excalidraw board (linked in the PDF) likely contains the intended screen flow/wireframes but is a JS-rendered canvas I couldn't extract content from. This navigation plan is derived from the written functional spec — cross-check it against the board once someone opens it as guest, and adjust before locking the UI.

## 1. Route Map

### Public (unauthenticated)
```
/                     → Landing / redirect to /login
/signup               → Sign Up form (Employee ID, email, password, role)
/verify-email         → Email verification confirmation screen
/login                → Sign In form
```

### Employee (role: EMPLOYEE)
```
/dashboard                    → Employee Dashboard (cards + activity feed)
/profile                      → View profile
/profile/edit                 → Edit profile (address, phone, picture only)
/attendance                   → My attendance (daily/weekly toggle)
/attendance/check-in          → Check-in/out action (could be a modal, not a full route)
/leave                        → My leave requests (list + status)
/leave/new                    → Apply for leave form
/payroll                      → My payroll (read-only)
/notifications                → Notification list
```

### Admin / HR Officer (role: ADMIN)
```
/admin/dashboard               → Admin Dashboard (employee list, attendance overview, pending approvals)
/admin/employees                → Employee list (search/filter)
/admin/employees/:id            → Employee detail (profile, attendance, leave, payroll tabs)
/admin/employees/:id/edit       → Edit employee (all fields)
/admin/attendance               → All-employee attendance view
/admin/leave                    → All leave requests (filter: pending/approved/rejected)
/admin/leave/:id                → Leave request detail + approve/reject + comment
/admin/payroll                  → All-employee payroll view
/admin/payroll/:id/edit         → Edit salary structure
/admin/reports                  → Analytics & reports dashboard
```

## 2. Navigation Structure

- **Top-level nav (role-aware):** Dashboard, Profile/Employees, Attendance, Leave, Payroll, Notifications, Logout.
- **Employee** sees their own scoped versions; **Admin** sees the aggregate/admin versions of the same nav items — same information architecture, different data scope, so the two sidebars should look structurally similar (fewer surprises when the org promotes someone to HR).
- **Admin employee switch:** from `/admin/employees/:id`, an "Impersonate view" or "View as employee" action satisfies the PDF's "ability to switch between employees" requirement — read-only view into that employee's dashboard, clearly labeled to avoid confusion with actual login-as.

## 3. Screen-Level Flow (key journeys)

**Onboarding → first login**
`/signup` → `/verify-email` (email link) → `/login` → `/dashboard`

**Applying for leave**
`/dashboard` → `/leave` → `/leave/new` → submit → back to `/leave` (status: Pending) → notification on decision → `/leave` reflects Approved/Rejected

**Admin approving leave**
`/admin/dashboard` (pending approvals widget) → `/admin/leave` → `/admin/leave/:id` → Approve/Reject + comment → employee's `/attendance` auto-updates for approved date range

**Daily check-in**
`/dashboard` → check-in button (dashboard card, no route change) → status updates in `/attendance`

## 4. Layout Conventions

- Persistent left sidebar (role-based items) + top bar (user avatar, notifications bell, logout) — consistent across all authenticated routes.
- Dashboards use a card-grid layout for quick-access items, per the PDF's explicit "quick-access cards" requirement.
- Tables (employee list, attendance, leave, payroll) share one reusable table component with sort/filter/pagination, so all three admin list screens behave identically.
- Forms (signup, leave application, profile edit) use the same field-validation and error-display pattern throughout.

## 5. Mobile / Responsive Notes

v1 is responsive web, not native. Sidebar collapses to a bottom nav or hamburger menu below ~768px. Priority for small screens: Dashboard, Check-in, Leave status — these should never require horizontal scrolling.
