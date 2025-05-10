CREATE TABLE post_replies (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  parent_post_id bigint NOT NULL,
  reply_post_id bigint NOT NULL,
  CONSTRAINT fk_parent_post FOREIGN KEY (parent_post_id)
    REFERENCES posts(id) ON DELETE CASCADE,
  CONSTRAINT fk_reply_post FOREIGN KEY (reply_post_id)
    REFERENCES posts(id) ON DELETE CASCADE,
  CONSTRAINT uq_reply UNIQUE (reply_post_id)
);

/*
Açıklamalar:
parent_post_id: Yanıtın ait olduğu orijinal post.

reply_post_id: Yanıt olan post’un ID’si (yani kendi başına da bir posts kaydı).
*/


ALTER TABLE post_replies ENABLE ROW LEVEL SECURITY;


-- Insert yetkisi
CREATE POLICY "Allow authenticated inserts" ON post_replies
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Select yetkisi
CREATE POLICY "Allow authenticated selects" ON post_replies
  FOR SELECT
  TO authenticated
  USING (true);

-- Update yetkisi
CREATE POLICY "Allow authenticated updates" ON post_replies
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Delete yetkisi
CREATE POLICY "Allow authenticated deletes" ON post_replies
  FOR DELETE
  TO authenticated
  USING (true);