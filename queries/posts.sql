CREATE TABLE posts (
  id bigint primary key generated always as identity,
  user_id uuid NOT NULL,
  content text NOT NULL,
  content_type text NOT NULL,
  geo_lat double precision NOT NULL,
  geo_long double precision NOT NULL,
  view_count double precision NOT NULL,
  is_blocked boolean DEFAULT FALSE
);

ALTER TABLE posts
  ADD CONSTRAINT FK_UserId FOREIGN KEY (user_id)
    REFERENCES auth.users(id) ON DELETE CASCADE;

CREATE INDEX idx_user_id ON posts(user_id);

ALTER TABLE posts ENABLE ROW LEVEL SECURITY;