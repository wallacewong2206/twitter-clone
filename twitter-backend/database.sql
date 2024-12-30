-- Users Table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  bio TEXT,
  profile_picture TEXT
);

-- Follows Table
CREATE TABLE follows (
  id SERIAL PRIMARY KEY,
  follower_id INT REFERENCES users(id),
  followee_id INT REFERENCES users(id),
  UNIQUE (follower_id, followee_id)
);
