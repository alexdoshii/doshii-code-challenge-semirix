--------------------------------------------------------------------------------
-- Up
--------------------------------------------------------------------------------

CREATE TABLE users (
  id INTEGER PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  dob INTEGER NOT NULL,
  rewards TEXT NOT NULL
);

CREATE TABLE rewards (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  expires INTEGER NOT NULL
);

INSERT INTO rewards(id, name, description, expires) VALUES (1, '20% off', 'Get 20% off your next purchase', 1700000000000);
INSERT INTO rewards(id, name, description, expires) VALUES (2, 'Free XYZ Item', 'Get a free XYZ item', 1698729641000);
INSERT INTO rewards(id, name, description, expires) VALUES (3, 'New Promotional Pre-order', 'Pre-order new item before anyone else', 1800000000000);

INSERT INTO users(email, name, dob, rewards) VALUES ('johndoe@example.com', 'John Doe', 0, '{"1": false, "2": false}');
INSERT INTO users(email, name, dob, rewards) VALUES ('janedoe@example.com', 'Jane Doe', 0, '{"1": true, "2": false}');
INSERT INTO users(email, name, dob, rewards) VALUES ('foobar@example.com', 'Foo Bar', 0, '{"1": false, "2": true}');

--------------------------------------------------------------------------------
-- Down
--------------------------------------------------------------------------------

DROP TABLE users;
DROP TABLE rewards;
