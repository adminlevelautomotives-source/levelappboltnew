/*
  # Create listings table

  1. New Tables
    - `listings`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `title` (text)
      - `description` (text)
      - `category` (text: 'Car', 'TwoWheeler', 'HeavyVehicle', 'SparePart', 'Service')
      - `type` (text for service type: 'Inspector', 'Garage', 'Insurance')
      - `price` (numeric)
      - `location` (text: city/area)
      - `latitude`, `longitude` (numeric for geolocation)
      - `year` (integer for vehicles)
      - `kilometers` (integer for vehicles)
      - `fuel_type` (text: 'Petrol', 'Diesel', 'EV', etc)
      - `condition` (text: 'Excellent', 'Very Good', 'Good', 'Fair', 'Poor')
      - `color` (text)
      - `owners` (integer)
      - `status` (text: 'Active', 'Pending', 'Sold', 'Expired')
      - `deal_status` (text: 'GREAT_DEAL', 'FAIR', 'OVERPRICED', null)
      - `verified` (boolean)
      - `photos` (text array - image URLs)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `listings` table
    - Add policy for authenticated users to create/read listings
    - Add policy for users to edit/delete own listings
*/

CREATE TABLE IF NOT EXISTS listings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  category text NOT NULL CHECK (category IN ('Car', 'TwoWheeler', 'HeavyVehicle', 'SparePart', 'Service')),
  type text,
  price numeric,
  location text NOT NULL,
  latitude numeric,
  longitude numeric,
  year integer,
  kilometers integer,
  fuel_type text,
  condition text,
  color text,
  owners integer,
  status text NOT NULL DEFAULT 'Active' CHECK (status IN ('Active', 'Pending', 'Sold', 'Expired')),
  deal_status text CHECK (deal_status IN ('GREAT_DEAL', 'FAIR', 'OVERPRICED')),
  verified boolean DEFAULT false,
  photos text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_listings_user_id ON listings(user_id);
CREATE INDEX IF NOT EXISTS idx_listings_category ON listings(category);
CREATE INDEX IF NOT EXISTS idx_listings_status ON listings(status);
CREATE INDEX IF NOT EXISTS idx_listings_location ON listings(location);
CREATE INDEX IF NOT EXISTS idx_listings_created_at ON listings(created_at DESC);

ALTER TABLE listings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read active listings"
  ON listings
  FOR SELECT
  TO authenticated
  USING (status = 'Active' OR user_id = auth.uid());

CREATE POLICY "Users can create listings"
  ON listings
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own listings"
  ON listings
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete own listings"
  ON listings
  FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());
