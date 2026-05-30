/*
  # Create user profiles table

  1. New Tables
    - `user_profiles`
      - `id` (uuid, primary key, references auth.users.id)
      - `phone` (text, unique)
      - `display_name` (text)
      - `avatar_url` (text)
      - `location` (text)
      - `bio` (text)
      - `seller_type` (text: 'individual', 'dealer', 'inspector', 'garage')
      - `rating` (numeric, 0-5)
      - `rating_count` (integer)
      - `verified` (boolean)
      - `verified_at` (timestamp)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `user_profiles` table
    - Add policy for users to read their own profile and public profiles
    - Add policy for users to update their own profile
*/

CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  phone text UNIQUE,
  display_name text,
  avatar_url text,
  location text,
  bio text,
  seller_type text DEFAULT 'individual' CHECK (seller_type IN ('individual', 'dealer', 'inspector', 'garage')),
  rating numeric DEFAULT 0,
  rating_count integer DEFAULT 0,
  verified boolean DEFAULT false,
  verified_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_user_profiles_phone ON user_profiles(phone);
CREATE INDEX IF NOT EXISTS idx_user_profiles_verified ON user_profiles(verified);

ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own profile"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can read verified profiles"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (verified = true);

CREATE POLICY "Users can update own profile"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can create own profile"
  ON user_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);
