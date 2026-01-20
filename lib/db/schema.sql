-- StudyStudio Database Schema Extensions
-- Add Learning Paths and Path-Courses tables
-- Run this in Supabase SQL Editor

-- Enable UUID extension (if not already enabled)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Learning Paths table
CREATE TABLE learning_paths (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Path-Courses junction table (many-to-many)
CREATE TABLE path_courses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  path_id UUID NOT NULL REFERENCES learning_paths(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(path_id, course_id),
  UNIQUE(path_id, order_index)
);

-- Indexes for performance
CREATE INDEX idx_learning_paths_user_id ON learning_paths(user_id);
CREATE INDEX idx_path_courses_path_id ON path_courses(path_id);
CREATE INDEX idx_path_courses_course_id ON path_courses(course_id);

-- Auto-update timestamp trigger for learning_paths
CREATE TRIGGER update_learning_paths_updated_at 
BEFORE UPDATE ON learning_paths
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE learning_paths ENABLE ROW LEVEL SECURITY;
ALTER TABLE path_courses ENABLE ROW LEVEL SECURITY;

-- RLS Policies for learning_paths
CREATE POLICY "Users can view own paths"
  ON learning_paths FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own paths"
  ON learning_paths FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own paths"
  ON learning_paths FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own paths"
  ON learning_paths FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for path_courses (access through path ownership)
CREATE POLICY "Users can view path_courses of own paths"
  ON path_courses FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM learning_paths
      WHERE learning_paths.id = path_courses.path_id
      AND learning_paths.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create path_courses in own paths"
  ON path_courses FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM learning_paths
      WHERE learning_paths.id = path_courses.path_id
      AND learning_paths.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update path_courses in own paths"
  ON path_courses FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM learning_paths
      WHERE learning_paths.id = path_courses.path_id
      AND learning_paths.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete path_courses in own paths"
  ON path_courses FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM learning_paths
      WHERE learning_paths.id = path_courses.path_id
      AND learning_paths.user_id = auth.uid()
    )
  );
