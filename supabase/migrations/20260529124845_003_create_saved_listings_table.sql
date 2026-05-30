/*
  # Create saved listings table

  1. New Tables
    - `saved_listings`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `listing_id` (uuid, foreign key to listings)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `saved_listings` table
    - Add policy for users to read/create/delete their own saved listings
*/

CREATE TABLE IF NOT EXISTS saved_listings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  listing_id uuid NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, listing_id)
);

CREATE INDEX IF NOT EXISTS idx_saved_listings_user_id ON saved_listings(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_listings_listing_id ON saved_listings(listing_id);

ALTER TABLE saved_listings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own saved listings"
  ON saved_listings
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can create saved listings"
  ON saved_listings
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete own saved listings"
  ON saved_listings
  FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());
