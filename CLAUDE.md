# link-shortener

A T3 stack URL shortener. Paste a long URL, get a short slug. Visiting the slug redirects to the original URL and increments a click counter.

## Stack

- **Next.js 15** (App Router)
- **tRPC** — type-safe API, no REST endpoints
- **Prisma** — ORM with SQLite in dev
- **Tailwind CSS** — utility-first styling
- **TypeScript** throughout

## Commands

```bash
npm run dev           # start dev server on localhost:3000
npx tsc --noEmit      # type check
npx prisma migrate dev --name <name>  # run a new migration
npx prisma studio     # browse/edit the database in the browser
```

## Project structure

```
src/
  app/
    [slug]/route.ts          # redirect handler — looks up slug, increments clicks, redirects
    _components/
      link-shortener.tsx     # client component: form + links list
    page.tsx                 # home page (server component)
  server/
    api/
      routers/link.ts        # tRPC router: link.create, link.getAll
      root.ts                # mounts all routers
    db.ts                    # Prisma client singleton
prisma/
  schema.prisma              # Link model: slug, url, clicks, createdAt
```

## Key decisions

- **Prisma client output is `/generated/prisma`** (not the default `node_modules/.prisma`). After any schema change, `prisma generate` must run — it's included automatically in `migrate dev`.
- **SQLite in dev** — to switch to Postgres for production, change `provider` in `prisma/schema.prisma` and update `DATABASE_URL` in `.env`.
- **Slug generation** is a simple `Math.random().toString(36).substring(2, 8)` — 6-char alphanumeric, no collision check (fine for a side project).
- **Click tracking** happens in the route handler server-side, not via tRPC, so the redirect stays a single server round-trip.

## Environment variables

See `.env.example`. Only one variable is required locally:

```
DATABASE_URL="file:./db.sqlite"
```
