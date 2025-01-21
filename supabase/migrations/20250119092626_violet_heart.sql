/*
  # Create user tokens table

  1. New Tables
    - `user_tokens`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `access_token` (text)
      - `refresh_token` (text)
      - `expires_at` (timestamptz)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `user_tokens` table
    - Add policies for users to manage their own tokens
*/

CREATE TABLE IF NOT EXISTS user_tokens (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  access_token text NOT NULL,
  refresh_token text NOT NULL,
  expires_at timestamptz NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

ALTER TABLE user_tokens ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own tokens"
  ON user_tokens
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at
CREATE TRIGGER update_user_tokens_updated_at
  BEFORE UPDATE ON user_tokens
  FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column();