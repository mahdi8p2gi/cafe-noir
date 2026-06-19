# 🤝 Contributing to Café Noir

First off, **thank you** for taking the time to contribute! 🎉

The following is a set of guidelines for contributing to Café Noir. These are mostly guidelines, not rules. Use your best judgment, and feel free to propose changes to this document in a pull request.

---

## 📋 Table of Contents

- [Code of Conduct](#-code-of-conduct)
- [Getting Started](#-getting-started)
- [Development Workflow](#-development-workflow)
- [Coding Standards](#-coding-standards)
- [Commit Convention](#-commit-convention)
- [Pull Request Process](#-pull-request-process)
- [Reporting Bugs](#-reporting-bugs)
- [Suggesting Features](#-suggesting-features)

---

## 🧡 Code of Conduct

This project and everyone participating in it is governed by our [Code of Conduct](./CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code. Please report unacceptable behavior to `conduct@cafenoir.ir`.

---

## 🚀 Getting Started

1. **Fork** the repository on GitHub
2. **Clone** your fork locally:
   ```bash
   git clone https://github.com/your-username/cafe-noir.git
   cd cafe-noir
   ```
3. **Add upstream** remote:
   ```bash
   git remote add upstream https://github.com/your-username/cafe-noir.git
   ```
4. **Install dependencies**:
   ```bash
   bun install
   ```
5. **Set up environment**:
   ```bash
   cp .env.example .env
   bun run db:push
   bun run db:seed
   ```
6. **Start dev server**:
   ```bash
   bun run dev
   ```

---

## 🔄 Development Workflow

1. **Create a branch** from `main`:
   ```bash
   git checkout -b feature/your-feature-name
   # or: fix/bug-description, docs/update-readme, refactor/component-name
   ```
2. **Make your changes**, keeping commits focused and atomic
3. **Test locally**:
   ```bash
   bun run lint    # Must pass
   bun run dev     # Manual testing
   ```
4. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```
5. **Open a Pull Request** against `main`

---

## 🎨 Coding Standards

### TypeScript
- **Strict mode** is enabled — no `any` types unless absolutely necessary
- Use **interfaces** for object shapes, **types** for unions
- Prefer **named exports** over default exports
- Use **`as const`** for literal arrays/objects

### React
- Use **functional components** with hooks
- Mark client components with `"use client"` directive (only when needed)
- Use **Server Components** by default
- Keep components **small and focused** (max ~200 lines)
- Extract reusable logic into **custom hooks**

### Styling
- Use **Tailwind CSS** classes — no custom CSS unless necessary
- Use the **shadcn/ui** components from `@/components/ui/`
- Follow the **coffee color palette** (no indigo/blue)
- All UI must be **responsive** (mobile-first)
- Respect **RTL** layout — use logical properties (`ps-`, `pe-`, `ms-`, `me-`)

### File Naming
- **Components**: `kebab-case.tsx` (e.g., `product-card.tsx`)
- **Utilities**: `kebab-case.ts` (e.g., `format-price.ts`)
- **Types**: `PascalCase` for types/interfaces
- **Constants**: `UPPER_SNAKE_CASE`

### Project Conventions
- API routes in `src/app/api/`
- Views (page components) in `src/components/views/`
- Layout components in `src/components/layout/`
- Shared primitives in `src/components/shared/`
- State stores in `src/stores/`
- Database access via `@/lib/db`
- Auth helpers via `@/lib/session`

---

## 📝 Commit Convention

We follow the **[Conventional Commits](https://www.conventionalcommits.org/)** specification:

```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

### Types
| Type       | Use for                                          |
|------------|--------------------------------------------------|
| `feat`     | A new feature                                    |
| `fix`      | A bug fix                                        |
| `docs`     | Documentation only changes                       |
| `style`    | Changes that do not affect code meaning          |
| `refactor` | Code change that neither fixes a bug nor adds a feature |
| `perf`     | Performance improvement                          |
| `test`     | Adding missing tests or correcting existing tests|
| `build`    | Changes to build system or dependencies          |
| `ci`       | Changes to CI configuration                      |
| `chore`    | Other changes that don't modify src or test files|
| `revert`   | Reverts a previous commit                        |

### Examples
```bash
git commit -m "feat(shop): add price range filter"
git commit -m "fix(cart): resolve quantity update bug on mobile"
git commit -m "docs: update installation instructions"
git commit -m "refactor(auth): extract session helpers"
```

---

## 🔀 Pull Request Process

1. **Update documentation** if your changes affect public APIs or behavior
2. **Update the README** if you add new features or change setup
3. **Ensure lint passes**: `bun run lint`
4. **Write clear PR description** using our template
5. **Link related issues** (e.g., `Closes #123`)
6. **Request review** from maintainers
7. **Address review feedback** with new commits (don't force-push during review)

### PR Checklist
- [ ] My code follows the project's coding standards
- [ ] I have run `bun run lint` and it passes
- [ ] I have tested my changes locally
- [ ] I have updated documentation where necessary
- [ ] My commits follow the Conventional Commits specification
- [ ] I have added tests for new functionality (if applicable)

---

## 🐛 Reporting Bugs

Bugs are tracked as [GitHub issues](https://github.com/your-username/cafe-noir/issues). Use the **Bug Report** template.

### Before Submitting a Bug Report
1. **Search existing issues** to avoid duplicates
2. **Test on the latest `main` branch**
3. **Gather info**: OS, Node/Bun version, browser, steps to reproduce

### How to Write a Good Bug Report
- **Clear title** describing the issue
- **Steps to reproduce** (numbered list)
- **Expected vs. actual behavior**
- **Screenshots** if applicable
- **Console errors** if any
- **Environment details**

---

## 💡 Suggesting Features

Feature requests are welcome! Use the **Feature Request** template on GitHub issues.

### Good Feature Requests
- **Explain the problem** the feature would solve
- **Describe the solution** you'd like
- **Consider alternatives** you've thought about
- **Provide examples** of similar features in other products

---

## 🏗️ Project Structure Changes

If you're proposing a change to the project structure or architecture:
1. **Open an issue first** to discuss the change
2. Get feedback from maintainers
3. Only then start implementation

This avoids wasted effort on changes that might not align with the project's direction.

---

## ❓ Questions?

- 💬 Join our discussions: [GitHub Discussions](https://github.com/your-username/cafe-noir/discussions)
- 📧 Email: `dev@cafenoir.ir`

---

<div align="center">

**Thank you for contributing! 🙏**

</div>
