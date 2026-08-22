# Dayflow — Supabase Auth Email Service & Brevo SMTP Setup Guide

This guide walks you through configuring **Brevo (formerly Sendinblue) Custom SMTP** directly inside your **Supabase Project** so that Supabase handles all authentication emails (Signup confirmation, password resets, magic links, user invites) using your Brevo server and custom HTML email templates.

---

## 🛠️ Step 1: Obtain Brevo SMTP Credentials

1. Log into your [Brevo Dashboard](https://app.brevo.com/).
2. In the top-right menu, click your account name and go to **SMTP & API** (or **Transactional** $\rightarrow$ **Settings** $\rightarrow$ **Configuration**).
3. Note down the following values:
   - **SMTP Server / Host**: `smtp-relay.brevo.com`
   - **Port**: `587` (or `465`)
   - **Login / Username**: Your Brevo account email address (e.g. `yourname@company.com`)
   - **SMTP Key / Master Password**: Your generated Brevo SMTP Master Key.
4. Make sure your **Sender Email** (e.g. `notifications@yourcompany.com`) is verified under **Senders & IP** in Brevo.

---

## ⚙️ Step 2: Configure Custom SMTP in Supabase Dashboard

1. Open your [Supabase Project Dashboard](https://supabase.com/dashboard).
2. Navigate to **Project Settings** (gear icon at the bottom of the left sidebar) $\rightarrow$ **Authentication** $\rightarrow$ **SMTP Settings** (or **Authentication** $\rightarrow$ **Email Settings** in the main menu).
3. Enable **Enable Custom SMTP**.
4. Fill in the parameters:

| Field | Value | Notes |
|---|---|---|
| **Sender email** | `notifications@yourcompany.com` | Must match a verified Brevo Sender |
| **Sender name** | `Dayflow HRMS` | Display name in employee inboxes |
| **Host** | `smtp-relay.brevo.com` | Brevo SMTP host |
| **Port number** | `587` | Standard TLS port |
| **Minimum interval between emails** | `60` | Recommended default (60 seconds) |
| **SMTP Username** | `<your-brevo-login-email>` | Brevo username |
| **SMTP Password** | `<your-brevo-smtp-key>` | Brevo master password / SMTP key |

5. Click **Save**.

---

## 🎨 Step 3: Configure Custom Email Templates in Supabase

In Supabase Dashboard, go to **Authentication** $\rightarrow$ **Email Templates**. Copy and paste our pre-designed templates from [`Backend/supabase-email-templates/`](file:///C:/Users/javal/Videos/ODOO%20Hackathon/Backend/supabase-email-templates):

### 1. Confirm Signup Template
- **Subject**: `Welcome to Dayflow — Confirm Your Account`
- **Body**: Paste contents of [`Backend/supabase-email-templates/01_confirmation_signup.html`](file:///C:/Users/javal/Videos/ODOO%20Hackathon/Backend/supabase-email-templates/01_confirmation_signup.html)

### 2. Reset Password Template
- **Subject**: `Reset Your Dayflow Password`
- **Body**: Paste contents of [`Backend/supabase-email-templates/02_reset_password.html`](file:///C:/Users/javal/Videos/ODOO%20Hackathon/Backend/supabase-email-templates/02_reset_password.html)

### 3. Magic Link / Login Code Template
- **Subject**: `Your Dayflow One-Time Login Code`
- **Body**: Paste contents of [`Backend/supabase-email-templates/03_magic_link.html`](file:///C:/Users/javal/Videos/ODOO%20Hackathon/Backend/supabase-email-templates/03_magic_link.html)

### 4. Invite User Template
- **Subject**: `You've been invited to Dayflow HRMS`
- **Body**: Paste contents of [`Backend/supabase-email-templates/04_invite_user.html`](file:///C:/Users/javal/Videos/ODOO%20Hackathon/Backend/supabase-email-templates/04_invite_user.html)

---

## 🔄 Step 4: How Auth & Verification Flow Works in Backend

1. **Signup**: When a user registers via `POST /api/v1/auth/signup`, the backend provisions their employee profile, generates their official Login ID (`OIJODO20220001`), and registers them with Supabase Auth.
2. **Email Delivery**: Supabase Auth immediately triggers the confirmation email through Brevo SMTP using your custom HTML template.
3. **Confirmation**: Clicking the link in the email marks `email_verified = true` in Supabase Auth.
4. **Login**: The user can sign in using **either** their Email or their Login ID.
