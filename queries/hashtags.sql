CREATE TABLE hashtags (
  id bigint primary key generated always as identity,
  tag text NOT NULL unique,
  geo_lat double precision NOT NULL,
  geo_long double precision NOT NULL,
  is_blocked boolean DEFAULT FALSE
);

ALTER TABLE hashtags ENABLE ROW LEVEL SECURITY;