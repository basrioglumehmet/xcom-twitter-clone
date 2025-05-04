CREATE TABLE subscriptions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id TEXT NOT NULL,
  subscription_id TEXT NOT NULL,
  status TEXT NOT NULL,
  plan TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);


-- Tabloda Row Level Security aktif olmalı
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Insert yetkisi
CREATE POLICY "Allow authenticated inserts" ON subscriptions
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Select yetkisi
CREATE POLICY "Allow authenticated selects" ON subscriptions
  FOR SELECT
  TO authenticated
  USING (true);

-- Update yetkisi
CREATE POLICY "Allow authenticated updates" ON subscriptions
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Delete yetkisi
CREATE POLICY "Allow authenticated deletes" ON subscriptions
  FOR DELETE
  TO authenticated
  USING (true);