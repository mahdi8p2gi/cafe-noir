# Changelog

All notable changes to **Café Noir** will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Planned
- 🌐 English (LTR) locale support via `next-intl`
- 💳 Online payment integration (Zarinpal)
- 📧 Email verification & password reset emails via SMTP
- 🔍 Full-text search with better relevance
- 📊 Advanced admin analytics with charts
- 🎫 Discount coupon system
- 📦 Order tracking with shipment integration

---

## [1.0.0] — 2024-12-19

### 🎉 Initial Release

The first production-ready version of Café Noir — a premium Persian (RTL) coffee e-commerce platform.

### Added

#### 🛍️ Shopping Experience
- Home page with cinematic hero, featured products, story section, testimonials, CTA
- Shop page with advanced filtering (category, roast level, price range), search, sort, pagination
- Product detail page with image gallery, specs, quantity selector, related products
- Smart cart with animated drawer and persistent storage
- Complete checkout flow with address form and order confirmation
- Wishlist with server sync for logged-in users
- Product reviews & rating system

#### 🔐 Authentication
- User registration with email & password
- Login with credentials provider
- Logout
- Password recovery flow (forgot password)
- Role-based access control (Admin / User)
- JWT sessions via NextAuth.js

#### 👑 Admin Dashboard
- Dashboard with stats (revenue, orders, products, users)
- Recent orders and top products widgets
- Product management (full CRUD with modal editor)
- Order management with status updates
- User management with role assignment

#### 🎨 Design & UX
- Dark / Light mode with system awareness
- Fully responsive (mobile-first)
- Glass-morphism UI with soft shadows
- Framer Motion animations throughout
- Branded preloader with steam animation
- Persian (Vazirmatn) typography, RTL layout
- Custom coffee color palette (OKLCH)
- Sticky footer with newsletter signup

#### ⚙️ Technical
- Next.js 16 with App Router and React Server Components
- TypeScript 5 (strict mode)
- Tailwind CSS v4 with shadcn/ui (New York style)
- Prisma ORM with SQLite database
- 12 seeded products across 5 categories
- Demo admin & user accounts
- AI-generated coffee product images (12 products + hero + about)
- SEO optimized (metadata, OpenGraph, Twitter cards)
- Zustand for client state (cart, wishlist, navigation)
- TanStack Query for server state
- Custom hash-based client routing for SPA experience

### Security
- Passwords hashed with bcryptjs (10 rounds)
- Role-based API protection (`requireUser` / `requireAdmin`)
- Prisma parameterized queries (SQL injection prevention)
- Zod input validation on all forms
- HTTP-only JWT cookies

---

## Version History

| Version | Date       | Description              |
|---------|------------|--------------------------|
| 1.0.0   | 2024-12-19 | Initial public release   |

---

**Legend:**
- 🎉 `Added` — New features
- 🔄 `Changed` — Changes in existing functionality
- ⚠️ `Deprecated` — Soon-to-be removed features
- ❌ `Removed` — Removed features
- 🛡️ `Security` — Vulnerability fixes
- 🐛 `Fixed` — Bug fixes
