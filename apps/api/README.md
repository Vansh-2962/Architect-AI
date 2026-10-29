# System Designer API

The API provides email/password authentication with Better Auth, Express, and
Prisma 7. The Better Auth session and account records are stored in PostgreSQL.
The Prisma CLI connection URL lives in `prisma.config.ts`; the runtime client
uses the PostgreSQL driver adapter. For Neon, use the pooled URL for
`DATABASE_URL` and set optional `DIRECT_URL` to Neon’s unpooled URL for
migrations.

## Local setup

1. Copy `.env.example` to `.env`. The included PostgreSQL URL is a dummy local
   URL and will not connect until you replace it with a working database URL.
2. Install workspace dependencies from the repository root with `pnpm install`.
3. Apply the checked-in initial migration:

   ```sh
   pnpm --filter api db:deploy
   ```

4. Start the API and web app from the repository root with `pnpm dev`. The API
   generates Prisma Client before starting or building.

Use `pnpm --filter api db:migrate --name <description>` while developing
subsequent schema changes against a reachable development database.

The API listens on port `3000` by default. Better Auth routes are served at
`/api/auth/*`; `/api/health` is a basic health check. Set `GROQ_API_KEY` in
the API environment to enable authenticated design generation at
`POST /api/designs`. Generated node and connection data is saved to the
authenticated user's design records and returned by `GET /api/designs`.
Generation uses LangGraph with Groq's `openai/gpt-oss-120b` model to draft,
validate, and repair architecture output before it is saved.
The authenticated `GET /api/designs/overview` endpoint returns the user's five
most recently created designs and their design/component counts. Simulation
and latency metrics are `0` until those metrics are tracked.
The authenticated `PATCH /api/designs/:id` endpoint saves edited graph
components and connections for the signed-in user's design.
The authenticated `POST /api/designs/blank` endpoint creates a separate empty
design draft without changing the currently selected design.

Before deploying, use a real Neon connection string, set a unique
`BETTER_AUTH_SECRET` (for example, `openssl rand -base64 32`), and configure
`BETTER_AUTH_URL` and `WEB_ORIGIN` to the deployed API and frontend origins.
