# Master Build Prompt - Phase 2 - Admin Dashboard and Employee Management

Use this prompt in Cursor/Claude/Codex or another coding agent when implementing **Member 3's phase**.

## Role
You are implementing the Dayflow HRMS **Admin/HR frontend** as Member 3. Your work must stay within the assigned Admin surface and must integrate with the backend contracts owned by the backend lead.

## Product context
Dayflow is an HRMS with Admin/HR and Employee roles. Admin/HR manages employees, views attendance, approves leave, views/updates payroll, and uses reports. Employee functionality is owned separately. The Admin frontend must not bypass backend authorization or duplicate backend business rules.

## Phase objective
Implement the Admin dashboard and employee-management experience: employee list, employee detail, employee editing, filtering/search affordances where supported, and safe navigation between records.

## Routes
- /admin/dashboard
- /admin/employees
- /admin/employees/:id
- /admin/employees/:id/edit

## Required behavior
1. Dashboard employee-list summary
1. Attendance overview summary area
1. Pending leave approvals summary widget
1. Employee table/list
1. Employee detail page
1. Employee edit page
1. Form validation and dirty-state handling
1. Success/error feedback after edits
1. Deep-link handling for invalid employee IDs

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
- Do not allow Employee users to edit Admin-only fields through an accidental reusable form.
- Do not make every table cell editable unless the API/product requires it.
- Do not put salary editing into the employee profile edit screen when payroll has its own route.
- Do not fetch the full employee universe repeatedly for every widget when cached/shared data can be reused.
- Do not expose passwords, tokens, or authentication secrets on profile pages.
- Do not delete employees unless the backend contract and requirements explicitly add such a capability.

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
- [ ] Admin can open an employee from the list and land on a stable detail URL.
- [ ] Admin edit form changes only fields allowed by the Admin product surface.
- [ ] Invalid IDs produce a useful not-found state instead of a blank screen.
- [ ] Dashboard widgets link to the underlying Admin route where appropriate.
- [ ] No duplicate employee-fetching logic exists across pages when a shared hook can be reused.
