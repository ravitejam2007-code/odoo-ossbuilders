# Master Build Prompt - Phase 4 - Leave Approval Workflow

Use this prompt in Cursor/Claude/Codex or another coding agent when implementing **Member 3's phase**.

## Role
You are implementing the Dayflow HRMS **Admin/HR frontend** as Member 3. Your work must stay within the assigned Admin surface and must integrate with the backend contracts owned by the backend lead.

## Product context
Dayflow is an HRMS with Admin/HR and Employee roles. Admin/HR manages employees, views attendance, approves leave, views/updates payroll, and uses reports. Employee functionality is owned separately. The Admin frontend must not bypass backend authorization or duplicate backend business rules.

## Phase objective
Implement the Admin leave-request queue and detail/approval experience, with clear Pending/Approved/Rejected states and a safe decision workflow that calls the backend transaction.

## Routes
- /admin/leave
- /admin/leave/:id

## Required behavior
1. Leave request list/queue
1. Status filtering
1. Leave request detail
1. Approve action
1. Reject action
1. Comment input for decisions
1. Confirmation state before consequential action
1. Mutation success/error handling
1. Post-decision refresh/invalidation
1. Decision history/status display

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
- Do not reproduce the leave-to-attendance transaction logic in React code.
- Do not optimistically mark an approval successful before the API confirms it unless the team explicitly chooses a safe optimistic strategy.
- Do not allow both Approve and Reject to submit accidentally from one click area.
- Do not silently submit an empty comment when a comment is required by the API/product.
- Do not assume any decision succeeded because the button became disabled.
- Do not refetch unrelated payroll/profile data on every leave decision.

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
- [ ] Admin sees all permitted requests and their current status.
- [ ] Approve/reject calls the agreed backend mutation endpoint and payload.
- [ ] After success, the request status and relevant queue counts update without a full-page reload.
- [ ] Errors leave the request state understandable and retryable.
- [ ] The UI never claims that attendance changed until the backend confirms the transaction.
