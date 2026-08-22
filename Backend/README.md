# Dayflow HRMS — Backend API

Enterprise backend server for Dayflow HRMS built with **Node.js, Express, TypeScript, Supabase PostgreSQL, and Brevo SMTP**.

---

## 🏗️ Architecture & Features

- **Runtime & Framework**: Node.js 20+ with Express & TypeScript
- **Database & Storage**: Supabase (PostgreSQL with RLS & Storage Buckets)
- **Authentication**: JWT Access/Refresh tokens, bcrypt password hashing, Login ID generation (`OIJODO20220001` format) + Email login
- **Email Service**: Brevo (formerly Sendinblue) Custom SMTP for account verification & leave decision notifications
- **Security**: Role-Based Access Control (RBAC), Helmet security headers, CORS origin whitelist, Express Rate Limiting, Zod Request Validation
- **Standardized Error Envelope**: `{ "error": { "code": string, "message": string, "details"?: any } }`

---

## 📁 Directory Structure

```
Backend/
├── sql/
│   ├── 01_schema.sql           # Database tables, enums, constraints, indexes
│   ├── 02_seed.sql             # Demo Admin & Employee seed data
│   └── 03_storage.sql          # Supabase storage buckets & security policies
├── src/
│   ├── config/
│   │   ├── env.ts              # Validated environment configuration
│   │   ├── mailer.ts           # Brevo SMTP Nodemailer transporter & email templates
│   │   └── supabase.ts         # Supabase Admin client
│   ├── constants/
│   │   └── errorCodes.ts       # Standard error codes
│   ├── middleware/
│   │   ├── auth.ts             # requireAuth, requireRole, requireSelfOrAdmin
│   │   ├── errorHandler.ts     # Central error envelope handler
│   │   ├── rateLimiter.ts      # Auth rate limiting
│   │   └── validate.ts         # Zod schema validation
│   ├── modules/
│   │   ├── auth/               # Signup, Login, Email Verification, Refresh
│   │   ├── profile/            # Employee & Admin profile management
│   │   ├── attendance/         # Check-in, Check-out, Attendance logs
│   │   ├── leave/              # Leave application & Leave -> Attendance transaction
│   │   ├── payroll/            # Employee & Admin salary structures
│   │   ├── employees/          # Admin employee directory & details
│   │   ├── notifications/      # Real-time in-app alerts
│   │   └── reports/            # Admin analytics & summaries
│   ├── types/                  # Typed interfaces matching frontend contracts
│   ├── utils/                  # ID generator, response helpers, AppError
│   ├── app.ts                  # Express application setup & route mounting
│   └── index.ts                # Server startup & lifecycle
├── .env.example
├── .env
├── package.json
└── tsconfig.json
```

---

## 🚀 Quickstart & Setup

### 1. Install Dependencies
```bash
cd Backend
npm install
```

### 2. Configure Environment Variables (`.env`)
Fill in your Supabase project keys and Brevo SMTP credentials in `Backend/.env`:

```env
PORT=4000
NODE_ENV=development
FRONTEND_URL=http://localhost:4321,http://localhost:5173,http://localhost:3000

JWT_ACCESS_SECRET=your_jwt_access_secret_key_2026
JWT_REFRESH_SECRET=your_jwt_refresh_secret_key_2026

# Supabase (Project Settings -> API)
SUPABASE_URL=https://<your-project-id>.supabase.co
SUPABASE_ANON_KEY=<your-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>

# Brevo (Sendinblue) SMTP Credentials (Brevo Dashboard -> Transactional -> Configuration)
BREVO_USERNAME=<your-brevo-login-email>
BREVO_SMTP_KEY=<your-brevo-smtp-master-key>
```

### 3. Initialize Database in Supabase
Open your **Supabase Dashboard $\rightarrow$ SQL Editor** and execute the SQL scripts in order:
1. `sql/01_schema.sql` (Creates all tables, constraints, and indexes)
2. `sql/02_seed.sql` (Populates initial test accounts: Admin and John Doe)
3. `sql/03_storage.sql` (Initializes storage buckets)

### 4. Run Dev Server
```bash
npm run dev
```
The server will start at `http://localhost:4000/api/v1/health`.

---

## 📡 API Endpoints Reference

### 🔐 Authentication (`/api/v1/auth`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/v1/auth/signup` | Public | Register new employee / admin with auto-generated Login ID |
| `POST` | `/api/v1/auth/verify-email` | Public | Verify account via Brevo email token |
| `POST` | `/api/v1/auth/login` | Public | Sign in using Email or Login ID |
| `POST` | `/api/v1/auth/refresh` | Public | Rotate JWT access token |
| `POST` | `/api/v1/auth/logout` | Authenticated | Terminate session |

### 👤 Profile (`/api/v1/profile`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/v1/profile/me` | Authenticated | View own profile |
| `PATCH` | `/api/v1/profile/me` | Authenticated | Update self-service profile fields |
| `GET` | `/api/v1/profile/:userId` | Self / Admin | View specific profile |
| `PATCH` | `/api/v1/profile/:userId` | Admin | Full edit of employee profile |

### ⏱️ Attendance (`/api/v1/attendance`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/v1/attendance/check-in` | Authenticated | Punch in for today |
| `POST` | `/api/v1/attendance/check-out` | Authenticated | Punch out and calculate work hours |
| `GET` | `/api/v1/attendance/me` | Authenticated | View own monthly logs & summary |
| `GET` | `/api/v1/attendance` | Admin | View all employee logs |

### 🏖️ Leave Management (`/api/v1/leave`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/v1/leave` | Authenticated | Submit leave application |
| `GET` | `/api/v1/leave/me` | Authenticated | View own leave history & quota balance |
| `GET` | `/api/v1/leave` | Admin | View all pending/reviewed leave requests |
| `PATCH` | `/api/v1/leave/:id/decision` | Admin | Approve/Reject leave with atomic attendance sync & Brevo email |

### 👥 Employees Directory (`/api/v1/employees`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/v1/employees` | Admin | Search, filter, and paginate all employees |
| `GET` | `/api/v1/employees/:id` | Admin | View comprehensive employee details |

### 💰 Payroll (`/api/v1/payroll`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/v1/payroll/me` | Authenticated | View own salary structure & payslips |
| `GET` | `/api/v1/payroll` | Admin | View company-wide payroll overview |
| `PATCH` | `/api/v1/payroll/:userId` | Admin | Update salary structure & notify employee |

### 🔔 Notifications (`/api/v1/notifications`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/v1/notifications/me` | Authenticated | Get in-app notification list |
| `PATCH` | `/api/v1/notifications/:id/read` | Authenticated | Mark notification as read |
| `PATCH` | `/api/v1/notifications/read-all` | Authenticated | Mark all notifications as read |

### 📊 Reports (`/api/v1/reports`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/v1/reports/dashboard` | Admin | Key HR metrics summary |
| `GET` | `/api/v1/reports/attendance-summary` | Admin | Monthly attendance logs aggregate |
