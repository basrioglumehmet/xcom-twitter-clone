CREATE TABLE user_profiles (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  user_id uuid NOT NULL,
  screen_name varchar(255) NOT NULL,
  profile_image_url varchar(255) default '/default_pp.png',
  tag_name varchar(255) NOT NULL,
  location varchar(255),
  url varchar(255),
  description varchar(255) DEFAULT 'Hi There! I am using X.com',
  is_verified boolean DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT unique_user_tag UNIQUE (user_id, tag_name)
);

ALTER TABLE user_profiles
  ADD CONSTRAINT FK_UserId FOREIGN KEY (user_id)
    REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
