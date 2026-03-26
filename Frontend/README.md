# 🎨 LOSODHAN – Frontend

React 18 frontend for the LOSODHAN Job Portal.

---

## 📦 Tech Stack

- **Framework**: React 18 + Vite
- **State Management**: Redux Toolkit
- **Routing**: React Router v6
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Charts**: Recharts (lazy-loaded)
- **Payments**: Razorpay Checkout (JS SDK)
- **Real-time**: Socket.io-client
- **Toasts**: react-hot-toast

---

## ✨ Key Features

### 🧑 Candidate Flow
1. Sign up with email OTP verification
2. 4-step profile onboarding (Personal → Education → Experience → Resume)
3. Razorpay payment gate before dashboard access
4. Browse jobs, apply with resume, track application status

### 🏢 Recruiter Flow
1. Sign up with email OTP verification
2. 4-step business onboarding (Company → Address → GST → Documents)
3. Razorpay payment gate before dashboard access
4. Post jobs, manage applicants, schedule interviews

### 🧑‍💼 Admin Panel
- **Dashboard**: Live stats + Charts (lazy-loaded via Suspense)
- **Recruiter Approval**: Approve / Reject / Reset pending recruiters
- **Candidates & Jobs**: View and manage candidates and job listings (Flag / Unflag / Remove).
- **Sub-Admin Management**: Granular RBAC permissions with custom passwords (`Admin@123` default).
- **Real-Time Security**: Sidebar navigation and module access dynamically update in real-time via Socket.io when permissions change.
- **Reports**: Download CSV exports per data category.

---

## 🗂️ Project Structure

```
src/
├── components/
│   ├── common/
│   │   └── PaymentProcess.jsx   # Razorpay checkout wrapper
│   ├── AdminProtectedRoute.jsx
│   └── CandidateProtectedRoute.jsx
├── pages/
│   ├── public/auth/             # Login, Signup, OTP, ForgotPassword
│   └── private/
│       ├── admin/               # All admin panel pages (lazy-loaded)
│       ├── candidate/           # Candidate dashboard & onboarding
│       └── recruiter/           # Recruiter dashboard & onboarding
├── redux/
│   ├── actions/                 # Async thunks
│   └── slices/                  # State slices
└── utils/
    └── api.js                   # Axios instance with base URL & interceptors
```

---

## ⚙️ Environment Variables

Create a `.env` file:

```env
VITE_BACKEND_URL=http://localhost:5000/api
VITE_RAZORPAY_KEY_ID=rzp_test_...
```

---

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build
```

---

## 💳 Razorpay Integration

- The Razorpay Checkout script is loaded globally from `index.html`
- The `PaymentProcess` component handles order creation, the modal, and verification
- On success, users are redirected to their respective dashboards
- Payment status and transaction IDs are stored on the backend

---

## 🚀 Performance Optimizations

- All Admin pages are **lazy-loaded** via `React.lazy` + `Suspense`
- The heavy `recharts` library is **code-split** into a separate `DashboardCharts` chunk
- API calls are **de-duplicated** using `useRef` to prevent double-fetching on mount
- Backend queries use Prisma `select` to minimize payload size
