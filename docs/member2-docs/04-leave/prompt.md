# Phase 4 Prompt — Employee Leave

Build Dayflow Member 2 leave functionality.

## Routes
- `/leave`
- `/leave/new`

## `/leave`
Show only the authenticated employee's leave requests.
Include:
- leave type
- date range
- remarks when appropriate
- Pending / Approved / Rejected status
- decision/comment when returned by the API

## `/leave/new`
Form fields:
- Paid / Sick / Unpaid leave type
- start date
- end date
- remarks

## Mutation behavior
Disable duplicate submission.
Use the typed API client.
On success, invalidate/refetch leave data and navigate back to the leave list.

## Business rule boundary
The backend owns leave approval and leave→attendance transaction logic.
The frontend must NOT reproduce or simulate that logic.

## Forbidden
- no approve/reject controls
- no attendance write after leave application
- no invented statuses
- no employee selector
- no backend modifications

## Quality
Use accessible forms, explicit validation messages, pending states, recoverable API errors, and responsive layouts.

Report changed files, hooks, API contract assumptions, tests, and integration issues.
