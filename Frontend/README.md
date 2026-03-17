# Losodhan Frontend

A premium, high-performance dashboard UI for the Losodhan Job Portal.

## ✨ Highlights

- **Vite Power**: Lightning-fast development and build.
- **Premium UI**: Glassmorphism, smooth Framer Motion animations, and refined company branding.
- **Applicant Dashboard**: Specialized views for recruiters to manage candidates and interviews.
- **State Management**: Robust state handling with Redux Toolkit across auth, jobs, and applications.
- **Protected Routes**: Custom guards for Candidates and Recruiters.
- **Global API Layer**: Axios interceptors for error handling and session management.

## 🛠️ Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in the root:
```env
VITE_BACKEND_URL=http://localhost:5000/api
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_GOOGLE_CLIENT_ID=
```

### 3. Run Development Server
```bash
npm run dev
```

## 📁 Key Directories

- `src/pages/public`: Publicly accessible pages (Home, Login).
- `src/pages/private`: Protected dashboards and profile setup.
- `src/redux/slices`: Redux state logic.
- `src/components`: Reusable premium UI components.

## 🎨 Styling

- **Tailwind CSS**: Utility-first styling with a custom professional color palette.
- **Lucide React**: Clean and consistent iconography.
