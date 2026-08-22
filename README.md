# Dayflow HRMS 🚀

[![Live Demo](https://img.shields.io/badge/Live%20Demo-odoo--ossbuilders.vercel.app-brightgreen?style=for-the-badge&logo=vercel)](https://odoo-ossbuilders.vercel.app)
[![GitHub Repository](https://img.shields.io/badge/GitHub-Repository-blue?style=for-the-badge&logo=github)](https://github.com/ravitejam2007-code/odoo-ossbuilders.git)

> **Every workday, perfectly aligned.**  
> Dayflow is a modern, role-based Human Resource Management System (HRMS) that streamlines core HR operations — employee onboarding, directory & profile management, attendance tracking, leave requests & approval workflows, and payroll visibility.

---

## 🌐 Live Application

- **Production URL**: [https://odoo-ossbuilders.vercel.app](https://odoo-ossbuilders.vercel.app)
- **Repository**: [https://github.com/ravitejam2007-code/odoo-ossbuilders.git](https://github.com/ravitejam2007-code/odoo-ossbuilders.git)

---

## ✨ Features

### 👤 Employee Portal
- **Interactive Dashboard**: Real-time overview of attendance status, leave balances, upcoming holidays, and team announcements.
- **Attendance Management**: Single-click check-in and check-out with automatic work hour tracking and attendance history.
- **Leave Management**: Apply for leaves (Casual, Sick, Earned), track real-time approval status, and view leave allowance balances.
- **Salary & Payroll**: View monthly salary slips, breakdown of allowances, deductions, and tax calculations.
- **Profile & Settings**: View and manage personal details, contact info, emergency contacts, and job details.

### 🛡️ Admin & HR Management
- **Company Overview**: Global HR metrics, daily workforce attendance percentage, pending approvals, and active headcounts.
- **Employee Directory**: Complete employee management (add, edit, deactivate, assign roles & departments).
- **Attendance Monitoring**: Organization-wide logs, overtime tracking, and absence alerts.
- **Leave Approvals**: Review, approve, or reject employee leave applications with remarks.
- **Payroll Management**: Generate and manage salary structures and payroll batches.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: [Astro 5](https://astro.build/) + [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **State & Data Fetching**: [TanStack Query](https://tanstack.com/query)
- **Icons & UI**: [Lucide React](https://lucide.dev/), [Framer Motion](https://www.framer.com/motion/)
- **Language**: TypeScript

### Backend & Database
- **Runtime / Framework**: Node.js, Express, TypeScript
- **Database**: PostgreSQL hosted on [Supabase](https://supabase.com/)
- **Authentication**: JWT (Access & Refresh Tokens) + bcrypt
- **Email Service**: Brevo & Nodemailer

---

## 📁 Project Structure

```
odoo-ossbuilders/
├─ Backend/                 # Express + TypeScript + Supabase Backend API
│  ├─ src/                  # API routes, controllers, middleware, services
│  ├─ sql/                  # Supabase database schema & migrations
│  └─ package.json
├─ docs/                    # PRD, TRD, Navigation Plan, and Architecture guides
├─ public/                  # Static assets and media
├─ src/
│  ├─ admin/               # Admin views, components, and hooks
│  ├─ employee/            # Employee views, components, and API client
│  ├─ layouts/             # Astro base layouts
│  ├─ pages/               # Astro file-based routing
│  ├─ shared/              # Shared types, UI components, and mock data
│  └─ styles/              # Global CSS & Tailwind styling
├─ astro.config.mjs         # Astro configuration
├─ tailwind.config.mjs      # Tailwind CSS theme & configuration
└─ package.json             # Frontend dependencies & scripts
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v20.x or higher
- **npm** / **pnpm** / **yarn**

### 1. Clone the Repository
```bash
git clone https://github.com/ravitejam2007-code/odoo-ossbuilders.git
cd odoo-ossbuilders
```

### 2. Frontend Setup & Run
```bash
# Install dependencies
npm install

# Start development server
npm run dev
```
The frontend will start at `http://localhost:3000`.

### 3. Backend Setup & Run (Optional / Local API)
```bash
cd Backend

# Install backend dependencies
npm install

# Configure environment variables
cp .env.example .env

# Start backend development server
npm run dev
```

---

## 📜 Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Starts the Astro development server on port 3000 |
| `npm run build` | Builds the production bundle |
| `npm run preview` | Previews the production build locally |

---

## 📖 Documentation

- [`docs/PRD.md`](docs/PRD.md) - Product Requirements Document
- [`docs/TRD.md`](docs/TRD.md) - Technical Requirements & Architecture
- [`docs/Navigation-Plan.md`](docs/Navigation-Plan.md) - Routing & UI Flow
- [`docs/Team-Roles-FrontendBackend.md`](docs/Team-Roles-FrontendBackend.md) - Team Responsibilities

---

## 👥 Contributors

- **Team**: OSS Builders
- **User**: [sanjaydsanjay](https://github.com/sanjaydsanjay) (`sanjaydsanjay042@gmail.com`)

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
