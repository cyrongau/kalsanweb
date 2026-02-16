#!/bin/bash

# Database Password Synchronization Script
# This script ensures that the PostgreSQL user password matches the one defined in .env

# 1. Load environment variables from .env file
if [ -f .env ]; then
  echo "Loading environment variables from .env..."
  export $(grep -v '^#' .env | xargs)
fi

# Check if DB_PASSWORD is set
if [ -z "$DB_PASSWORD" ]; then
  echo "ERROR: DB_PASSWORD is not set in .env file."
  exit 1
fi

echo "Synchronizing database password for user 'postgres'..."

# Execute password reset in the container
if docker exec -it kalsan-db psql -U postgres -c "ALTER USER postgres WITH PASSWORD '$DB_PASSWORD';" ; then
  echo "SUCCESS: Database password synchronized."
else
  echo "ERROR: Failed to synchronize database password."
  exit 1
fi

echo "Restarting backend service..."
docker-compose restart backend

echo "Database synchronization complete."
