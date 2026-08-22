# Member 3 Documentation - Dayflow HRMS

These documents are for Member 3 (Admin frontend + API integration), aligned to the uploaded Team Roles and Dayflow requirements.

## Phase structure
- **Phase 1 - Foundation, Admin Shell, Routing and Shared UI** (Week 1) - `01-foundation/phase.md`, `01-foundation/navigation.md`, `01-foundation/prompt.md`
- **Phase 2 - Admin Dashboard and Employee Management** (Weeks 2-3) - `02-admin-employees/phase.md`, `02-admin-employees/navigation.md`, `02-admin-employees/prompt.md`
- **Phase 3 - Admin Attendance Management** (Weeks 2-4) - `03-admin-attendance/phase.md`, `03-admin-attendance/navigation.md`, `03-admin-attendance/prompt.md`
- **Phase 4 - Leave Approval Workflow** (Weeks 3-4) - `04-admin-leave/phase.md`, `04-admin-leave/navigation.md`, `04-admin-leave/prompt.md`
- **Phase 5 - Admin Payroll and Salary Control** (Week 5) - `05-admin-payroll/phase.md`, `05-admin-payroll/navigation.md`, `05-admin-payroll/prompt.md`
- **Phase 6 - Reports, Notifications, View-as-Employee and Final QA** (Week 6) - `06-reports-notifications-qa/phase.md`, `06-reports-notifications-qa/navigation.md`, `06-reports-notifications-qa/prompt.md`

## Role boundary
- Member 3 owns all Admin-role routes.
- Member 3 co-owns shared UI with Member 2.
- Backend auth, DB, API contracts, transaction logic, and CI/deploy remain owned by Member 1.
- Do not run the frontend/backend split together with an alternative vertical-slice ownership model.
