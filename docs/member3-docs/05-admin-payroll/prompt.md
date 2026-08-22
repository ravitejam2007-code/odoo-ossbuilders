# Master Build Prompt - Phase 5 - Admin Payroll and Salary Control

Use this prompt in Cursor/Claude/Codex or another coding agent when implementing **Member 3's phase**.

## Role
You are implementing the Dayflow HRMS **Admin/HR frontend** as Member 3. Your work must stay within the assigned Admin surface and must integrate with the backend contracts owned by the backend lead.

## Product context
Dayflow is an HRMS with Admin/HR and Employee roles. Admin/HR manages employees, views attendance, approves leave, views/updates payroll, and uses reports. Employee functionality is owned separately. The Admin frontend must not bypass backend authorization or duplicate backend business rules.

## Phase objective
Implement the Admin payroll view and salary-structure editing surface while keeping employee payroll read-only on the employee side and preventing accidental cross-module edits.

## Routes
- /admin/payroll
- /admin/payroll/:id/edit

## Required behavior
1. All-employee payroll list/view
1. Employee payroll detail/edit route
1. Salary structure form
1. Field-level validation
1. Save/cancel flow
1. Change confirmation for sensitive edits
1. Success/error feedback
1. Readable currency/number formatting
1. Permission-aware states

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
- Do not place payroll edit controls on the employee-facing payroll route.
- Do not invent salary fields that are not in the API/requirements.
- Do not format monetary values by string concatenation in multiple components.
- Do not commit changes on every keystroke unless specifically required.
- Do not reveal payroll data in URLs or browser logs.
- Do not assume a salary update succeeded without the backend response.

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
- [ ] Admin can view payroll for permitted employees.
- [ ] Admin edit route is separate from the read/list route.
- [ ] Validation prevents malformed submissions before network calls.
- [ ] Successful changes visibly update the displayed salary structure.
- [ ] Employee payroll remains read-only in Member 2's experience.
