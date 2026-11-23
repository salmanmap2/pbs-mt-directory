# PBS Meter Tester Directory Portal

A production-ready, mobile-first full-stack web application for managing and browsing PBS Meter Tester profiles.

## Stack
- Next.js 14 App Router + TypeScript
- Tailwind CSS (dark theme)
- MongoDB Atlas via Mongoose (serverless connection caching)
- ImgBB API for image uploads
- JWT (HTTP-only cookies) for authentication

## Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment
```bash
cp .env.example .env.local
```
Edit `.env.local` and set your real values:
- `MONGODB_URI`: Your MongoDB Atlas connection string
- `IMGBB_API_KEY`: Your ImgBB API key from https://api.imgbb.com/
- `ADMIN_USERNAME` / `ADMIN_PASSWORD`: Admin login credentials
- `JWT_SECRET`: A long random secret string

### 3. Seed sample data
```bash
npx ts-node --project tsconfig.json scripts/seed.ts
```

### 4. Run development server
```bash
npm run dev
```
Open http://localhost:3000

### 5. Deploy to Vercel
1. Push to GitHub
2. Import to Vercel
3. Set environment variables in Vercel Dashboard (same as `.env.local`)
4. Deploy

## Usage
- **User login:** Enter your registered 11-digit mobile number
- **Admin login:** Go to Admin tab, login with admin credentials
- **Directory:** Browse, search, sort all profiles. Click any row for details.
- **My Profile:** View and edit your own profile (1 direct update/device/day limit)
- **Admin Panel:** Add/edit/delete profiles; approve or reject pending update requests

## Notes
- Local cache + delta sync keeps mobile data usage minimal
- Profile images hosted on ImgBB
- TTL index on DeletedProfileLog auto-purges after 90 days
