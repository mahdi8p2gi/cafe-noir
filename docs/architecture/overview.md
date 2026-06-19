# 🏗️ Café Noir — Architecture Documentation

This document describes the architecture, design decisions, and technical foundations of Café Noir.

---

## 📐 High-Level Architecture

Café Noir is a **full-stack Next.js 16 application** using the **App Router** with a hybrid rendering strategy (Server Components by default, Client Components where interactivity is needed).

```
┌─────────────────────────────────────────────────────────────────┐
│                         Browser (Client)                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐  │
│  │ React 19 UI  │  │ Zustand      │  │ TanStack Query       │  │
│  │ (Client/     │  │ Stores       │  │ (Server state cache) │  │
│  │  Server)     │  │ (cart, wish, │  │                      │  │
│  │              │  │  nav)        │  │                      │  │
│  └──────┬───────┘  └──────┬───────┘  └──────────┬───────────┘  │
│         │                 │                     │              │
│         │ localStorage    │                     │ fetch()      │
│         │ (persist)       │                     │              │
└─────────┼─────────────────┼─────────────────────┼──────────────┘
          │                 │                     │
          ▼                 ▼                     ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Next.js 16 Server                           │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────┐  │
│  │ App Router       │  │ API Routes       │  │ NextAuth.js  │  │
│  │ (RSC + Client)   │  │ (REST endpoints) │  │ (JWT auth)   │  │
│  │ /?page=X         │  │ /api/*           │  │ /api/auth/*  │  │
│  └──────────────────┘  └────────┬─────────┘  └──────┬───────┘  │
│                                 │                   │          │
│                                 │ Prisma Client     │          │
│                                 ▼                   │          │
│  ┌──────────────────────────────────────────────────┘          │
│  │                    Prisma ORM                                │
│  │              (type-safe DB access)                           │
│  └────────────────────────┬─────────────────────────────────┘  │
└───────────────────────────┼─────────────────────────────────────┘
                            │
                            ▼
                   ┌─────────────────┐
                   │   SQLite DB     │
                   │  (file-based)   │
                   │                 │
                   │ • Users         │
                   │ • Categories    │
                   │ • Products      │
                   │ • Orders        │
                   │ • Order Items   │
                   │ • Reviews       │
                   │ • Wishlist      │
                   └─────────────────┘
```

---

## 🧭 Routing Strategy

Café Noir uses a **single-route SPA architecture** with hash-based client routing. This was chosen to deliver a smooth, app-like experience with page transitions while keeping the deployment simple.

### How It Works

- The entire app lives at the `/` route (`src/app/page.tsx`)
- Navigation state is managed by `@/stores/nav-store` (Zustand)
- The current "page" is stored in the URL query: `/?page=shop&category=beans`
- On load, `initFromHash()` reads the URL and initializes the store
- The `popstate` event listener keeps the store in sync with browser back/forward

### Supported Pages

| Page       | URL                              | Access     |
|------------|----------------------------------|------------|
| Home       | `/?page=home`                    | Public     |
| Shop       | `/?page=shop`                    | Public     |
| Product    | `/?page=product&slug=arabica-gold` | Public   |
| Cart       | `/?page=cart`                    | Public     |
| Checkout   | `/?page=checkout`                | Auth       |
| Auth       | `/?page=auth`                    | Public     |
| Profile    | `/?page=profile`                 | Auth       |
| Wishlist   | `/?page=wishlist`                | Auth       |
| About      | `/?page=about`                   | Public     |
| Contact    | `/?page=contact`                 | Public     |
| Admin      | `/?page=admin`                   | Admin only |

---

## 🗄️ Data Model

### Entity Relationship Diagram

```
┌──────────┐       ┌──────────┐       ┌──────────┐
│   User   │       │ Category │       │ Product  │
│──────────│       │──────────│       │──────────│
│ id       │       │ id       │◀──────│ categoryId│
│ email    │       │ name     │       │ name     │
│ name     │       │ slug     │       │ slug     │
│ password │       │ desc     │       │ price    │
│ role     │       │ icon     │       │ image    │
└────┬─────┘       └──────────┘       │ stock    │
     │                                  │ rating   │
     │ 1:N                              └────┬─────┘
     │                                       │
     ├──────────────┐                        │ 1:N
     │              │                        │
     ▼              ▼                        ▼
┌──────────┐  ┌──────────┐            ┌──────────┐
│  Order   │  │Wishlist  │            │  Review  │
│──────────│  │──────────│            │──────────│
│ id       │  │ id       │            │ id       │
│ userId   │  │ userId   │            │ userId   │
│ status   │  │ productId│            │ productId│
│ total    │  └──────────┘            │ rating   │
│ items    │                          │ comment  │
└────┬─────┘                          └──────────┘
     │ 1:N
     ▼
┌──────────┐
│OrderItem │
│──────────│
│ id       │
│ orderId  │
│ productId│
│ name     │
│ price    │
│ quantity │
└──────────┘
```

### Key Design Decisions

1. **Soft delete for products** — Products are marked `isActive: false` instead of being deleted, to preserve order history integrity.
2. **Denormalized order items** — Order items store `name` and `price` at the time of purchase, so historical orders remain accurate even if product prices change.
3. **Rating aggregation** — Product `rating` and `reviewCount` are updated whenever a review is added, avoiding expensive aggregate queries on read.
4. **Unique wishlist constraint** — `@@unique([userId, productId])` prevents duplicate wishlist entries at the database level.

