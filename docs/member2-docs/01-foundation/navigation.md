# Phase 1 Navigation — Employee Foundation

## Navigation hierarchy

- Dashboard → `/dashboard`
- Profile → `/profile`
  - Edit Profile → `/profile/edit`
- Attendance → `/attendance`
- Leave → `/leave`
  - Apply for Leave → `/leave/new`
- Payroll → `/payroll`
- Notifications → `/notifications`
- Logout → authentication entry flow

## Route rules
### `/dashboard`
Authenticated employee only.

### `/profile`
Authenticated employee only. Shows the currently authenticated employee's information.

### `/profile/edit`
Authenticated employee only. Only fields permitted by the product/API contract are editable by the employee.

### `/attendance`
Authenticated employee only. Never accept an employee ID from the URL for this employee route.

### `/leave`
Authenticated employee only. Displays only the authenticated employee's leave requests.

### `/leave/new`
Authenticated employee only.

### `/payroll`
Authenticated employee only and read-only for employees.

### `/notifications`
Authenticated employee only.

## Navigation state
Every route must support:
- active navigation indication
- loading state
- unauthorized state
- not-found behavior where applicable
- mobile navigation
- keyboard accessibility

## What NOT to do
- Do not add `/admin/*` routes to the employee navigation.
- Do not use query parameters to bypass role checks.
- Do not build employee navigation by manually concatenating URLs throughout the codebase.
- Do not duplicate the same route definition in multiple routers.
