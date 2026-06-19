# Claude Code memory file
# This file helps Claude understand project conventions

## Project Overview
Café Noir is a Persian (RTL) coffee e-commerce platform built with Next.js 16.

## Key Conventions
- Use Bun as the primary package manager
- All UI must be RTL and mobile-responsive
- Use shadcn/ui components from @/components/ui/
- Follow the coffee color palette (no blue/indigo)
- Use Server Components by default, "use client" only when needed
- API routes use Prisma via @/lib/db
- Auth helpers via @/lib/session (requireUser / requireAdmin)
- Hash-based client routing via @/stores/nav-store

## Demo Accounts
- Admin: admin@cafenoir.ir / admin123
- User: user@cafenoir.ir / user123

## Commands
- `bun run dev` — start dev server (port 3000)
- `bun run lint` — ESLint check
- `bun run db:push` — push schema to database
- `bun run db:seed` — seed demo data
