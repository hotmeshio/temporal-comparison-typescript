-- This script creates the hotmesh database in the tempor postgres db.
-- It drives the point home that hotmesh doesn't need infrastructure
-- to run, it just uses whatver is available--even the same database
-- used by temporal. No app serve required

-- Create the hotmesh database
CREATE DATABASE hotmesh;

-- Grant full privileges to the temporal user on the database
GRANT ALL PRIVILEGES ON DATABASE hotmesh TO temporal;

-- Switch to the hotmesh database
\c hotmesh

-- Grant privileges on all existing tables and sequences in the public schema
GRANT ALL ON ALL TABLES IN SCHEMA public TO temporal;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO temporal;

-- Grant default privileges for all future tables and sequences in the public schema
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO temporal;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO temporal;
