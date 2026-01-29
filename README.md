# Ecommerce

A simple ecommerce web application built with **Node.js (Express)**, **EJS**, and **MySQL**.

## Requirements
- Node.js (LTS recommended)
- MySQL

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure environment variables:

   Copy `.env.example` to `.env` and fill in your values:
   ```bash
   cp .env.example .env
   ```

   **Important:** never commit `.env` (it's already in `.gitignore`).

3. Create the MySQL database (default name: `store`) and import your schema/data if you have SQL files.

4. Run the app:
   ```bash
   npm start
   ```

   If this project uses nodemon, you can also run:
   ```bash
   npm run dev
   ```

## Environment variables

| Variable | Description |
|---|---|
| `PORT` | Server port (default `3000`) |
| `DB_HOST` | MySQL host (default `localhost`) |
| `DB_USER` | MySQL user (default `root`) |
| `DB_PASSWORD` | MySQL password (default `changeme`) |
| `DB_NAME` | MySQL database name (default `store`) |

## Project structure (high level)
- `app.js` – Express app entry point
- `views/` – EJS templates
- `assets/` – static assets (CSS, images, JS)

## Notes
- `node_modules/` is intentionally not included in the repo.
