# Database Management Guide

This guide outlines the procedures for managing the PostgreSQL database in the Kalsan Web project, focusing on backups, imports, and credential synchronization.

## 1. Database Infrastructure
- **System**: PostgreSQL 15 (Docker)
- **Container Name**: `kalsan-db`
- **Database Name**: `kalsan_db`
- **Default User**: `postgres`

## 2. Common Procedures

### Importing a SQL Dump
To import a SQL dump into the live server:
1. **Transfer the file** to the server's `/backups` directory.
2. **Clear the existing schema** (to avoid "already exists" errors):
   ```bash
   docker exec -i kalsan-db psql -U postgres -d kalsan_db -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"
   ```
3. **Run the import**:
   ```bash
   cat backups/dumpname.sql | docker exec -i kalsan-db psql -U postgres -d kalsan_db
   ```
4. **Synchronize credentials** (see step 3).

### Synchronizing Credentials
If you change the `DB_PASSWORD` in your `.env` file, or if the backend fails to connect after an import, you must update the database's internal role password:

```bash
# Get the password from .env
grep DB_PASSWORD .env

# Update the database
docker exec -it kalsan-db psql -U postgres -c "ALTER USER postgres WITH PASSWORD 'your_new_password';"

# Restart backend
docker-compose restart backend
```

## 3. Automation
We have provided a script `scripts/sync-db.sh` to automate the password synchronization.

**Usage**:
```bash
bash scripts/sync-db.sh
```
This script will read the password from `.env`, apply it to the database, and restart the backend service.

## 4. Disaster Recovery
- Regularly export dumps using:
  ```bash
  docker exec -t kalsan-db pg_dump -U postgres kalsan_db > backups/manual_backup_$(date +%F).sql
  ```
