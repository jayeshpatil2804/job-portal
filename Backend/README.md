# Losodhan Backend

The robust API powering the Losodhan Job Portal.

## 🚀 Key Features

- **Modular Architecture**: Organized by domains (Auth, File, etc.).
- **Role-Smart Google Sync**: Handles Google Sign-In while respecting existing account roles.
- **RBAC Middleware**: Strict role-based access control (`restrictTo`).
- **Prisma & PostgreSQL**: Efficient data management with typesafety.
- **Supabase Storage**: Secure handling of PDF resumes and business documents.
- **Email Service**: OTP delivery via SendGrid/Nodemailer.

## ⚙️ Prerequisites

- Node.js (v18+)
- PostgreSQL Database (Supabase recommended)
- Supabase account for file storage

## 🛠️ Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Create a `.env` file based on the keys below:
```env
PORT=5000
DATABASE_URL=
DIRECT_URL=
JWT_SECRET=
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
FRONTEND_URL=http://localhost:5173
SENDGRID_API_KEY=
SENDER_EMAIL=
```

### 3. Database Migration
```bash
npx prisma generate
npx prisma db push
```

### 4. Run Development Server
```bash
npm run dev
```

## 📡 API Endpoints

- `POST /api/candidate/signup` - Candidate registration
- `POST /api/recruiter/signup` - Recruiter registration
- `POST /api/users/sync-google` - Google account synchronization
- `PUT /api/candidate/complete-profile` - Step-wise onboarding
- `POST /api/file/upload` - Secure file upload
