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

# Phase 6 - Reports, Notifications, View-as-Employee and Final QA

**Owner:** Member 3 - Admin Frontend + API Integration  
**Schedule:** Week 6

## 1. Phase objective
Finish the Admin experience with reports, notifications integration where exposed, read-only View-as-Employee behavior, responsive polish, accessibility, and end-to-end frontend QA against staging.

## 2. Routes in scope
- `/admin/reports`
- `Admin notification entry points if present in the agreed navigation`
- `View-as-employee read-only state using shared employee dashboard components`

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
- **Reports/analytics dashboard for supported reports**
- **Attendance/salary report views only for API-supported metrics**
- **Admin notification entry point/state where applicable**
- **View-as-employee mode reusing Member 2's employee dashboard components**
- **Read-only visual treatment in view-as mode**
- **Responsive QA**
- **Accessibility QA**
- **Cross-route error/empty/loading QA**
- **Staging smoke tests**
- **Final navigation and API contract verification**

## 5. What NOT to do
- Do not build analytics formulas locally when backend reports are authoritative.
- Do not duplicate the employee dashboard to create View-as-Employee.
- Do not make View-as-Employee editable.
- Do not hide read-only status merely by disabling a few buttons; mutation paths must also be structurally unavailable.
- Do not add new features during final QA unless required to fix a release-blocking issue.
- Do not mark the phase complete while critical routes still depend on mock-only data.

## 6. Definition of done
- [ ] Reports render only data the API provides and explain empty datasets clearly.
- [ ] View-as-Employee reuses shared components and cannot mutate employee data.
- [ ] Admin routes are usable at supported breakpoints.
- [ ] Critical accessibility issues are resolved.
- [ ] All Admin flows pass staging smoke tests using real API contracts.
- [ ] No route, API endpoint, or shared component dependency remains undocumented.

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
