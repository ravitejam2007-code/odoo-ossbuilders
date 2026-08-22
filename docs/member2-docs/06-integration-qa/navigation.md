# Phase 6 Navigation — Integration and Final Employee Surface

## Final employee navigation

- Dashboard `/dashboard`
- Profile `/profile`
- Attendance `/attendance`
- Leave `/leave`
- Payroll `/payroll`
- Notifications `/notifications`
- Logout

## Cross-surface coordination
Admin navigation belongs to Member 3. Employee navigation must remain clean and employee-focused.

Member 3's "View as employee" may reuse Employee dashboard components. Shared components must therefore remain appropriately reusable and should not depend on only one route's assumptions.

## Final navigation checks
Verify:
- authenticated user lands on dashboard
- refresh preserves protected route when session is valid
- invalid session exits to auth entry point
- no admin routes leak into employee navigation
- navigation works on mobile
- active link state remains correct after direct URL entry

## What NOT to do
Do not add temporary debug routes to the production navigation.
Do not leave mock/demo links exposed.
Do not use duplicate navigation definitions.
