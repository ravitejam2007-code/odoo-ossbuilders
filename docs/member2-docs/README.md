# Dayflow — Member 2 Implementation Guide

## Role
Member 2 = Frontend: Employee Experience.

Source-of-truth responsibilities:
- Employee dashboard
- Employee profile and profile editing
- Employee attendance
- Employee leave and leave application
- Employee read-only payroll
- Employee notifications
- Shared authentication entry flow
- Shared UI component library with Member 3
- Typed API consumption through the backend contracts

The team split assigns Member 2 every Employee-role route and says Member 2 consumes Member 1's typed API client via TanStack Query hooks. Shared UI components are co-owned with Member 3.

## Delivery principles
1. Build UI against typed contracts/mocks when backend endpoints are not ready.
2. Do not implement backend business rules in the frontend.
3. Do not duplicate shared UI components that should live in `apps/web/src/components/ui/`.
4. Do not access another employee's private data through employee routes.
5. Keep role-aware routing explicit.
6. Prefer reusable components, typed models, loading/error/empty states, and accessible forms.
7. When an API contract changes, coordinate with Member 1 rather than silently compensating in the UI.
8. Coordinate with Member 3 before changing shared UI primitives or the employee dashboard used by "View as employee".
