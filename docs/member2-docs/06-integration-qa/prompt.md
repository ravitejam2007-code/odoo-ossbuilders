# Phase 6 Prompt — Final Employee Integration and QA

You are the Dayflow Member 2 frontend owner performing final employee-surface integration.

## Scope
Audit and complete:
- auth entry integration
- dashboard
- profile
- profile edit
- attendance
- leave
- leave creation
- payroll
- notifications
- employee navigation
- shared UI consistency

## Tasks
1. Replace stale mocks with real typed API hooks where contracts are available.
2. Verify query keys and invalidation.
3. Verify loading/error/empty states.
4. Test session expiration and logout.
5. Test all employee routes after refresh/direct navigation.
6. Perform responsive QA.
7. Perform accessibility QA.
8. Coordinate shared UI behavior with Member 3.
9. Run the project's available lint/typecheck/test commands.
10. Record every unresolved issue instead of hiding it.

## Security boundary
The employee frontend must never become an alternate admin client.
Do not expose:
- all-employee data
- admin employee editing
- leave approval
- payroll editing
- admin reports

## Forbidden
- no unsafe API contract invention
- no `any`/unsafe casts solely to suppress errors
- no backend business logic
- no last-minute architecture rewrite
- no silent removal of failing tests

## Final output
Return:
- summary of completed employee features
- files changed
- routes verified
- API hooks/endpoints consumed
- tests/lint/typecheck results
- responsive/accessibility findings
- unresolved blockers
- handoff notes for Member 1 and Member 3
