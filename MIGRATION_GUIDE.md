# Database Migration Guide

## Setup Order

When setting up StudyStudio database from scratch, follow this order:

### 1. Enable Extensions (if needed)
```sql
-- UUID extension (usually enabled by default)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
```

### 2. Create Tables

Execute in this order due to foreign key dependencies:

#### Step 1: Learning Paths
```sql
CREATE TABLE learning_paths (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    meta JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### Step 2: Courses
```sql
CREATE TABLE courses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    meta JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### Step 3: Lessons
```sql
CREATE TABLE lessons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('youtube', 'pdf', 'link')),
    title TEXT NOT NULL,
    source TEXT NOT NULL,
    order_index INTEGER NOT NULL DEFAULT 0,
    meta JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### Step 4: Progress
```sql
CREATE TABLE progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'todo' CHECK (status IN ('todo', 'doing', 'done')),
    last_position INTEGER DEFAULT 0,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, lesson_id)
);
```

#### Step 5: Notes
```sql
CREATE TABLE notes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    timestamp_seconds INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 3. Create Indexes

```sql
-- Learning Paths indexes
CREATE INDEX idx_learning_paths_user_id ON learning_paths(user_id);
CREATE INDEX idx_learning_paths_created_at ON learning_paths(created_at DESC);

-- Courses indexes
CREATE INDEX idx_courses_user_id ON courses(user_id);
CREATE INDEX idx_courses_created_at ON courses(created_at DESC);

-- Lessons indexes
CREATE INDEX idx_lessons_course_id ON lessons(course_id);
CREATE INDEX idx_lessons_order_index ON lessons(course_id, order_index);

-- Progress indexes
CREATE INDEX idx_progress_user_id ON progress(user_id);
CREATE INDEX idx_progress_lesson_id ON progress(lesson_id);

-- Notes indexes
CREATE INDEX idx_notes_user_id ON notes(user_id);
CREATE INDEX idx_notes_lesson_id ON notes(lesson_id);
CREATE INDEX idx_notes_updated_at ON notes(updated_at DESC);
```

### 4. Enable Row Level Security

```sql
-- Enable RLS on all tables
ALTER TABLE learning_paths ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
```

### 5. Create RLS Policies

#### Learning Paths Policies
```sql
CREATE POLICY "Users can view their own learning paths"
    ON learning_paths FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own learning paths"
    ON learning_paths FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own learning paths"
    ON learning_paths FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own learning paths"
    ON learning_paths FOR DELETE
    USING (auth.uid() = user_id);
```

#### Courses Policies
```sql
CREATE POLICY "Users can view their own courses"
    ON courses FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own courses"
    ON courses FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own courses"
    ON courses FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own courses"
    ON courses FOR DELETE
    USING (auth.uid() = user_id);
```

#### Lessons Policies
```sql
CREATE POLICY "Users can view lessons for their courses"
    ON lessons FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM courses
            WHERE courses.id = lessons.course_id
            AND courses.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert lessons for their courses"
    ON lessons FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM courses
            WHERE courses.id = course_id
            AND courses.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update lessons for their courses"
    ON lessons FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM courses
            WHERE courses.id = lessons.course_id
            AND courses.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete lessons for their courses"
    ON lessons FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM courses
            WHERE courses.id = lessons.course_id
            AND courses.user_id = auth.uid()
        )
    );
```

#### Progress Policies
```sql
CREATE POLICY "Users can view their own progress"
    ON progress FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own progress"
    ON progress FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress"
    ON progress FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own progress"
    ON progress FOR DELETE
    USING (auth.uid() = user_id);
```

#### Notes Policies
```sql
CREATE POLICY "Users can view their own notes"
    ON notes FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own notes"
    ON notes FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own notes"
    ON notes FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own notes"
    ON notes FOR DELETE
    USING (auth.uid() = user_id);
```

### 6. Create Triggers (Optional)

Auto-update `updated_at` timestamp:

```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to all tables
CREATE TRIGGER update_learning_paths_updated_at BEFORE UPDATE ON learning_paths
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_courses_updated_at BEFORE UPDATE ON courses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_lessons_updated_at BEFORE UPDATE ON lessons
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_progress_updated_at BEFORE UPDATE ON progress
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_notes_updated_at BEFORE UPDATE ON notes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

## Testing RLS Policies

Test as an authenticated user in Supabase SQL Editor:

```sql
-- Set the user context (replace with actual user ID)
SELECT auth.uid(); -- Should return NULL if not authenticated

-- Test insert
INSERT INTO courses (user_id, title, description)
VALUES (auth.uid(), 'Test Course', 'Test Description');

-- Test select
SELECT * FROM courses WHERE user_id = auth.uid();
```

## Rollback

To drop all tables (WARNING: Deletes all data):

```sql
DROP TABLE IF EXISTS notes CASCADE;
DROP TABLE IF EXISTS progress CASCADE;
DROP TABLE IF EXISTS lessons CASCADE;
DROP TABLE IF EXISTS courses CASCADE;
DROP TABLE IF EXISTS learning_paths CASCADE;
```
