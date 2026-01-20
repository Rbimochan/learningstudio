# StudyStudio - Quick Start Guide

## Prerequisites
- Node.js 18+ installed
- Supabase account and project created
- Git repository initialized

## 1. Environment Setup

Copy `.env.example` to `.env.local` and fill in your values:

```bash
cd studystudio
cp .env.example .env.local
```

Edit `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_YOUTUBE_API_KEY=your-youtube-api-key
```

**Get Supabase credentials:**
1. Go to your Supabase project dashboard
2. Settings > API
3. Copy Project URL and anon/public key

## 2. Supabase Dashboard Configuration

### A. URL Configuration
1. Go to Authentication > URL Configuration
2. Set **Site URL**: `http://localhost:3000`
3. Add **Redirect URLs**: `http://localhost:3000/auth/callback`

### B. Database Setup
1. Go to SQL Editor
2. Open `MIGRATION_GUIDE.md` in this project
3. Copy and run all SQL from these sections in order:
   - Create Tables (Steps 1-5)
   - Create Indexes
   - Enable Row Level Security
   - Create RLS Policies (for all 5 tables)
   - Create Triggers (optional but recommended)

### C. Verify Tables
1. Go to Table Editor
2. Confirm these tables exist:
   - courses
   - lessons
   - progress
   - notes
   - learning_paths
   - path_courses

## 3. Install Dependencies & Run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 4. Test Authentication

### Create First User
1. Navigate to `/signup`
2. Enter email and password
3. Click "Sign Up"
4. If email confirmation is enabled in Supabase:
   - Check your email for confirmation link
   - Click link to confirm
   - Return to app and login at `/login`
5. If email confirmation is disabled:
   - You'll be automatically logged in
   - Redirected to `/paths`

### Verify Session
1. Hard refresh the page (Cmd+Shift+R / Ctrl+Shift+R)
2. You should remain logged in
3. Navigate between pages - session persists
4. Click "Sign Out" in sidebar - redirected to `/login`

## 5. Test Database Operations

### Create a Learning Path
1. From `/paths`, click "Create New Path"
2. Enter title and description
3. Save - should appear in your paths list

### Create a Course
1. Click on a path
2. Click "Add Course"
3. Enter course details
4. Save - should appear in course list

### Create a Lesson
1. Click on a course
2. Click "Add Lesson"
3. Choose YouTube, PDF, or Link
4. Enter lesson details
5. Save - should appear in lessons list

## 6. Verify RLS (Row Level Security)

### Test User Isolation
1. Create some data (paths, courses, lessons) with User A
2. Open incognito/private window
3. Sign up as User B
4. User B should NOT see User A's data
5. Each user should only see their own data

### Debug RLS Issues
If you can't create/read data:
1. Check Supabase logs: Dashboard > Logs
2. Verify RLS policies are created (Table Editor > Policies tab)
3. Check that `user_id` is being set correctly
4. See `AUTH_TEST.md` for debugging guide

## 7. Common Issues

### "Failed to fetch" errors
- Check `.env.local` has correct Supabase URL
- Verify Supabase project is not paused
- Check browser console for CORS errors

### Can't create data
- Verify RLS policies exist
- Check you're logged in (auth token valid)
- Inspect `user_id` in insert statements

### Session not persisting
- Clear browser cookies and try again
- Verify redirect URLs in Supabase match exactly
- Check middleware is running

### Build errors
- Run `npm run build` to check for TypeScript errors
- Verify all dependencies installed: `npm install`

## 8. Development Workflow

```bash
# Start development server
npm run dev

# Check for errors
npm run build

# Run linter
npm run lint
```

## 9. Deployment (Vercel)

1. Push code to GitHub
2. Import to Vercel
3. Add environment variables in Vercel dashboard:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_YOUTUBE_API_KEY`
4. Update Supabase redirect URLs to include production URL
5. Deploy!

## 10. Resources

- [Next.js Docs](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Supabase Auth Guide](https://supabase.com/docs/guides/auth)
- Project Documentation:
  - `SECURITY.md` - Security best practices
  - `AUTH_TEST.md` - Authentication testing
  - `MIGRATION_GUIDE.md` - Database setup
  - `MVP_SCOPE.md` - Feature scope

## Need Help?

Check the documentation files or review:
- `IMPLEMENTATION_COMPLETE.md` - Full implementation checklist
- `VS-list.md` - Original task list
- Supabase Dashboard Logs for backend errors
- Browser console for frontend errors
