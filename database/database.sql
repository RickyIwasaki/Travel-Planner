
DROP DATABASE IF EXISTS travel_planner;
CREATE DATABASE travel_planner;
\c travel_planner
CREATE SCHEMA schema1;
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE schema1.users(
  id SERIAL PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL UNIQUE,
  hashed_password TEXT NOT NULL UNIQUE,
  authority VARCHAR(40),
  monthly_requests SMALLINT DEFAULT 0
);
CREATE TABLE schema1.travel_plans(
  id SERIAL PRIMARY KEY,
  name VARCHAR(128) NOT NULL
);
CREATE TABLE schema1.locations(
  id SERIAL PRIMARY KEY,
  loaction_id INT NOT NULL
);

CREATE TABLE schema1.user_to_travel_plans(
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES schema1.users(id),
  travel_plan_id INT REFERENCES schema1.travel_plans(id)
);
CREATE TABLE schema1.travel_plans_to_locations(
  id SERIAL PRIMARY KEY,
  travel_plan_id INT REFERENCES schema1.travel_plans(id),
  location_id INT REFERENCES schema1.locations(id)
);
