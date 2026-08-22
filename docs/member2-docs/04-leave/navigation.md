# Phase 4 Navigation — Leave

## Routes

### `/leave`
Employee leave history/status.

Primary action:
- Apply for Leave → `/leave/new`

### `/leave/new`
Create a new employee leave request.

On success:
- return to `/leave`
- refreshed data should show the new request/status from the server

## Navigation rules
Leave is available only to authenticated employees in the employee navigation.

## What NOT to do
- No `/admin/leave` links in employee navigation.
- No approve/reject action.
- No employee selector.
