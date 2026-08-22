# Phase 1 Prompt — Foundation

You are implementing Dayflow as Member 2, the Employee Experience frontend owner.

## Goal
Build the frontend foundation for employee-facing functionality while preserving the existing architecture.

## Required work
1. Inspect the current frontend and reuse its existing architecture.
2. Establish employee routes:
   `/dashboard`, `/profile`, `/profile/edit`, `/attendance`, `/leave`, `/leave/new`, `/payroll`, `/notifications`.
3. Build the employee application shell.
4. Implement route-aware active navigation.
5. Implement authentication/unauthenticated handling.
6. Build reusable Button, Card, Table, and FormField primitives in the shared UI library with Member 3.
7. Establish standard loading, empty, error, disabled, validation, and confirmation states.
8. Create clean typed API/mock seams suitable for TanStack Query integration.
9. Keep employee and admin routing separate.

## Engineering constraints
- Do not change backend code.
- Do not invent API payload shapes.
- Do not duplicate shared UI primitives.
- Do not hard-code business rules that belong to the backend.
- Do not treat client-side route hiding as authorization.
- Preserve existing project conventions.

## Expected implementation quality
- Type-safe
- responsive
- accessible
- reusable
- minimal duplication
- predictable error handling

## Before finishing
Verify direct route access, refresh behavior, logout, mobile navigation, keyboard interaction, and role boundaries.

## Report back
Return:
1. files created/modified
2. routes added
3. shared components added
4. assumptions about API contracts
5. tests/checks performed
6. unresolved integration blockers

## Explicitly forbidden
Do not build admin dashboard, admin employee management, admin attendance, admin leave approval, or admin payroll in this task.
