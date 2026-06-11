# EduBridge | إيدو بريدج

منصة تعليمية احترافية للطلاب العرب في الجامعات التركية.

A production-ready educational platform built with Next.js 15, TypeScript, Tailwind CSS, Shadcn/UI, PostgreSQL, Prisma, and NextAuth.

## Features

- **3 Roles**: Student, Instructor, Admin with role-based access control
- **Authentication**: Email/Password + Google OAuth
- **Arabic Default**: Full RTL support with AR/EN language switcher
- **Landing Page**: Hero, Stats, Features, Courses, Instructors, Testimonials, Pricing, FAQ, Contact
- **Student Dashboard**: Overview, Courses, Sessions, Academic Journey, Notifications, Settings
- **Instructor Dashboard**: Course management, Materials, Sessions, Quizzes, Announcements
- **Admin Dashboard**: Users, Courses, Enrollments, Payments, Analytics with charts
- **Live Classes**: Google Meet integration with attendance tracking
- **Certificates**: PDF certificate generation on course completion
- **Dark Mode**: Full theme support
- **Railway Ready**: Deploy directly to Railway with PostgreSQL

## Tech Stack

| Technology | Purpose |
|------------|---------|
| Next.js 15 | App Router, Server Actions |
| TypeScript | Type safety |
| Tailwind CSS | Styling |
| Shadcn/UI | UI components |
| PostgreSQL | Database |
| Prisma ORM | Database ORM |
| NextAuth v5 | Authentication |
| Recharts | Analytics charts |

## Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL 16+
- npm

### 1. Clone & Install

```bash
git clone <repository-url>
cd EduBridge
npm install
```

### 2. Environment Setup

```bash
cp .env.example .env
```

Edit `.env` with your values:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/edubridge?schema=public"
AUTH_SECRET="generate-with-openssl-rand-base64-32"
AUTH_URL="http://localhost:3000"
AUTH_GOOGLE_ID="your-google-client-id"
AUTH_GOOGLE_SECRET="your-google-client-secret"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

Generate `AUTH_SECRET`:

```bash
openssl rand -base64 32
```

### 3. Database Setup

```bash
# Run migrations
npm run db:migrate

# Seed demo data
npm run db:seed
```

### 4. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@edubridge.com | password123 |
| Instructor | ahmed@edubridge.com | password123 |
| Student | student@edubridge.com | password123 |

## Docker

```bash
# Start PostgreSQL + App
docker-compose up -d

# Seed database (first time)
docker-compose exec app npm run db:seed
```

## Railway Deployment

1. Create a new project on [Railway](https://railway.app)
2. Add a **PostgreSQL** service
3. Add a **Web Service** from your GitHub repo
4. Set environment variables:
   - `DATABASE_URL` (from PostgreSQL service)
   - `AUTH_SECRET`
   - `AUTH_URL` (your Railway app URL)
   - `AUTH_GOOGLE_ID` / `AUTH_GOOGLE_SECRET` (optional)
   - `NEXT_PUBLIC_APP_URL`
5. Deploy — migrations run automatically via `Procfile`

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── (auth)/            # Login & Register
│   ├── student/           # Student dashboard
│   ├── instructor/        # Instructor dashboard
│   ├── admin/             # Admin dashboard
│   ├── courses/           # Public course pages
│   └── api/               # API routes
├── actions/               # Server Actions
├── components/
│   ├── ui/                # Shadcn UI components
│   ├── layout/            # Dashboard layout
│   ├── landing/           # Landing page sections
│   ├── courses/           # Course components
│   ├── student/           # Student components
│   ├── instructor/        # Instructor components
│   └── admin/             # Admin components
├── hooks/                 # React hooks (i18n)
└── lib/                   # Utilities, auth, db, i18n
prisma/
├── schema.prisma          # Database schema
├── seed.ts                # Seed data
└── migrations/            # Database migrations
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm start` | Start production server |
| `npm run db:migrate` | Run database migrations |
| `npm run db:seed` | Seed demo data |
| `npm run db:studio` | Open Prisma Studio |

## License

MIT
