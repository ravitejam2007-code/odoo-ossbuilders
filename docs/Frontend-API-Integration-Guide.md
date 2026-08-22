# 🌐 Dayflow HRMS — Frontend API Integration Guide & Reference

> **Comprehensive Integration Manual for Frontend Engineers**  
> **Backend Architecture:** Node.js Express + TypeScript + Supabase PostgreSQL + Brevo Custom SMTP  
> **API Version:** `v1`  
> **Base URL (Local):** `http://localhost:3000/api/v1`  
> **Authentication Method:** `Bearer <JWT_ACCESS_TOKEN>` in HTTP `Authorization` Header  

---

## 📑 Table of Contents
1. [Quick Start & Environment Setup](#1-quick-start--environment-setup)
2. [Global Response & Error Standards](#2-global-response--error-standards)
3. [Test Credentials (Pre-Seeded)](#3-test-credentials-pre-seeded)
4. [API Endpoints Reference](#4-api-endpoints-reference)
   - [🔐 Authentication Engine](#-authentication-engine)
   - [👤 Employee Profile (4-Tab Model)](#-employee-profile-4-tab-model)
   - [⏱️ Attendance Management](#️-attendance-management)
   - [🏖️ Leave Management & File Uploads](#️-leave-management--file-uploads)
   - [💰 Payroll & Salary Structures](#-payroll--salary-structures)
   - [👥 Employee Directory (Admin)](#-employee-directory-admin)
   - [🔔 In-App Notifications](#-in-app-notifications)
   - [📊 Reports & Executive Analytics](#-reports--executive-analytics)
5. [Frontend Integration Instructions (React / TanStack Query)](#5-frontend-integration-instructions-react--tanstack-query)
6. [Handling File Uploads (Medical Attachments)](#6-handling-file-uploads-medical-attachments)
7. [Error Codes Dictionary](#7-error-codes-dictionary)

---

## 1. Quick Start & Environment Setup

### 🚀 Running Backend Locally
```bash
# 1. Open a new terminal in the Backend directory
cd Backend

# 2. Install dependencies (if not already installed)
npm install

# 3. Start development server with live-reloading
npm run dev

# Server will launch on http://localhost:4000
# Health check: http://localhost:4000/health
```

### ⚙️ Frontend Environment Variable
In your frontend `.env` or configuration file:
```env
PUBLIC_API_BASE_URL=http://localhost:4000/api/v1
```

---

## 2. Global Response & Error Standards

Every endpoint returns a predictable JSON response structure.

### ✅ Standard Success Envelope
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation completed successfully"
}
```

### ❌ Standard Error Envelope
```json
{
  "error": {
    "code": "INVALID_CREDENTIALS",
    "message": "Invalid Login ID/Email or password",
    "details": []
  }
}
```

---

## 3. Test Credentials (Pre-Seeded)

| Role | Email | Login ID | Password | Access Level |
|---|---|---|---|---|
| **Admin** | `admin@dayflow.internal` | `OIADMI20220001` | `Admin@1234` | Full Admin Privileges (Approvals, Payroll, Directory, Reports) |
| **Employee** | `john.doe@company.com` | `OIJODO20220001` | `Password@1234` | Employee Portal (Attendance, Profile, Leaves, Payslips) |

> 💡 **Dual Login Support:** Users can enter **either** their Email **or** their Login ID (`OIJODO20220001`) into the `loginIdOrEmail` field.

---

## 4. API Endpoints Reference

### 🔐 Authentication Engine

#### 1. User Signup
- **Method:** `POST`
- **Path:** `/auth/signup`
- **Auth Required:** No
- **Description:** Generates unique sequential `login_id` (e.g. `OIJODO20220001`), provisions profile & leave quota (24 paid, 7 sick), and triggers Brevo verification email.

**Request Body:**
```json
{
  "companyName": "Odoo Inc",
  "name": "Alex Morgan",
  "email": "alex.morgan@company.com",
  "phone": "+91 98765 12345",
  "password": "Password@1234",
  "role": "employee"
}
```

**Response (`201 Created`):**
```json
{
  "success": true,
  "data": {
    "userId": "d7b29a1e-841f-4f2b-8a21-99ef1a120011",
    "loginId": "OIALMO20260002",
    "email": "alex.morgan@company.com",
    "name": "Alex Morgan",
    "role": "employee",
    "message": "Account created successfully. Please check your email for the verification link."
  }
}
```

---

#### 2. User Login
- **Method:** `POST`
- **Path:** `/auth/login`
- **Auth Required:** No

**Request Body:**
```json
{
  "loginIdOrEmail": "OIJODO20220001",
  "password": "Password@1234"
}
```

**Response (`200 OK`):**
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "e0000000-0000-0000-0000-000000000002",
      "loginId": "OIJODO20220001",
      "email": "john.doe@company.com",
      "role": "employee",
      "name": "John Doe",
      "avatar": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
      "department": "Engineering",
      "jobTitle": "Associate Engineer",
      "company": "Odoo Inc",
      "workStatus": "present"
    }
  },
  "message": "Login successful"
}
```

---

#### 3. Verify Email
- **Method:** `POST`
- **Path:** `/auth/verify-email`
- **Auth Required:** No

**Request Body:**
```json
{
  "token": "4a7f920bc8213...",
  "loginId": "OIJODO20220001"
}
```

---

#### 4. Refresh Token & Logout
- **`POST /auth/refresh`**: `{ "refreshToken": "..." }` $\rightarrow$ returns `{ "accessToken": "..." }`.
- **`POST /auth/logout`**: Terminates active session.

---

### 👤 Employee Profile (4-Tab Model)

#### 1. Get Current User Profile
- **Method:** `GET`
- **Path:** `/profile/me`
- **Auth Required:** Yes (`Bearer <token>`)

**Response (`200 OK`):**
```json
{
  "success": true,
  "data": {
    "id": "7b0b6c12-32a1-4321-9876-123456789abc",
    "userId": "e0000000-0000-0000-0000-000000000002",
    "loginId": "OIJODO20220001",
    "name": "John Doe",
    "email": "john.doe@company.com",
    "phone": "+91 98765 43210",
    "company": "Odoo Inc",
    "department": "Engineering",
    "jobTitle": "Associate Engineer",
    "manager": "Admin User",
    "avatar": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
    "role": "employee",
    "workStatus": "present",
    "joinedYear": 2022,
    "serialNo": "0001",
    
    // Tab 1: Resume
    "about": "Fullstack software engineer specialized in building scalable React and Node.js enterprise applications.",
    "whatILoveAboutJob": "Collaborating with innovative teams and solving challenging architectural puzzles.",
    "skills": ["React", "TypeScript", "Node.js", "PostgreSQL", "Tailwind CSS"],
    "certifications": ["AWS Certified Solutions Architect", "Meta Certified Frontend Developer"],
    "interests": ["Open Source", "System Design", "Running", "Chess"],
    
    // Tab 2: Private Info
    "dob": "1995-04-14",
    "residingAddress": "742 Evergreen Terrace, Sector 4, Silicon Valley, CA 94025",
    "nationality": "Indian",
    "gender": "Male",
    "maritalStatus": "Single",
    "bankDetails": {
      "accountNumber": "98765432109876",
      "bankName": "HDFC Bank",
      "ifscCode": "HDFC0001234",
      "panNo": "ABCDE1234F",
      "uanNo": "100987654321",
      "empCode": "OIJODO20220001"
    },
    
    // Tab 3: Salary Info
    "salaryInfo": {
      "monthWage": 65000,
      "yearlyWage": 780000,
      "basicSalary": 32500,
      "houseRentAllowance": 16250,
      "standardAllowance": 4000,
      "performanceBonus": 5000,
      "leaveTravelAllowance": 3000,
      "fixedAllowance": 4250,
      "pfContributionEmployee": 3900,
      "pfContributionEmployer": 3900,
      "professionalTax": 200,
      "noOfWorkingDaysPerWeek": 5
    }
  }
}
```

---

#### 2. Update Self Profile
- **Method:** `PATCH`
- **Path:** `/profile/me`
- **Auth Required:** Yes
- **Allowed Fields:** `phone`, `avatar`, `about`, `whatILoveAboutJob`, `skills`, `certifications`, `interests`, `dob`, `residingAddress`, `nationality`, `gender`, `maritalStatus`.

---

### ⏱️ Attendance Management

#### 1. Check-In (Punch In)
- **Method:** `POST`
- **Path:** `/attendance/check-in`
- **Auth Required:** Yes
- **Behavior:** Sets `check_in_time = now()`, `status = present`, updates profile `work_status = present`.

**Response (`200 OK`):**
```json
{
  "success": true,
  "data": {
    "id": "att-12345",
    "userId": "e0000000-0000-0000-0000-000000000002",
    "date": "2026-08-22",
    "dayOfWeek": "Sat",
    "checkIn": "09:00 AM",
    "checkOut": null,
    "workHours": "0h 0m",
    "extraHours": "0h 0m",
    "status": "present"
  },
  "message": "Checked in successfully at 09:00 AM"
}
```

---

#### 2. Check-Out (Punch Out)
- **Method:** `POST`
- **Path:** `/attendance/check-out`
- **Auth Required:** Yes
- **Behavior:** Sets `check_out_time = now()`, computes exact `work_hours` (e.g. `8h 30m`) and `extra_hours` (> 8h, e.g. `0h 30m`), updates profile `work_status = absent`.

---

#### 3. Get My Attendance History & Summary
- **Method:** `GET`
- **Path:** `/attendance/me` (Optional query: `?month=2026-08`)
- **Auth Required:** Yes

**Response (`200 OK`):**
```json
{
  "success": true,
  "data": {
    "records": [
      {
        "id": "att-1",
        "date": "2026-08-21",
        "dayOfWeek": "Fri",
        "checkIn": "08:45 AM",
        "checkOut": "05:15 PM",
        "workHours": "8h 30m",
        "extraHours": "0h 30m",
        "status": "present"
      }
    ],
    "summary": {
      "status": "present",
      "checkInTime": "08:45 AM",
      "countPresent": 18,
      "countHalfDay": 1,
      "countLeave": 2,
      "totalWorkHours": "148h 00m"
    }
  }
}
```

---

### 🏖️ Leave Management & File Uploads

#### 1. Upload Medical Attachment
- **Method:** `POST`
- **Path:** `/leave/upload`
- **Content-Type:** `multipart/form-data`
- **Field Name:** `attachment`
- **Auth Required:** Yes

**Response (`200 OK`):**
```json
{
  "success": true,
  "data": {
    "attachmentName": "medical-doctor-note.pdf",
    "attachmentUrl": "https://hkxfldkkmmyymmalyqqi.supabase.co/storage/v1/object/public/attachments/medical-certificates/leave-1755856400000.pdf"
  }
}
```

---

#### 2. Apply for Leave
- **Method:** `POST`
- **Path:** `/leave`
- **Auth Required:** Yes

**Request Body:**
```json
{
  "leaveType": "Paid Time Off",
  "startDate": "2026-08-25",
  "endDate": "2026-08-27",
  "daysCount": 3,
  "reason": "Family vacation",
  "attachmentName": "travel-itinerary.pdf",
  "attachmentUrl": "https://..."
}
```

---

#### 3. Review Leave Decision (Admin / HR Officer Only)
- **Method:** `PATCH`
- **Path:** `/leave/:id/decision`
- **Auth Required:** Yes (Role: `admin` | `hr_officer`)

**Request Body:**
```json
{
  "status": "approved",
  "adminComment": "Approved. Please ensure handoff is completed."
}
```

> ⚡ **Atomic Sync Feature:** Approving a leave automatically deducts days from `leave_balances`, marks `on_leave` in `attendance` for all workdays in that date range, creates an in-app notification, and sends an email to the employee via Brevo SMTP.

---

### 💰 Payroll & Salary Structures

#### 1. Get My Payroll Breakdown & Payslips
- **Method:** `GET`
- **Path:** `/payroll/me`
- **Auth Required:** Yes

**Response (`200 OK`):**
```json
{
  "success": true,
  "data": {
    "salaryInfo": {
      "monthWage": 65000,
      "yearlyWage": 780000,
      "basicSalary": 32500,
      "houseRentAllowance": 16250,
      "standardAllowance": 4000,
      "performanceBonus": 5000,
      "leaveTravelAllowance": 3000,
      "fixedAllowance": 4250,
      "pfContributionEmployee": 3900,
      "pfContributionEmployer": 3900,
      "professionalTax": 200,
      "noOfWorkingDaysPerWeek": 5
    },
    "bankDetails": {
      "accountNumber": "98765432109876",
      "bankName": "HDFC Bank",
      "ifscCode": "HDFC0001234"
    },
    "payslips": [
      {
        "id": "ps-1",
        "month": "July",
        "year": 2026,
        "grossSalary": 65000,
        "netSalary": 60900,
        "deductions": 4100,
        "status": "paid"
      }
    ]
  }
}
```

---

### 👥 Employee Directory (Admin)

#### 1. List Employees
- **Method:** `GET`
- **Path:** `/employees?search=john&department=Engineering&page=1&limit=20`
- **Auth Required:** Yes (Role: `admin` | `hr_officer`)

#### 2. Update Employee Profile (Admin Full Edit)
- **Method:** `PATCH`
- **Path:** `/employees/:id`
- **Auth Required:** Yes (Role: `admin` | `hr_officer`)

---

### 🔔 In-App Notifications

- **`GET /notifications/me`**: Fetches list of notifications.
- **`PATCH /notifications/:id/read`**: Marks single notification as read.
- **`PATCH /notifications/read-all`**: Marks all notifications as read.

---

### 📊 Reports & Executive Analytics

- **`GET /reports/dashboard`**: Overall counts (`totalEmployees`, `presentToday`, `onLeaveToday`, `pendingLeaveApprovals`).
- **`GET /reports/attendance-summary?month=2026-08`**: Aggregated monthly attendance metrics.
- **`GET /reports/payroll-summary`**: Total salary expenditure, average monthly salary, and department breakdown.

---

## 5. Frontend Integration Instructions (React / TanStack Query)

A ready-to-use typed API client is available at [`src/employee/api/apiClient.ts`](file:///C:/Users/javal/Videos/ODOO%20Hackathon/src/employee/api/apiClient.ts).

### 💡 Example: Using `apiClient` with TanStack Query

```tsx
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../api/apiClient';

// 1. Fetching Attendance
export function useAttendance() {
  return useQuery({
    queryKey: ['attendance-history'],
    queryFn: () => apiClient.attendance.getMyAttendance(),
  });
}

// 2. Checking In (Punch In Mutation)
export function useCheckInMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => apiClient.attendance.checkIn(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendance-history'] });
      queryClient.invalidateQueries({ queryKey: ['current-user'] });
    },
  });
}

// 3. Applying for Leave
export function useApplyLeaveMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (leaveData) => apiClient.leave.apply(leaveData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leave-requests'] });
      queryClient.invalidateQueries({ queryKey: ['leave-balance'] });
    },
  });
}
```

---

## 6. Handling File Uploads (Medical Attachments)

When an employee attaches a medical note or PDF during leave application:

```tsx
async function handleFileUpload(file: File) {
  const formData = new FormData();
  formData.append('attachment', file);

  const token = localStorage.getItem('dayflow_token');
  const res = await fetch('http://localhost:4000/api/v1/leave/upload', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  const { data } = await res.json();
  return {
    attachmentName: data.attachmentName,
    attachmentUrl: data.attachmentUrl,
  };
}
```

---

## 7. Error Codes Dictionary

| Error Code | HTTP Status | Meaning |
|---|---|---|
| `INVALID_CREDENTIALS` | 401 | Email / Login ID or Password is wrong |
| `EMAIL_NOT_VERIFIED` | 403 | Account email has not yet been verified |
| `UNAUTHORIZED` | 401 | Missing, malformed, or expired Bearer token |
| `FORBIDDEN` | 403 | Insufficient role permissions for this endpoint |
| `ALREADY_CHECKED_IN` | 400 | User already checked in today |
| `NOT_CHECKED_IN` | 400 | Cannot check out without an active check-in |
| `INSUFFICIENT_LEAVE_BALANCE` | 400 | Requested leave days exceed remaining balance quota |
| `INVALID_DATE_RANGE` | 400 | End date is earlier than start date |
| `LEAVE_ALREADY_REVIEWED` | 400 | Leave request has already been approved or rejected |
| `NOT_FOUND` | 404 | Requested record ID does not exist |
| `VALIDATION_ERROR` | 422 | Request body failed schema validation |
| `DATABASE_ERROR` | 500 | Internal database exception |
