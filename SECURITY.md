# Security Guidelines - StudyStudio

## Environment Variables

### Public Keys (Safe for Client)
- `NEXT_PUBLIC_SUPABASE_URL` - Can be exposed in browser
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Can be exposed in browser (has RLS protection)
- `NEXT_PUBLIC_YOUTUBE_API_KEY` - Can be exposed (rate-limited per domain)

### Private Keys (NEVER Expose)
- `SUPABASE_SERVICE_ROLE_KEY` - **CRITICAL: NEVER add to .env.local**
  - Bypasses all RLS policies
  - Only use in secure server environments (Vercel env vars, backend APIs)
  - Never commit to git
  - Never use in client components

## RLS (Row Level Security)

All database tables MUST have RLS enabled with proper policies:

1. **courses** - Users can only access their own courses (`user_id = auth.uid()`)
2. **lessons** - Users can only access lessons for their courses
3. **progress** - Users can only access their own progress (`user_id = auth.uid()`)
4. **notes** - Users can only access their own notes (`user_id = auth.uid()`)
5. **learning_paths** - Users can only access their own paths (`user_id = auth.uid()`)

## Authentication Flow

1. All auth uses `@supabase/ssr` package
2. Server components use `createServerClient` with cookie handlers
3. Client components use `createBrowserClient`
4. Never create duplicate Supabase clients
5. Always use canonical clients from `lib/supabase/`

## Best Practices

- ✅ Use server components for auth guards
- ✅ Use `supabase.auth.getUser()` not `getSession()` for security
- ✅ Always check RLS policies before deploying
- ✅ Test auth flow: login → refresh → logout
- ❌ Never expose service role key
- ❌ Never bypass RLS in production
- ❌ Never trust client-side auth checks alone
