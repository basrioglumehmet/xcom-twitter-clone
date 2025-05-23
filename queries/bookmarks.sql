CREATE TABLE bookmarks (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  user_id uuid NOT NULL,
  post_id bigint NOT NULL,
  UNIQUE (post_id)
);

ALTER TABLE bookmarks
  ADD CONSTRAINT FK_UserId FOREIGN KEY (user_id)
    REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE bookmarks
  ADD CONSTRAINT FK_PostId FOREIGN KEY (post_id)
    REFERENCES posts(id) ON DELETE CASCADE;

ALTER TABLE hashtags ENABLE ROW LEVEL SECURITY;
