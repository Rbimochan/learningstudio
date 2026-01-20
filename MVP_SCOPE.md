# MVP Scope Lock - StudyStudio

## In Scope (MVP Features)

### Authentication
- ✅ Email/password signup and login
- ✅ OAuth (GitHub/Google) login
- ✅ Session management with @supabase/ssr
- ✅ Protected routes with server-side auth guards
- ✅ Logout functionality

### Learning Paths
- ✅ Create, read, update, delete learning paths
- ✅ View all user's learning paths
- ✅ Path details page

### Courses
- ✅ Create courses within learning paths
- ✅ Edit course details
- ✅ Delete courses
- ✅ Course metadata (title, description, level, duration)

### Lessons
- ✅ Add lessons to courses (YouTube, PDF, Link)
- ✅ Reorder lessons (drag-and-drop)
- ✅ Edit lesson details
- ✅ Delete lessons
- ✅ YouTube player integration
- ✅ Progress tracking (todo/doing/done)

### Studio View
- ✅ Watch YouTube lessons
- ✅ Take notes during lessons
- ✅ Save progress position
- ✅ Navigate between lessons

### Notes
- ✅ Create notes per lesson
- ✅ Edit and delete notes
- ✅ View all notes for a lesson

### UI/UX
- ✅ Dark/light theme toggle
- ✅ Responsive design
- ✅ Loading states
- ✅ Error boundaries
- ✅ Toast notifications

## Out of Scope (Future Features)

### Not in MVP
- ❌ User profiles/avatars
- ❌ Social features (sharing, following)
- ❌ Collaboration (shared paths)
- ❌ Advanced analytics/charts
- ❌ Gamification (achievements, badges)
- ❌ AI-generated course suggestions
- ❌ PDF viewer integration
- ❌ Video playback controls (speed, quality)
- ❌ Mobile app
- ❌ Offline support
- ❌ Export/import functionality
- ❌ Email notifications
- ❌ Calendar integration
- ❌ Study reminders
- ❌ Spaced repetition
- ❌ Quiz/assessment features
- ❌ Discussion forums
- ❌ Payment/subscription system

### Deferred to v2
- Search functionality (workspace-wide)
- Tags and categories
- Bookmarks/favorites
- Multi-language support
- Keyboard shortcuts
- Custom themes
- API for third-party integrations

## Technical Constraints

### MVP Stack
- Next.js 15+ (App Router)
- Supabase (Auth + Database)
- TypeScript
- Tailwind CSS
- No external state management (use React Context + Supabase)

### Performance Goals
- Initial page load < 3s
- Navigation < 500ms
- Database queries < 1s

### Browser Support
- Modern browsers only (Chrome, Firefox, Safari, Edge)
- No IE11 support
- Mobile responsive but not optimized for mobile apps

## Launch Checklist

Before MVP launch:
- [ ] All auth flows tested
- [ ] RLS policies verified
- [ ] Error handling in place
- [ ] Loading states implemented
- [ ] Build passes without errors
- [ ] Environment variables documented
- [ ] .env.local excluded from git
- [ ] Basic documentation complete
- [ ] Supabase project configured correctly
- [ ] Vercel deployment tested
