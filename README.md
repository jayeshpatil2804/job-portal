# Losodhan Job Portal

A modern, full-stack Job Portal featuring secure authentication, role-based access control, and a professional multi-step onboarding process for both Candidates and Recruiters.

## 🚀 Project Overview

This project is divided into two main parts:
- **Frontend**: A premium React application built with Vite, Redux Toolkit, and Tailwind CSS.
- **Backend**: A robust TypeScript & Express server using Prisma ORM and Supabase for storage.

## 📁 Project Structure

```text
.
├── Backend/          # Express Server with TypeScript & Prisma
└── Frontend/         # React Application with Vite & Tailwind
```

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, Redux Toolkit, Framer Motion, Lucide Icons, Tailwind CSS.
- **Backend**: Node.js, Express, TypeScript, Prisma, PostgreSQL (Supabase), SendGrid/Nodemailer.
- **Database**: PostgreSQL (via Supabase).
- **Storage**: Supabase Storage (for Resumes and Business Documents).

## 🚦 Quick Start

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd losodhan-job-portal
```

### 2. Setup Backend
Follow the instructions in the [Backend README](./Backend/README.md).

### 3. Setup Frontend
Follow the instructions in the [Frontend README](./Frontend/README.md).

## ✨ Key Features

- **Dual-Role Auth**: Separate flows for Candidates and Recruiters with secure JWT handling.
- **Applicant Tracking**: Full lifecycle management from application to interview scheduling.
- **Google Sign-In**: Integrated with role-smart synchronization.
- **OTP Verification**: Email-based OTP for secure signup.
- **Onboarding**: Multi-step profile setup for candidates and business verification for recruiters.
- **Premium UI**: Modern React dashboard with specialized sidebars and refined branding.
- **Security**: JWT-based auth with HttpOnly cookies and global 401 interceptors.
