# Master Build Prompt - Phase 1 - Foundation, Admin Shell, Routing and Shared UI

Use this prompt in Cursor/Claude/Codex or another coding agent when implementing **Member 3's phase**.

## Role
You are implementing the Dayflow HRMS **Admin/HR frontend** as Member 3. Your work must stay within the assigned Admin surface and must integrate with the backend contracts owned by the backend lead.

## Product context
Dayflow is an HRMS with Admin/HR and Employee roles. Admin/HR manages employees, views attendance, approves leave, views/updates payroll, and uses reports. Employee functionality is owned separately. The Admin frontend must not bypass backend authorization or duplicate backend business rules.

## Phase objective
Create the Admin application foundation that every later phase can safely build on: route structure, role-aware layout, shared UI primitives, API integration boundary, and predictable loading/error patterns.

## Routes
- /admin/dashboard
- /admin/employees
- /admin/employees/:id
- /admin/employees/:id/edit
- /admin/attendance
- /admin/leave
- /admin/leave/:id
- /admin/payroll
- /admin/payroll/:id/edit
- /admin/reports

## Required behavior
1. Admin shell/sidebar/header/breadcrumb structure
1. Role-aware navigation configuration
1. Protected Admin route wrapper
1. Shared Button/Card/Table/FormField/Modal/Badge/Alert/EmptyState/Loading primitives
1. Typed API client integration pattern using backend-provided contracts
1. TanStack Query query/mutation conventions
1. Global error and permission-denied handling
1. Responsive layout skeleton for desktop/tablet/mobile

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
- Do not implement fake business logic just to make screens look complete.
- Do not hard-code employee, attendance, leave or payroll records into production UI components.
- Do not build a second design system inside an Admin page.
- Do not trust a role stored only in localStorage for authorization.
- Do not create route names that differ from the agreed Navigation-Plan paths.
- Do not tightly couple shared components to one page's data shape.

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
- [ ] Every Admin route renders through the same shell.
- [ ] Non-Admin users cannot reach Admin views through ordinary UI navigation.
- [ ] Every async surface demonstrates loading/error/empty/success behavior.
- [ ] Shared components are documented with props and usage examples.
- [ ] A mock typed API can be swapped for the real backend without rewriting screen components.
