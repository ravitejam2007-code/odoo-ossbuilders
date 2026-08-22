# Phase 5 Prompt — Payroll and Notifications

Implement Member 2's employee payroll and notification screens.

## Payroll
Route: `/payroll`

Requirements:
- display payroll/salary information returned by API
- read-only presentation
- loading/error/empty states
- responsive presentation

Do not invent payroll fields or calculations.

## Notifications
Route: `/notifications`

Requirements:
- notification list
- unread/read state
- timestamps
- loading/error/empty states
- mark-read mutation when supported by API

Use typed API client + TanStack Query.

## Cache behavior
After mark-read:
- update or invalidate the relevant notification query
- update navigation unread state if supported by the shared notification query
- do not assume success before the server responds

## Forbidden
- no payroll editing
- no payroll calculation engine
- no invented endpoints
- no backend changes
- no admin notification screens

Return changed files, hooks, test results, API assumptions, and blockers.
