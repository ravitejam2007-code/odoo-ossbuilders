# Member 3 - Admin Frontend Implementation Package

This package is written for **Member 3**, who owns the Dayflow **Admin/HR frontend surface** and its integration with the backend API. The uploaded team split explicitly assigns Member 3 all Admin-role routes, including the Admin dashboard, employee management, attendance, leave, payroll, reports, and the read-only "View as employee" experience. Member 3 also co-owns the shared UI component library with Member 2.

## Source alignment

The Dayflow requirements define two user classes: Admin/HR and Employee. Admin/HR manages employees, approves leave and attendance, and views payroll; Employees have restricted access to their own profile, attendance, leave and salary information. The Admin frontend must therefore enforce the UI boundary without pretending that frontend checks are the security boundary.

## Member 3 non-negotiable rules

1. Build only the Admin/HR experience unless a shared component is genuinely required by both roles.
2. Consume Member 1/Backend's typed API contract; do not invent request or response shapes.
3. Never duplicate backend business rules in the frontend. The leave-approval transaction is explicitly a backend-owned rule.
4. Reuse shared UI primitives rather than creating screen-specific Button, Table, FormField, Modal, Badge, or EmptyState variants.
5. Keep loading, error, empty, success, and permission-denied states explicit.
6. Never expose employee data to another employee through an accidental route or stale client cache.
7. Treat frontend route guards as UX/access control assistance, not as authorization. Backend authorization remains authoritative.
8. Do not silently change business terminology from the PRD. Use Admin/HR, Employee, Pending, Approved, Rejected, Present, Absent, Half-day, Leave, Paid, Sick, and Unpaid consistently.

# Phase 2 - Admin Dashboard and Employee Management

**Owner:** Member 3 - Admin Frontend + API Integration  
**Schedule:** Weeks 2-3

## 1. Phase objective
Implement the Admin dashboard and employee-management experience: employee list, employee detail, employee editing, filtering/search affordances where supported, and safe navigation between records.

## 2. Routes in scope
- `/admin/dashboard`
- `/admin/employees`
- `/admin/employees/:id`
- `/admin/employees/:id/edit`

## 3. Exact implementation sequence
1. Read the current typed API contract and confirm request/response shapes before writing page-level data logic.
2. Build or reuse the shared UI primitives required by the screen. Do not create a local one-off design system.
3. Create the route component and keep it responsible for composition, not low-level API details.
4. Create/reuse typed query and mutation hooks with stable query keys.
5. Add loading, error, empty, and success states before polishing the happy path.
6. Add form validation where the route accepts input.
7. Wire the real API and remove mock-only behavior from the production path.
8. Add permission-aware behavior and verify that unauthorized users do not see Admin navigation.
9. Test desktop and mobile layouts.
10. Test direct navigation, browser refresh, invalid IDs, network failures, and stale-cache scenarios.
11. Document any API assumption or backend dependency before handing the phase to integration review.

## 4. Deliverables
- **Dashboard employee-list summary**
- **Attendance overview summary area**
- **Pending leave approvals summary widget**
- **Employee table/list**
- **Employee detail page**
- **Employee edit page**
- **Form validation and dirty-state handling**
- **Success/error feedback after edits**
- **Deep-link handling for invalid employee IDs**

## 5. What NOT to do
- Do not allow Employee users to edit Admin-only fields through an accidental reusable form.
- Do not make every table cell editable unless the API/product requires it.
- Do not put salary editing into the employee profile edit screen when payroll has its own route.
- Do not fetch the full employee universe repeatedly for every widget when cached/shared data can be reused.
- Do not expose passwords, tokens, or authentication secrets on profile pages.
- Do not delete employees unless the backend contract and requirements explicitly add such a capability.

## 6. Definition of done
- [ ] Admin can open an employee from the list and land on a stable detail URL.
- [ ] Admin edit form changes only fields allowed by the Admin product surface.
- [ ] Invalid IDs produce a useful not-found state instead of a blank screen.
- [ ] Dashboard widgets link to the underlying Admin route where appropriate.
- [ ] No duplicate employee-fetching logic exists across pages when a shared hook can be reused.

## 7. Integration contract
- Use the backend contract as the source of truth for field names, status values, permissions, and mutation results.
- Use stable query keys that include the resource identity and any relevant date/filter parameters.
- After mutations, invalidate or update only the affected queries.
- Never mask backend validation errors with a generic success message.
- Keep UI state separate from server state; do not duplicate server records into uncontrolled local state unless there is a clear editing reason.

## 8. Evidence to attach to phase review
- Screenshots or screen recording of each in-scope route.
- Example successful API request/response used during integration.
- Example validation/error state.
- Responsive check at the agreed breakpoints.
- List of known limitations, if any.
