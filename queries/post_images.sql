-- Create the post_images table
CREATE TABLE post_images (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  post_id bigint NOT NULL,
  url varchar(255) NOT NULL
);

-- Add foreign key constraint
ALTER TABLE post_images
ADD CONSTRAINT fk_post_id FOREIGN KEY (post_id)
REFERENCES posts(id) ON DELETE CASCADE;

-- Create index on post_id
CREATE INDEX idx_post_id ON post_images(post_id);

-- Enable row-level security
ALTER TABLE post_images ENABLE ROW LEVEL SECURITY;


-- Insert yetkisi
CREATE POLICY "Allow authenticated inserts" ON post_images
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Select yetkisi
CREATE POLICY "Allow authenticated selects" ON post_images
  FOR SELECT
  TO authenticated
  USING (true);

-- Update yetkisi
CREATE POLICY "Allow authenticated updates" ON post_images
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Delete yetkisi
CREATE POLICY "Allow authenticated deletes" ON post_images
  FOR DELETE
  TO authenticated
  USING (true);