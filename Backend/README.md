# 🔧 LOSODHAN – Backend

Express.js + TypeScript backend for the LOSODHAN Job Portal.

---

## 📦 Tech Stack

- **Runtime**: Node.js + TypeScript
- **Framework**: Express.js
- **ORM**: Prisma (PostgreSQL via Supabase)
- **Auth**: JWT (HttpOnly Cookies) + Google OAuth
- **Real-time**: Socket.io for live events
- **Payments**: Razorpay
- **Email**: SendGrid
- **Storage**: Supabase Storage

---

## 🗄️ Database Models

| Model | Description |
|---|---|
| `Candidate` | Job seeker with `isPaid`, `isVerified` fields |
| `Recruiter` | Hiring company with `isPaid`, `verificationStatus` |
| `Admin` | Super admin and sub-admins with `permissions[]` |
| `Payment` | Razorpay transaction records (orderId, paymentId, status) |
| `Job` | Job listings with moderation flags |
| `Application` | ATS tracking from APPLIED → HIRED |
| `Interview` | Scheduled interviews linked to applications |
| `CandidateProfile` | Multi-step onboarding data |
| `CompanyProfile` | Recruiter business verification data |
| `File` | Supabase-backed file references (resumes, GST docs) |
| `OtpCode` | Time-limited OTP codes |

---

## 🌐 Comprehensive API Routes

### 🧑 Candidate Routes (`/api/candidate`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/signup` | Register a new candidate | ❌ |
| `POST` | `/login` | Candidate login | ❌ |
| `POST` | `/verify-otp` | Verify email OTP | ❌ |
| `GET` | `/profile` | Get candidate profile | ✅ |
| `POST` | `/complete-profile` | Update/complete profile onboarding | ✅ |

### 🏢 Recruiter Routes (`/api/recruiter`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/signup` | Register a new recruiter | ❌ |
| `POST` | `/login` | Recruiter login | ❌ |
| `GET` | `/company-profile` | Get recruiter profile | ✅ |
| `POST` | `/complete-profile` | Update/complete business onboarding | ✅ |

### 🛡️ Admin & Auth Routes
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/auth/me` | Fetch currently logged-in user profile | ✅ |
| `POST` | `/api/auth/admin/login` | Admin login | ❌ |
| `GET` | `/api/admin/stats` | Dashboard statistics | ✅ (Admin) |
| `GET` | `/api/admin/recruiters`| List recruiters (Approval Module) | ✅ (Sub-Admin) |
| `GET` | `/api/admin/jobs` | List jobs (Moderation Module) | ✅ (Sub-Admin) |
| `POST` | `/api/admin/subadmins` | Create a new Sub-Admin | ✅ (Super Admin) |

### 💼 Job & Application Routes
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/jobs` | List all open jobs (with pagination) | ❌ |
| `POST` | `/api/jobs` | Post a new job | ✅ (Recruiter) |
| `POST` | `/api/applications/apply/:jobId` | Apply to a job | ✅ (Candidate) |
| `GET` | `/api/applications/job/:jobId` | View applicants for a job | ✅ (Recruiter) |

### 💳 Payment & Files
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/payment/create-order` | Create Razorpay order | ✅ |
| `POST` | `/api/payment/verify-payment` | Verify Razorpay signature | ✅ |
| `POST` | `/api/file/upload` | Upload resume/documents to Supabase | ✅ |

---

## ⚙️ Environment Variables

Create a `.env` file from the following template:

```env
# Database
DATABASE_URL=postgresql://...
DIRECT_URL=postgresql://...

# Supabase
SUPABASE_URL=https://...
SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...

# JWT
JWT_SECRET=your_jwt_secret

# Google OAuth
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...

# SendGrid
SENDGRID_API_KEY=...
SENDGRID_FROM_EMAIL=noreply@yourdomain.com

# Razorpay
RAZORPAY_KEY_ID=rzp_test_...
RAZORPAY_KEY_SECRET=...
```

---

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Push schema to DB
npx prisma db push

# Generate Prisma client
npx prisma generate

# Seed super admin
npx ts-node src/scripts/seedAdmin.ts

# Start dev server
npm run dev
```

---

## 💳 Razorpay Payment Flow

1. Frontend calls `POST /api/payment/create-order` (protected)
2. Backend creates a Razorpay order and saves it to `Payment` table with `PENDING`
3. Frontend opens Razorpay Checkout
4. On success, frontend calls `POST /api/payment/verify-payment` with signature
5. Backend verifies HMAC signature, updates `Payment` → `COMPLETED`
6. Sets `isPaid = true` and `isVerified = true` on Candidate/Recruiter
