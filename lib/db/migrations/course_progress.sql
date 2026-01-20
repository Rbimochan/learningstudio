-- Course Progress Table
-- Tracks the last lesson a user was on for each course
-- This enables "Continue Learning" functionality

CREATE TABLE IF NOT EXISTS course_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  last_lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, course_id)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_course_progress_user_id ON course_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_course_progress_course_id ON course_progress(course_id);
CREATE INDEX IF NOT EXISTS idx_course_progress_updated_at ON course_progress(updated_at DESC);

-- Auto-update timestamp trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_course_progress_updated_at 
BEFORE UPDATE ON course_progress
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE course_progress ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own course progress"
  ON course_progress FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own course progress"
  ON course_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own course progress"
  ON course_progress FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own course progress"
  ON course_progress FOR DELETE
  USING (auth.uid() = user_id);
