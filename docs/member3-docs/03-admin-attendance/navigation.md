# Navigation Plan - Phase 3 - Admin Attendance Management

**Owner:** Member 3

## Navigation goal
Keep the Admin experience predictable, role-aware, and consistent with the agreed Dayflow route structure. Navigation should expose only the routes the current Admin/HR user is authorized to access, while direct URL access still depends on backend authorization.

## Route map
- `/admin/attendance`

## Recommended Admin navigation hierarchy
- **Dashboard** -> `/admin/dashboard`
- **Employees** -> `/admin/employees` -> employee detail -> employee edit
- **Attendance** -> `/admin/attendance`
- **Leave** -> `/admin/leave` -> leave detail/decision
- **Payroll** -> `/admin/payroll` -> payroll edit
- **Reports** -> `/admin/reports`

## Page-to-page behavior
1. Every list page must provide a clear way to open the relevant detail view when a detail route exists.
2. Detail pages must provide a safe return path to the list and preserve useful filter context when practical.
3. Edit pages must provide Cancel and Save/Submit actions with clear unsaved-change handling.
4. Consequential actions such as leave approval/rejection should keep the user on a useful context after completion and visibly update the changed record.
5. Breadcrumbs should reflect the route hierarchy, for example `Employees / Employee / Edit`.
6. The sidebar/header must remain consistent between phases; new routes extend the navigation configuration instead of creating a new layout.

## Guarding rules
- Admin navigation is rendered only for the Admin/HR role returned by the authenticated session.
- A route guard should redirect or show an explicit unauthorized state rather than rendering a partially loaded admin page.
- Backend authorization remains authoritative. Never treat hidden navigation as proof of permission.

## Navigation anti-patterns
- Do not create duplicate routes such as `/admin/employee-list` when `/admin/employees` is already agreed.
- Do not open edit screens in modals when the product flow requires a stable edit route.
- Do not make browser history confusing by replacing every navigation with hard redirects.
- Do not lose the selected employee when moving between employee-related subpages unless the route naturally changes the selected resource.
- Do not place Admin routes under Employee navigation.

## Phase-specific navigation checks
- Admin can view attendance for all employees permitted by backend authorization.
- Daily and weekly representations agree on the same underlying records.
- Statuses are visually distinct but not color-only.
- Date navigation is stable and preserves intended filters.
- No personally unrelated employee data leaks through cached query keys.
