CREATE TABLE post_reposts (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  parent_post_id bigint NOT NULL,
  repost_id bigint NOT NULL,
  CONSTRAINT fk_parent_post FOREIGN KEY (parent_post_id)
    REFERENCES posts(id) ON DELETE CASCADE,
  CONSTRAINT fk_repost_post FOREIGN KEY (repost_id)
    REFERENCES posts(id) ON DELETE CASCADE,
  CONSTRAINT uq_post UNIQUE (repost_id)
);



ALTER TABLE post_reposts ENABLE ROW LEVEL SECURITY;


-- Insert yetkisi
CREATE POLICY "Allow authenticated inserts" ON post_reposts
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Select yetkisi
CREATE POLICY "Allow authenticated selects" ON post_reposts
  FOR SELECT
  TO authenticated
  USING (true);

-- Update yetkisi
CREATE POLICY "Allow authenticated updates" ON post_reposts
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Delete yetkisi
CREATE POLICY "Allow authenticated deletes" ON post_reposts
  FOR DELETE
  TO authenticated
  USING (true);