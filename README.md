# 🧵 LOSODHAN – Job Portal for Textile Industry

A full-stack, production-ready **Job Portal** built for the Textile industry featuring Razorpay payments, Admin Panel, and a powerful onboarding system for Candidates and Recruiters.

---

## 🚀 Project Overview

LOSODHAN connects job seekers with hiring companies in the textile sector. It features:
- OTP-verified sign-up flows for Candidates & Recruiters
- Razorpay-powered account verification fee
- A comprehensive Admin Panel with sub-admin RBAC
- Applicant Tracking System (ATS) with interview scheduling

---

## 📁 Project Structure

```
.
├── Backend/      # Express + TypeScript + Prisma + Razorpay
└── Frontend/     # React 18 + Vite + Redux Toolkit + Tailwind
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, Redux Toolkit, Framer Motion, Tailwind CSS, Recharts |
| Backend | Node.js, Express, TypeScript, Prisma ORM, JWT |
| Database | PostgreSQL (Supabase) |
| Storage | Supabase Storage |
| Payments | Razorpay |
| Email | SendGrid |
| Auth | JWT (HttpOnly Cookies), Google OAuth |

---

## ✨ Key Features

- **Razorpay Payments** – One-time verification fee for Candidates & Recruiters. Payments saved to DB with full transaction history.
- **Dual-Role Auth** – Separate JWT flows for Candidates, Recruiters, and Admins.
- **OTP Verification** – Email-based OTP for signup and admin password recovery.
- **Google Sign-In** – OAuth 2.0 with role-smart account matching.
- **Multi-Step Onboarding** – 4-step profile builder for Candidates; 4-step business verification for Recruiters.
- **Admin Panel** – Dashboard stats, Recruiter Approval, Job Moderation, Candidate Management, Sub-Admin RBAC, Reports export.
- **ATS** – Track applications from APPLIED → HIRED with interview scheduling.
- **Performance Optimized** – Lazy-loaded routes & charts, DB indexing, de-duplicated API calls.

---

## 🚦 Quick Start

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd losodhan-job-portal
```

### 2. Setup Backend
See [Backend/README.md](./Backend/README.md)

### 3. Setup Frontend
See [Frontend/README.md](./Frontend/README.md)

---

## 📜 License
MIT
