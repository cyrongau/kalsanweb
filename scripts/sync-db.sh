#!/bin/bash

# Database Password Synchronization Script
# This script ensures that the PostgreSQL user password matches the one defined in .env

# 1. Load environment variables from .env file
if [ -f .env ]; then
  echo "Loading environment variables from .env..."
  export $(grep -v '^#' .env | xargs)
fi

# 2. Set default DB_PASSWORD if not found
DB_PASSWORD=${DB_PASSWORD:-postgres}
echo "Using password: $DB_PASSWORD for synchronization."

echo "Synchronizing database password for user 'postgres'..."

# Execute password reset in the container as the postgres user to bypass initial password prompt if possible
# We use -i instead of -it for better compatibility with non-interactive shells
if docker exec -i -u postgres kalsan-db psql -c "ALTER USER postgres WITH PASSWORD '$DB_PASSWORD';" ; then
  echo "SUCCESS: Database password synchronized."
else
  echo "ERROR: Failed to synchronize database password."
  echo "Try running this command manually: docker exec -it kalsan-db psql -U postgres"
  exit 1
fi

echo "Restarting backend service..."
docker compose restart backend

echo "Database synchronization complete."
