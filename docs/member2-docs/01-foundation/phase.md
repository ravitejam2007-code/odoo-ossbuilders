# Phase 1 — Foundation, Routing, Role-Aware Shell, and Shared UI

## Objective
Create the employee-facing frontend foundation so later screens can be implemented consistently. The team plan explicitly places Member 2 and Member 3 together in Week 1 to establish the shared UI library, routing shell, and role-aware layout.

## Your ownership
- Employee navigation
- Employee application shell
- Employee route structure
- Employee role guards at the UI-routing layer
- Shared UI primitives developed with Member 3
- Shared loading/error/empty patterns
- Authentication entry screens used by the employee experience

## Pin-to-pin implementation

### Step 1 — Inspect the existing application before editing
1. Open the frontend application.
2. Identify the app entry point, router, layouts, providers, API client, shared types, CSS system, and existing UI components.
3. Do not create a second router, second styling system, or parallel component library.
4. Write down existing conventions before adding new files.

### Step 2 — Establish the route map
Create the employee route tree around:
- `/dashboard`
- `/profile`
- `/profile/edit`
- `/attendance`
- `/leave`
- `/leave/new`
- `/payroll`
- `/notifications`

Authentication entry screens are shared but Member 2 owns their employee-facing implementation.

### Step 3 — Build the employee shell
Implement:
- persistent header/top bar
- navigation
- page container
- responsive layout
- logout entry
- authenticated user display where supported by the API contract
- active route state
- mobile navigation behavior

The shell must not assume admin permissions.

### Step 4 — Build shared UI primitives with Member 3
Agree on and implement reusable primitives such as:
- Button
- Card
- Table
- FormField

Also standardize:
- focus states
- disabled state
- loading state
- validation message placement
- empty state
- destructive confirmation treatment
- responsive table behavior

### Step 5 — Add route protection
At the frontend level:
- unauthenticated users go to authentication
- authenticated employees can access employee routes
- admin-only routes remain outside Member 2's employee route ownership
- do not rely on hiding navigation items as the security boundary

### Step 6 — Create API/mock seams
For screens whose backend is not ready:
1. Use the typed contract or mock provider.
2. Keep API access inside a predictable query/mutation layer.
3. Do not put fetch calls directly into every component.
4. Make switching from mock data to the real API low-risk.

### Step 7 — Validate foundation
Test:
- direct navigation to employee routes
- refresh on protected routes
- mobile navigation
- logout
- unauthorized route behavior
- loading/error/empty states
- keyboard navigation for shared controls
- consistent UI between Member 2 and Member 3 screens

## Definition of Done
- Employee routes exist and are navigable.
- Role-aware layout is working.
- Shared components are reusable and documented.
- Authentication entry screens have clear loading/error behavior.
- No employee screen contains admin-only controls.
- API/mock boundaries are defined.
- No duplicate shared UI library was introduced.

## What NOT to do
- Do not implement the backend, Prisma schema, or REST endpoints.
- Do not reproduce Member 1's authorization/business rules in TypeScript.
- Do not build admin pages in this phase.
- Do not create one-off button/table/form components for every screen.
- Do not hard-code fake production IDs, salary values, or attendance records.
- Do not treat hidden UI as authorization.
- Do not modify shared API contracts without coordination.

## Handoff to Phase 2
The employee shell and routes must work before building dashboard/profile screens.
