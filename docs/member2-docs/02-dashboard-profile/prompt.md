# Phase 2 Prompt — Dashboard and Profile

Implement Dayflow Member 2 Phase 2.

## Build
1. `/dashboard`
2. `/profile`
3. `/profile/edit`

## Dashboard requirements
Provide:
- quick-access cards for Profile, Attendance, Leave Requests
- recent activity/alerts
- loading skeletons
- empty state
- error state
- responsive layout

Make dashboard cards reusable because Member 3's Admin "View as employee" experience may reuse employee dashboard components.

## Profile requirements
Display:
- personal details
- job details
- salary structure
- documents
- profile picture

Employee editing is limited to:
- address
- phone
- profile picture

## API integration
Use the existing typed API client and TanStack Query.
Do not invent request/response shapes.
Use query invalidation or cache updates after mutation.

## Validation
Check:
- authenticated employee can open every route
- unauthorized users cannot access employee content
- edit form cannot change restricted fields
- submit cannot be double-clicked into duplicate requests
- errors are visible and recoverable

## Forbidden
Do not implement admin employee editing.
Do not change backend authorization.
Do not expose employee IDs as a picker.
Do not put server business logic in the frontend.

## Output
Report changed files, API hooks used, routes, component reuse, tests, and any contract mismatch.
