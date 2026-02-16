---
description: How to deploy the latest changes to the production server
---

// turbo-all
1. SSH into your server and navigate to the project directory:
   ```bash
   cd /path/to/kalsanweb
   ```

2. Pull the latest changes from GitHub:
   ```bash
   git pull origin main
   ```

3. Rebuild and restart the Docker containers to apply frontend and backend changes:
   ```bash
   docker compose down
   docker compose up -d --build
   ```

4. Run the database synchronization script to ensure the password and backend connection are aligned:
   ```bash
   chmod +x scripts/sync-db.sh
   ./scripts/sync-db.sh
   ```

5. Verify the logs to ensure both services are running correctly:
   ```bash
   docker compose logs -f frontend backend
   ```
