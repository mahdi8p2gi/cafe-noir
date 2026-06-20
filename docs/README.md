# 📚 Documentation Index

Welcome to the Café Noir documentation hub.

## 📖 Guides

- [Architecture Overview](./architecture/overview.md) — High-level design, data model, auth flow, and technical decisions
- [README](../README.md) — Project overview, setup, and features
- [Contributing Guide](../CONTRIBUTING.md) — How to contribute to the project
- [Changelog](../CHANGELOG.md) — Version history and release notes

## 🖼️ Assets

- [Screenshots](./screenshots/) — UI screenshots in dark/light/mobile modes

## 🗂️ API Reference

All API endpoints are under `/api/`. Here's the full reference:

### Products
| Method | Endpoint                  | Description                    | Auth     |
|--------|---------------------------|--------------------------------|----------|
| GET    | `/api/products`           | List products with filters     | Public   |
| GET    | `/api/products/[slug]`    | Get product detail + related   | Public   |
| POST   | `/api/products`           | Create product                 | Admin    |
| PUT    | `/api/products/[slug]`    | Update product                 | Admin    |
| DELETE | `/api/products/[slug]`    | Soft-delete product            | Admin    |

### Categories
| Method | Endpoint                | Description           | Auth   |
|--------|-------------------------|-----------------------|--------|
| GET    | `/api/categories`       | List all categories   | Public |

### Auth
| Method | Endpoint                    | Description              | Auth   |
|--------|-----------------------------|--------------------------|--------|
| POST   | `/api/auth/register`        | Register new user        | Public |
| POST   | `/api/auth/forgot`          | Request password reset   | Public |
| GET    | `/api/auth/session`         | Get current session      | Public |
| *      | `/api/auth/[...nextauth]`   | NextAuth.js handler      | Public |

### Orders
| Method | Endpoint             | Description                | Auth   |
|--------|----------------------|----------------------------|--------|
| GET    | `/api/orders`        | List user's orders         | User   |
| POST   | `/api/orders`        | Create new order           | User   |
| GET    | `/api/orders/[id]`   | Get order detail           | User   |

### Reviews
| Method | Endpoint              | Description              | Auth   |
|--------|-----------------------|--------------------------|--------|
| GET    | `/api/reviews`        | List reviews for product | Public |
| POST   | `/api/reviews`        | Create review            | User   |
| DELETE | `/api/reviews/[id]`   | Delete review            | Owner/Admin |

### Wishlist
| Method | Endpoint            | Description              | Auth   |
|--------|---------------------|--------------------------|--------|
| GET    | `/api/wishlist`     | List wishlist items      | User   |
| POST   | `/api/wishlist`     | Toggle wishlist item     | User   |

### Admin
| Method | Endpoint                       | Description              | Auth  |
|--------|--------------------------------|--------------------------|-------|
| GET    | `/api/admin/stats`             | Dashboard statistics     | Admin |
| GET    | `/api/admin/products`          | List all products        | Admin |
| PUT    | `/api/admin/products/[id]`     | Update product           | Admin |
| DELETE | `/api/admin/products/[id]`     | Delete product           | Admin |
| GET    | `/api/admin/orders`            | List all orders          | Admin |
| PUT    | `/api/admin/orders`            | Update order status      | Admin |
| GET    | `/api/admin/users`             | List all users           | Admin |
| PUT    | `/api/admin/users/[id]`        | Update user role         | Admin |
| DELETE | `/api/admin/users/[id]`        | Delete user              | Admin |

### Misc
| Method | Endpoint        | Description              | Auth   |
|--------|-----------------|--------------------------|--------|
| POST   | `/api/contact`  | Submit contact form      | Public |
| GET    | `/api/health`   | Health check (for Docker)| Public |
