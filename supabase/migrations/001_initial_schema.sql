  -- ============================================================
  -- IntervAI Database Schema
  -- Run this SQL in Supabase SQL Editor (Dashboard > SQL Editor)
  -- ============================================================

  -- 1. Enable required extensions
  CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

  -- ============================================================
  -- 2. ENUM type for interview status
  -- ============================================================
  DO $$ BEGIN
    CREATE TYPE interview_status AS ENUM ('setup', 'in_progress', 'completed');
  EXCEPTION
    WHEN duplicate_object THEN NULL;
  END $$;

  -- ============================================================
  -- 3. Profiles table (extends auth.users)
  -- ============================================================
  CREATE TABLE IF NOT EXISTS profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    full_name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT timezone('utc', now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc', now()) NOT NULL
  );

  -- Auto-create profile on user signup
  CREATE OR REPLACE FUNCTION handle_new_user()
  RETURNS TRIGGER AS $$
  BEGIN
    INSERT INTO public.profiles (id, full_name, avatar_url)
    VALUES (
      NEW.id,
      COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
      COALESCE(NEW.raw_user_meta_data->>'avatar_url', '')
    );
    RETURN NEW;
  END;
  $$ LANGUAGE plpgsql SECURITY DEFINER;

  -- Drop trigger if exists, then create
  DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
  CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION handle_new_user();

  -- ============================================================
  -- 4. Interviews table (session metadata)
  -- ============================================================
  CREATE TABLE IF NOT EXISTS interviews (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    position_applied TEXT NOT NULL,
    job_description TEXT NOT NULL,
    cv_url TEXT,
    status interview_status DEFAULT 'setup' NOT NULL,
    overall_score SMALLINT CHECK (overall_score >= 0 AND overall_score <= 100),
    created_at TIMESTAMPTZ DEFAULT timezone('utc', now()) NOT NULL
  );

  -- Index for fast user-based queries
  CREATE INDEX IF NOT EXISTS idx_interviews_user_id ON interviews(user_id);

  -- ============================================================
  -- 5. Interview Details table (Q&A pairs)
  -- ============================================================
  CREATE TABLE IF NOT EXISTS interview_details (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    interview_id UUID REFERENCES interviews(id) ON DELETE CASCADE NOT NULL,
    question_order SMALLINT NOT NULL DEFAULT 1,
    question_text TEXT NOT NULL,
    user_answer_text TEXT,
    hesitation_count INTEGER DEFAULT 0,
    answer_duration_seconds INTEGER,
    ai_feedback JSONB,
    created_at TIMESTAMPTZ DEFAULT timezone('utc', now()) NOT NULL
  );

  -- Index for fast interview-based queries
  CREATE INDEX IF NOT EXISTS idx_interview_details_interview_id ON interview_details(interview_id);

  -- ============================================================
  -- 6. Row Level Security (RLS)
  -- ============================================================

  -- Enable RLS on all tables
  ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
  ALTER TABLE interviews ENABLE ROW LEVEL SECURITY;
  ALTER TABLE interview_details ENABLE ROW LEVEL SECURITY;

  -- Profiles: users can only read/update their own profile
  CREATE POLICY "Users can view own profile"
    ON profiles FOR SELECT
    USING (auth.uid() = id);

  CREATE POLICY "Users can update own profile"
    ON profiles FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

  -- Interviews: users can CRUD their own interviews
  CREATE POLICY "Users can view own interviews"
    ON interviews FOR SELECT
    USING (auth.uid() = user_id);

  CREATE POLICY "Users can create own interviews"
    ON interviews FOR INSERT
    WITH CHECK (auth.uid() = user_id);

  CREATE POLICY "Users can update own interviews"
    ON interviews FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

  CREATE POLICY "Users can delete own interviews"
    ON interviews FOR DELETE
    USING (auth.uid() = user_id);

  -- Interview Details: accessible if user owns the parent interview
  CREATE POLICY "Users can view own interview details"
    ON interview_details FOR SELECT
    USING (
      EXISTS (
        SELECT 1 FROM interviews
        WHERE interviews.id = interview_details.interview_id
        AND interviews.user_id = auth.uid()
      )
    );

  CREATE POLICY "Users can create own interview details"
    ON interview_details FOR INSERT
    WITH CHECK (
      EXISTS (
        SELECT 1 FROM interviews
        WHERE interviews.id = interview_details.interview_id
        AND interviews.user_id = auth.uid()
      )
    );

  CREATE POLICY "Users can update own interview details"
    ON interview_details FOR UPDATE
    USING (
      EXISTS (
        SELECT 1 FROM interviews
        WHERE interviews.id = interview_details.interview_id
        AND interviews.user_id = auth.uid()
      )
    );

  -- ============================================================
  -- 7. Storage Bucket for CV uploads
  -- ============================================================
  INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
  VALUES (
    'cv-uploads',
    'cv-uploads',
    false,
    5242880, -- 5MB limit
    ARRAY['application/pdf']
  )
  ON CONFLICT (id) DO NOTHING;

  -- Storage RLS: users can upload/read their own CVs
  CREATE POLICY "Users can upload own CVs"
    ON storage.objects FOR INSERT
    WITH CHECK (
      bucket_id = 'cv-uploads'
      AND auth.uid()::text = (storage.foldername(name))[1]
    );

  CREATE POLICY "Users can read own CVs"
    ON storage.objects FOR SELECT
    USING (
      bucket_id = 'cv-uploads'
      AND auth.uid()::text = (storage.foldername(name))[1]
    );

  CREATE POLICY "Users can delete own CVs"
    ON storage.objects FOR DELETE
    USING (
      bucket_id = 'cv-uploads'
      AND auth.uid()::text = (storage.foldername(name))[1]
    );
