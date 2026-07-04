# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.





# Database Integration (Week 5)

## Database choice: PostgreSQL, hosted on Supabase

We chose PostgreSQL over MongoDB because our review data is structured with
fixed, predictable fields (username, review text, rating, sentiment, theme,
confidence, etc.) and has a clear relationship to the user who submitted it —
a relational model fits this better than a flexible document store.

- **Database**: PostgreSQL (Supabase free tier)
- **ORM**: Prisma
- **Auth**: Supabase Auth (separate managed service — its own `auth.users`
  table, not owned by our Prisma schema)

## Schema

See `backend/prisma/schema.prisma` for the full model, and
`W5_SchemaDiagram.png` for the visual diagram.

**Entities:**
1. **`auth.users`** — managed by Supabase Auth. Handles sign up, login,
   logout, and sessions. We don't touch this table directly; Supabase
   manages it.
2. **`reviews`** — our own table, owned by Prisma. Each review optionally
   links to the user who submitted it via `user_id` (nullable, since guests
   can also submit reviews without logging in).

**Relationship:** one user (`auth.users`) can have many `reviews` — a
one-to-many relationship via `reviews.user_id -> auth.users.id`.

## Set up the database

1. Create a free project at [supabase.com](https://supabase.com).
2. In the Supabase SQL Editor, run:
   ```sql
   CREATE TABLE reviews (
       id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
       username TEXT NOT NULL,
       review_text TEXT NOT NULL,
       rating INT CHECK (rating BETWEEN 1 AND 5),
       sentiment TEXT CHECK (sentiment IN ('Positive', 'Neutral', 'Negative')),
       theme TEXT,
       confidence DECIMAL(5,2),
       positive_points TEXT,
       negative_points TEXT,
       suggested_reply TEXT,
       user_id UUID REFERENCES auth.users(id),
       created_at TIMESTAMPTZ DEFAULT NOW()
   );
   ```
3. Go to **Project Settings -> Database -> Connection string -> URI** and
   copy it.
4. In `backend/.env`, set:
   ```
   DATABASE_URL="postgresql://postgres:YOUR-PASSWORD@db.YOUR-PROJECT-REF.supabase.co:5432/postgres"
   ```
5. In `backend/`, run:
   ```
   npm install
   npx prisma generate
   ```
6. Start the backend: `npm start`. All review endpoints now read/write to
   this real Postgres table through Prisma.

For frontend auth (sign up / login / logout), see `frontend/.env.example`
for the separate Supabase Auth keys (`VITE_SUPABASE_URL`,
`VITE_SUPABASE_ANON_KEY`) — these are independent of `DATABASE_URL` above.
