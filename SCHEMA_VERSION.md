# Database Schema Version

## Current Schema: v1.0

### Tables

1. **courses**
   - Primary key: `id` (uuid)
   - Foreign key: `user_id` → auth.users
   - Indexes: `user_id`, `created_at`
   - RLS: Users can only access their own courses

2. **lessons**
   - Primary key: `id` (uuid)
   - Foreign key: `course_id` → courses
   - Indexes: `course_id`, `order_index`
   - RLS: Users can only access lessons for their courses

3. **progress**
   - Primary key: `id` (uuid)
   - Foreign keys: `user_id` → auth.users, `lesson_id` → lessons
   - Unique constraint: `(user_id, lesson_id)`
   - RLS: Users can only access their own progress

4. **notes**
   - Primary key: `id` (uuid)
   - Foreign keys: `user_id` → auth.users, `lesson_id` → lessons
   - Indexes: `user_id`, `lesson_id`
   - RLS: Users can only access their own notes

5. **learning_paths**
   - Primary key: `id` (uuid)
   - Foreign key: `user_id` → auth.users
   - Indexes: `user_id`, `created_at`
   - RLS: Users can only access their own paths

## Migration Order

When applying schema changes:
1. Always backup production data first
2. Test migrations on staging environment
3. Apply in order: tables → indexes → RLS policies
4. Verify RLS policies don't block legitimate access
5. Update `database.types.ts` after schema changes

## Type Generation

To regenerate TypeScript types from schema:
```bash
npx supabase gen types typescript --project-id jzpqcblrsoorevzgxxkk > types/database.types.ts
```

## Schema Changes Log

### v1.0 (Initial)
- Created base schema with 5 tables
- Enabled RLS on all tables
- Set up basic policies for user isolation
