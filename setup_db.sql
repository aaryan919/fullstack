-- Run this file as the postgres superuser to set up the Verdant database.
-- Usage: psql -U postgres -f setup_db.sql

CREATE USER verdant WITH PASSWORD 'changeme';
CREATE DATABASE verdant OWNER verdant;
GRANT ALL PRIVILEGES ON DATABASE verdant TO verdant;

\echo 'Done! verdant user and database created.'
