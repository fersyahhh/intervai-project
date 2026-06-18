/**
 * TypeScript type definitions for Supabase Database schema.
 * Auto-generated types based on the IntervAI database schema defined in PRD.
 * 
 * Tables:
 * - profiles: Extended user profile data (linked to auth.users)
 * - interviews: Interview session metadata (position, job desc, CV)
 * - interview_details: Individual Q&A pairs with AI feedback per interview
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          updated_at?: string;
        };
      };
      interviews: {
        Row: {
          id: string;
          user_id: string;
          position_applied: string;
          job_description: string;
          cv_url: string | null;
          status: 'setup' | 'in_progress' | 'completed';
          overall_score: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          position_applied: string;
          job_description: string;
          cv_url?: string | null;
          status?: 'setup' | 'in_progress' | 'completed';
          overall_score?: number | null;
          created_at?: string;
        };
        Update: {
          position_applied?: string;
          job_description?: string;
          cv_url?: string | null;
          status?: 'setup' | 'in_progress' | 'completed';
          overall_score?: number | null;
        };
      };
      interview_details: {
        Row: {
          id: string;
          interview_id: string;
          question_order: number;
          question_text: string;
          user_answer_text: string | null;
          hesitation_count: number;
          answer_duration_seconds: number | null;
          ai_feedback: AiFeedback | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          interview_id: string;
          question_order: number;
          question_text: string;
          user_answer_text?: string | null;
          hesitation_count?: number;
          answer_duration_seconds?: number | null;
          ai_feedback?: AiFeedback | null;
          created_at?: string;
        };
        Update: {
          question_order?: number;
          question_text?: string;
          user_answer_text?: string | null;
          hesitation_count?: number;
          answer_duration_seconds?: number | null;
          ai_feedback?: AiFeedback | null;
        };
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      interview_status: 'setup' | 'in_progress' | 'completed';
    };
  };
}

/** Structured AI feedback stored in the ai_feedback JSONB column */
export interface AiFeedback {
  score: number;
  feedback: string;
  corrections: string[];
  strengths: string[];
  improvements: string[];
}

/** Convenience type aliases for component usage */
export type Profile = Database['public']['Tables']['profiles']['Row'];
export type Interview = Database['public']['Tables']['interviews']['Row'];
export type InterviewDetail = Database['public']['Tables']['interview_details']['Row'];
export type InterviewInsert = Database['public']['Tables']['interviews']['Insert'];
export type InterviewDetailInsert = Database['public']['Tables']['interview_details']['Insert'];
