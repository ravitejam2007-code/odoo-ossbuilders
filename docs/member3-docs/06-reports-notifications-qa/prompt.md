# Master Build Prompt - Phase 6 - Reports, Notifications, View-as-Employee and Final QA

Use this prompt in Cursor/Claude/Codex or another coding agent when implementing **Member 3's phase**.

## Role
You are implementing the Dayflow HRMS **Admin/HR frontend** as Member 3. Your work must stay within the assigned Admin surface and must integrate with the backend contracts owned by the backend lead.

## Product context
Dayflow is an HRMS with Admin/HR and Employee roles. Admin/HR manages employees, views attendance, approves leave, views/updates payroll, and uses reports. Employee functionality is owned separately. The Admin frontend must not bypass backend authorization or duplicate backend business rules.

## Phase objective
Finish the Admin experience with reports, notifications integration where exposed, read-only View-as-Employee behavior, responsive polish, accessibility, and end-to-end frontend QA against staging.

## Routes
- /admin/reports
- Admin notification entry points if present in the agreed navigation
- View-as-employee read-only state using shared employee dashboard components

## Required behavior
1. Reports/analytics dashboard for supported reports
1. Attendance/salary report views only for API-supported metrics
1. Admin notification entry point/state where applicable
1. View-as-employee mode reusing Member 2's employee dashboard components
1. Read-only visual treatment in view-as mode
1. Responsive QA
1. Accessibility QA
1. Cross-route error/empty/loading QA
1. Staging smoke tests
1. Final navigation and API contract verification

## Implementation instructions
1. Inspect the existing codebase before editing. Reuse existing components, hooks, providers, route configuration, API client, types, and styling conventions.
2. Do not overwrite or refactor unrelated files. Keep the change set phase-scoped.
3. Check the current backend/shared-types definitions before inventing any fields, endpoint, status, or payload. If a required API contract is missing, isolate the missing integration point and use a typed temporary mock only where necessary for UI progress.
4. Build shared UI pieces only when they have repeated value. Put reusable pieces in the shared UI location rather than beside one route.
5. Keep server data in TanStack Query or the project's established server-state layer. Keep form state local and explicit.
6. Every asynchronous surface needs loading, failure, empty, and success behavior. Never leave blank-screen states.
7. Every mutation must show pending state, prevent accidental duplicate submits, handle backend errors, and update/invalidate the affected server cache.
8. Use accessible labels, keyboard navigation, focus states, and non-color-only status indicators.
9. Preserve the agreed Dayflow terminology and route names.
10. Make the UI responsive without changing the information architecture between desktop and mobile.

## Forbidden changes
- Do not build analytics formulas locally when backend reports are authoritative.
- Do not duplicate the employee dashboard to create View-as-Employee.
- Do not make View-as-Employee editable.
- Do not hide read-only status merely by disabling a few buttons; mutation paths must also be structurally unavailable.
- Do not add new features during final QA unless required to fix a release-blocking issue.
- Do not mark the phase complete while critical routes still depend on mock-only data.

## Testing checklist
- [ ] Happy path works with real API contracts.
- [ ] Loading state works on slow network.
- [ ] Error state works on 4xx and 5xx responses.
- [ ] Empty state works when no records exist.
- [ ] Unauthorized user cannot use the Admin workflow successfully.
- [ ] Refreshing the route preserves a valid authenticated session or produces the expected auth behavior.
- [ ] Invalid resource IDs produce a useful not-found state.
- [ ] Mutation cannot be double-submitted.
- [ ] Cache updates/invalidation refresh the affected screen without unrelated refetch storms.
- [ ] Mobile layout remains usable.

## Output expected from the coding agent
Return: (1) files changed, (2) why each file changed, (3) API contracts consumed, (4) tests run, (5) known limitations, and (6) any backend contract gap that blocks a production-complete implementation.

## Definition of done
- [ ] Reports render only data the API provides and explain empty datasets clearly.
- [ ] View-as-Employee reuses shared components and cannot mutate employee data.
- [ ] Admin routes are usable at supported breakpoints.
- [ ] Critical accessibility issues are resolved.
- [ ] All Admin flows pass staging smoke tests using real API contracts.
- [ ] No route, API endpoint, or shared component dependency remains undocumented.
