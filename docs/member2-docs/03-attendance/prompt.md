# Phase 3 Prompt — Employee Attendance

Implement Member 2's Dayflow attendance screen at `/attendance`.

## Requirements
- daily attendance view
- weekly attendance view
- check-in
- check-out
- statuses: Present, Absent, Half-day, Leave
- loading, empty, error, and mutation states

## API
Use the typed API client and TanStack Query.
The server is the source of truth for attendance state.

After check-in/check-out:
- prevent duplicate clicks
- wait for the mutation result
- invalidate/refetch affected attendance queries
- render the returned server state

## UX
Make current state obvious.
Use accessible labels and keyboard-operable controls.
Use centralized status presentation.

## Privacy
The employee frontend must never provide a selector or URL parameter that lets a normal employee request another employee's attendance.

## Forbidden
- no backend code
- no invented status values
- no local-only success state
- no admin attendance screens
- no client-side recreation of attendance business rules

## Finish with
A list of changed files, API calls/hooks, tests, edge cases, and unresolved contract questions.
