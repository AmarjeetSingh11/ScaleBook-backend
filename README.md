# ScaleBook Backend

Node.js + Express + PostgreSQL backend with a feature-based structure.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Add a `.env` in the project root (gitignored) with:
   - `PORT` — HTTP port (default 3000)
   - `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD` — PostgreSQL
   - `JWT_SECRET`, `JWT_SECRET_REFRESH` — access and refresh token signing

3. Create the database (in psql or pgAdmin):
   ```sql
   CREATE DATABASE scalebook;
   ```

4. Run migrations:
   ```bash
   npm run migrate
   ```

5. (Optional) Run seeds:
   ```bash
   npm run seed
   ```

## Scripts

- `npm start` — Start the server
- `npm run migrate` — Run database migrations
- `npm run seed` — Run seed file

## Structure

- `src/config/database.js` — PostgreSQL pool connection
- `src/modules/auth/` — Auth feature (controller, service, routes)
- `src/app.js` — Express app and routes
- `src/server.js` — Server entry point
- `database/migrations/` — SQL migration files
- `database/schema/` — Schema reference
- `database/seed/` — Seed SQL
- `scripts/` — migrate.js, seed.js

## API

- `GET /health` — Health check
- `GET /api/auth/users` — List users (after migration)
