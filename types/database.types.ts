export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      courses: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string | null
          meta: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          description?: string | null
          meta?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          description?: string | null
          meta?: Json
          created_at?: string
          updated_at?: string
        }
      }
      lessons: {
        Row: {
          id: string
          course_id: string
          type: 'youtube' | 'pdf' | 'link'
          title: string
          source: string
          order_index: number
          meta: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          course_id: string
          type: 'youtube' | 'pdf' | 'link'
          title: string
          source: string
          order_index: number
          meta?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          course_id?: string
          type?: 'youtube' | 'pdf' | 'link'
          title?: string
          source?: string
          order_index?: number
          meta?: Json
          created_at?: string
          updated_at?: string
        }
      }
      progress: {
        Row: {
          id: string
          user_id: string
          lesson_id: string
          status: 'todo' | 'doing' | 'done'
          last_position: number | null
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          lesson_id: string
          status?: 'todo' | 'doing' | 'done'
          last_position?: number | null
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          lesson_id?: string
          status?: 'todo' | 'doing' | 'done'
          last_position?: number | null
          updated_at?: string
        }
      }
      notes: {
        Row: {
          id: string
          user_id: string
          lesson_id: string
          content: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          lesson_id: string
          content: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          lesson_id?: string
          content?: string
          created_at?: string
          updated_at?: string
        }
      }
      learning_paths: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          description?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      path_courses: {
        Row: {
          id: string
          path_id: string
          course_id: string
          order_index: number
          created_at: string
        }
        Insert: {
          id?: string
          path_id: string
          course_id: string
          order_index: number
          created_at?: string
        }
        Update: {
          id?: string
          path_id?: string
          course_id?: string
          order_index?: number
          created_at?: string
        }
      }
      course_progress: {
        Row: {
          id: string
          user_id: string
          course_id: string
          last_lesson_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          course_id: string
          last_lesson_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          course_id?: string
          last_lesson_id?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
