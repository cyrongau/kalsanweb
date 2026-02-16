#!/bin/bash

# Database Password Synchronization Script
# This script ensures that the PostgreSQL user password matches the one defined in .env

# 1. Load environment variables from .env
if [ -f .env ]; then
    export $(grep -v '^#' .env | xargs)
else
    echo "Error: .env file not found."
    exit 1
fi

if [ -z "$DB_PASSWORD" ]; then
    echo "Error: DB_PASSWORD not found in .env."
    exit 1
fi

echo "Synchronizing database password for user '$DB_USER'..."

# 2. Update the password inside the container
docker exec -it kalsan-db psql -U postgres -c "ALTER USER $DB_USER WITH PASSWORD '$DB_PASSWORD';"

if [ $? -eq 0 ]; then
    echo "Success: Database password updated."
else
    echo "Error: Failed to update database password."
    exit 1
fi

# 3. Restart the backend to ensure fresh connection
echo "Restarting backend service..."
docker-compose restart backend

echo "Database synchronization complete."
