# Money Manager v2

## Prerequisites
 - Node.js with NPM
 - PostgreSQL
 - PowerShell (Windows users only)

## Installing PNPM
 - Run this command - `npm i -g pnpm`

## Database Setup
 - Create database with name `moneymanager` in pgAdmin or psql
 - Create file `apps/api/.env`
 - Add to that file your db config in this format `DATABASE_URL=postgres://<username>:<password>@<host>:<post>/moneymanager?sslmode=disable`
 - Example: `DATABASE_URL=postgres://postgres:postgres@localhost:5432/moneymanager?sslmode=disable`

## Env setup for Nodemailer & Auth 
 - Add these to your `apps/api/.env` file:
    - `JWT_SECRET`
    - `SMTP_USER`
    - `SMTP_PASS`

## Running the Application
### Paste these commands in the terminal
#### Backend
 - `cd apps/api`
 - `pnpm i`
 - `pnpm db:push`
 - `pnpm db:seed`
 - `pnpm dev`
#### Frontend
 - `cd apps/ui/web`
 - `pnpm i`
 - `pnpm dev`