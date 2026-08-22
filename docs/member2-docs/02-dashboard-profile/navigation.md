# Phase 2 Navigation — Dashboard and Profile

## Routes

### `/dashboard`
Primary employee landing page.

Navigation targets:
- Profile → `/profile`
- Attendance → `/attendance`
- Leave Requests → `/leave`
- Logout → authentication flow

### `/profile`
Read-only employee profile view except navigation to edit.

Actions:
- Edit Profile → `/profile/edit`

### `/profile/edit`
Editable employee-owned profile fields.

Actions:
- Save → remain on `/profile/edit` or redirect according to existing app convention
- Cancel → `/profile`

## Navigation behavior
After login, redirect the employee to `/dashboard`.
After logout, invalidate/clear the authenticated client state and return to the login entry point.

## What NOT to do
- Never link an employee to `/admin/employees/:id`.
- Never place salary editing in employee navigation.
- Never add a generic “Switch Employee” control to employee pages.
