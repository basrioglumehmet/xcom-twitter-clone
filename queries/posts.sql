CREATE TABLE posts (
  id bigint primary key generated always as identity,
  profile_id bigint NOT NULL,
  content text NOT NULL,
  content_type text NOT NULL,
  geo_lat double precision NOT NULL,
  geo_long double precision NOT NULL,
  view_count double precision NOT NULL,
  is_blocked boolean DEFAULT FALSE
);

ALTER TABLE posts
  ADD CONSTRAINT FK_ProfileId FOREIGN KEY (profile_id)
    REFERENCES user_profiles(id) ON DELETE CASCADE;

CREATE INDEX idx_profile_id ON posts(profile_id);

ALTER TABLE posts ENABLE ROW LEVEL SECURITY;


-- Insert yetkisi
CREATE POLICY "Allow authenticated inserts" ON posts
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Select yetkisi
CREATE POLICY "Allow authenticated selects" ON posts
  FOR SELECT
  TO authenticated
  USING (true);

-- Update yetkisi
CREATE POLICY "Allow authenticated updates" ON posts
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Delete yetkisi
CREATE POLICY "Allow authenticated deletes" ON posts
  FOR DELETE
  TO authenticated
  USING (true);