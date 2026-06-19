# 🛡️ Security Policy

## Supported Versions

We actively support the following versions of Café Noir with security updates:

| Version | Supported          |
|---------|--------------------|
| 1.0.x   | ✅ Active support  |
| < 1.0   | ❌ Not supported   |

## Reporting a Vulnerability

We take security vulnerabilities seriously. **Please do not report security vulnerabilities through public GitHub issues.**

### How to Report

1. **Email**: Send details to `security@cafenoir.ir`
2. **Subject**: `[SECURITY] Brief description`
3. **Include**:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)
   - Your contact information for follow-up

### Response Timeline

| Stage                      | Target Time  |
|----------------------------|--------------|
| Acknowledge receipt        | 24 hours     |
| Initial assessment         | 72 hours     |
| Fix development            | 7-30 days    |
| Public disclosure          | After fix released |

### What to Expect

- We will acknowledge your report within 24 hours
- We will investigate and verify the vulnerability
- We will work on a fix and coordinate disclosure with you
- We will credit you in the security advisory (unless you prefer to remain anonymous)

## Security Measures

Café Noir implements the following security measures:

### Authentication & Authorization
- 🔐 Passwords hashed with **bcryptjs** (10 salt rounds)
- 🍪 **HTTP-only cookies** for JWT tokens (not accessible via JavaScript)
- 🛡️ **Role-based access control** (Admin / User) enforced on all API routes
- 🔄 **CSRF protection** via NextAuth.js built-in tokens

### Data Protection
- 🗃️ **Prisma parameterized queries** prevent SQL injection
- ✅ **Zod input validation** on all form submissions
- 🚫 **Email enumeration prevention** on password reset endpoint
- 📝 **Soft-delete for products** preserves order history integrity

### Infrastructure
- 🐳 **Non-root Docker user** in production container
- 🔒 **Environment variables** for all secrets (never committed)
- 🚦 **Rate limiting ready** (configure via reverse proxy)
- 🩺 **Health check endpoint** for monitoring

### Dependencies
- 📦 **Dependabot** monitors for vulnerable dependencies
- 🔍 **`bun audit`** in CI pipeline
- 📋 **Lockfile** ensures reproducible builds

## Best Practices for Deployment

When deploying Café Noir to production:

1. **Generate a strong `NEXTAUTH_SECRET`**:
   ```bash
   openssl rand -base64 32
   ```

2. **Use PostgreSQL** instead of SQLite for production:
   ```env
   DATABASE_URL="postgresql://user:pass@host:5432/cafe_noir"
   ```

3. **Set up HTTPS** via a reverse proxy (Caddy, Nginx, or Cloudflare)

4. **Configure rate limiting** on auth endpoints

5. **Enable CSP headers** in `next.config.ts`

6. **Regularly backup** your database

7. **Monitor logs** for suspicious activity

## Contact

- 📧 Security email: `security@cafenoir.ir`
- 🐛 Non-security bugs: [GitHub Issues](https://github.com/your-username/cafe-noir/issues)

---

Thank you for helping keep Café Noir secure! 🛡️
