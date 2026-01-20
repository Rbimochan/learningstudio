# Authentication Testing Guide

## Pre-requisites
- Supabase project configured with auth enabled
- `.env.local` file with correct environment variables
- Supabase Dashboard configured with Site URL and redirect URLs

## Test Cases

### 1. New User Signup
1. Navigate to `/signup`
2. Enter email and password
3. Submit form
4. **Expected**: 
   - If email confirmation is enabled: Success message asking to check email
   - If email confirmation is disabled: User logged in, redirected to `/paths`
5. Check Supabase Dashboard > Authentication > Users for new user

### 2. User Login
1. Navigate to `/login`
2. Enter valid credentials
3. Submit form
4. **Expected**: Redirected to `/paths` with session established
5. Verify user can see their workspace

### 3. Protected Route Access
1. While logged out, try to access `/paths` directly
2. **Expected**: Redirected to `/login`
3. After login, should redirect to `/paths`

### 4. Session Persistence
1. Log in successfully
2. Hard refresh the page (Cmd+Shift+R / Ctrl+Shift+R)
3. **Expected**: User remains logged in, no redirect to login
4. Navigate to different workspace pages
5. **Expected**: Session persists across navigation

### 5. Logout
1. While logged in, click "Sign Out" button in sidebar
2. **Expected**: 
   - Redirected to `/login`
   - Session cleared
   - Accessing `/paths` redirects back to `/login`

### 6. OAuth Login (if enabled)
1. Navigate to `/login`
2. Click OAuth provider button (GitHub/Google)
3. Complete OAuth flow
4. **Expected**: Redirected to `/auth/callback` then `/paths`

### 7. Token Refresh
1. Log in and wait for token to expire (or manually expire in browser dev tools)
2. Perform an action that requires auth
3. **Expected**: Session refreshes automatically, action succeeds

## Debugging

### Common Issues

**Login redirect loop**
- Check Supabase Dashboard Site URL matches your app URL
- Verify redirect URLs include `/auth/callback`

**Session not persisting**
- Check cookies are enabled in browser
- Verify `@supabase/ssr` cookie handlers are correct
- Check for cookie domain issues

**RLS blocking queries**
- Verify RLS policies allow authenticated users
- Check `user_id` columns match `auth.uid()`
- Test queries in Supabase SQL editor as authenticated user

**Hydration errors**
- Ensure server components don't conditionally render based on client state
- Use loading states properly

## Dev-Only Logging
Add temporary logging to debug auth flow:
```typescript
// In app/(workspace)/layout.tsx
console.log('[Auth Check]', data.user ? 'Authenticated' : 'Not authenticated');
```
**Remove before production!**