---

## 🔐 Authentication Flow

```
┌─────────┐         ┌──────────────┐         ┌─────────────┐
│ Browser │         │  NextAuth    │         │  Database   │
└────┬────┘         │  /api/auth   │         └──────┬──────┘
     │              └──────┬───────┘                │
     │ 1. POST credentials │                        │
     ├────────────────────▶│                        │
     │                     │ 2. Find user           │
     │                     ├───────────────────────▶│
     │                     │ 3. Verify password     │
     │                     │    (bcrypt.compare)    │
     │                     │◀───────────────────────┤
     │                     │ 4. Generate JWT        │
     │                     │    Set HTTP-only cookie│
     │ 5. 200 OK + cookie  │                        │
     │◀────────────────────┤                        │
     │                     │                        │
     │ 6. Subsequent reqs  │                        │
     │    with cookie      │                        │
     ├────────────────────▶│                        │
     │                     │ 7. Verify JWT          │
     │                     │    Return session      │
     │ 8. Response         │                        │
     │◀────────────────────┤                        │
```

### Role-Based Access

- **`getCurrentUser()`** — Returns session user or `null`
- **`requireUser()`** — Throws `UNAUTHORIZED` if not logged in
- **`requireAdmin()`** — Throws `FORBIDDEN` if not admin

These helpers are used in API routes to enforce access control.

---

## 🎨 Design System

### Color Palette (OKLCH)

Café Noir uses a warm coffee-inspired palette defined in CSS variables, supporting both light and dark themes:

| Variable            | Light Mode             | Dark Mode              | Usage                |
|---------------------|------------------------|------------------------|----------------------|
| `--background`      | Warm cream             | Deep espresso          | Page background      |
| `--primary`         | Mocha brown            | Caramel amber          | Buttons, accents     |
| `--coffee-espresso` | Dark brown             | Very dark brown        | Gradients, branding  |
| `--coffee-caramel`  | Caramel                | Caramel                | Highlights, prices   |
| `--coffee-gold`     | Gold                   | Gold                   | Premium badges       |

### Typography

- **Font**: [Vazirmatn](https://github.com/rastikerdar/vazirmatn) — modern Persian font
- **Loaded via** `next/font/google` for optimal performance
- **Variable**: `--font-vazirmatn`

### Component Patterns

1. **Glass-morphism** — `.glass` and `.glass-strong` utility classes use `backdrop-filter: blur()` with semi-transparent backgrounds
2. **Soft shadows** — `.shadow-soft` for layered depth, `.shadow-glow` for premium accents
3. **Gradient text** — `.text-gradient` for brand highlighting
4. **Custom scrollbar** — Styled to match the coffee theme

---

## 🔄 State Management

### Client State (Zustand)

Three persisted stores handle client-side state:

| Store             | Purpose                          | Persistence        |
|-------------------|----------------------------------|--------------------|
| `nav-store`       | Current page + URL params        | URL (query string) |
| `cart-store`      | Shopping cart items              | localStorage       |
| `wishlist-store`  | Product IDs in wishlist          | localStorage       |

### Server State (TanStack Query)

Used for caching API responses with a 60-second stale time. The `useWishlistSync` hook syncs the local wishlist with the server when a user logs in.

---

## 🚀 Performance Optimizations

1. **Server Components by default** — Only components with interactivity are marked `"use client"`
2. **Image optimization** — `next/image` with automatic WebP/AVIF conversion and responsive `sizes`
3. **Code splitting** — Each view is a separate component, automatically code-split
4. **Font subsetting** — Vazirmatn loaded with `subsets: ["arabic", "latin"]`
5. **Persistent state** — Cart and wishlist survive page reloads via localStorage
6. **Preloader** — Branded loading screen hides layout shifts during initial hydration

---

## 🛡️ Security Measures

1. **Password hashing** — bcryptjs with 10 salt rounds
2. **HTTP-only cookies** — JWT tokens stored in cookies inaccessible to JavaScript
3. **CSRF protection** — NextAuth.js built-in CSRF tokens
4. **Input validation** — Zod schemas on all form inputs
5. **SQL injection prevention** — Prisma parameterized queries throughout
6. **Role-based API protection** — `requireAdmin`/`requireUser` middleware on sensitive endpoints
7. **Email enumeration prevention** — Forgot-password endpoint returns same response regardless of email existence

---

## 📦 Deployment

### Development
```bash
bun run dev    # http://localhost:3000
```

### Production (Docker)
```bash
docker compose up -d
```

See [Dockerfile](../../Dockerfile) and [docker-compose.yml](../../docker-compose.yml) for details.

### Production (Manual)
```bash
bun run build
bun run start
```

The build produces a **standalone** output in `.next/standalone/` that can be deployed to any Node.js-compatible host.

---

## 🔮 Future Architecture Considerations

- **PostgreSQL migration** — Schema is PostgreSQL-ready; just change `DATABASE_URL` and `provider` in `schema.prisma`
- **Redis caching** — For session storage and product caching at scale
- **CDN for images** — Move product images to a CDN like Cloudinary or AWS S3
- **Microservices** — Split admin into a separate service if the team grows
- **i18n** — `next-intl` is already installed; adding English requires message files and wrapping the app
- **Online payments** — Zarinpal/Saman gateway integration in `/api/payment/`

---

For implementation details, browse the [source code](../../src/). For setup instructions, see the [main README](../../README.md).
