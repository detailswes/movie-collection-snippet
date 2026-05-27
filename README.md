# My Movies

> A production-ready, full-stack code snippet demonstrating how to build a secure, authenticated CRUD application with Next.js 14, MongoDB, and Cloudinary image storage.

---

## About This Project

**My Movies** is a private movie watchlist: create an account, sign in, and add films with title, year, notes, and a poster. Only you can view or change your entries.

The repo is a runnable full-stack example—**Next.js 14** for the UI and API, **MongoDB** for storage, **Cloudinary** for images—with sign-in, add/edit/delete, and practical security (hashed passwords, secure cookies, and strict ownership of each user’s data).

---

## What This Project Is (For Developers)

Beyond the movie-list demo, this repo is a **reference implementation** for recurring problems when building full-stack Next.js apps:

| Problem | What this project demonstrates |
|---|---|
| Where do I put my API in Next.js? | Pages Router (`pages/api/`) for REST endpoints alongside App Router for UI pages |
| How do I store auth tokens securely? | JWT in an `HttpOnly; SameSite=Strict` server-set cookie - not `localStorage` |
| How do I structure business logic cleanly? | Thin route handlers + dedicated service layer (`authService`, `movieService`) |
| How do I avoid storing large files in MongoDB? | Cloudinary CDN upload - only the short URL is persisted |
| How do I validate data consistently? | Joi on the server, Yup on the client, same rules in both places |
| How do I protect all my routes without repeating myself? | Shared `jwtAuth` middleware wrapping every protected handler |
| How do I handle rendering crashes gracefully? | React `ErrorBoundary` class component wrapping the entire app tree |

This snippet is intentionally scoped - it is complete enough to run in production, but small enough to read and understand in a single sitting.

---

## Features

- **User accounts** - register, sign in, sign out with secure session management
- **Movie CRUD** - create, read, update, and delete your own movies
- **Poster uploads** - drag-and-drop image upload via Cloudinary (5 MB limit enforced client- and server-side)
- **Paginated grid** - responsive movie card grid with skeleton loading states
- **Protected routes** - middleware redirects unauthenticated users to sign-in automatically
- **Ownership enforcement** - users can only see and modify their own movies
- **Error handling** - API errors surface a retry screen; render crashes are caught by ErrorBoundary
- **Rate limiting** - brute-force protection on the login endpoint (10 attempts / 15 min per IP)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router + Pages Router API) |
| Database | MongoDB via Mongoose |
| State / Data Fetching | Redux Toolkit + RTK Query |
| Authentication | JWT in `HttpOnly` cookie |
| Forms | Formik + Yup (client) · Joi (server) |
| Styling | Tailwind CSS |
| Image Storage | react-dropzone → Cloudinary CDN |

---

## Project Structure

```
pages/api/                  ← REST API (Next.js Pages Router)
  database/db.js            ← Mongoose connection (globally cached)
  lib/
    response.js             ← Shared sendSuccess / sendError helpers
    rateLimit.js            ← In-memory IP-based rate limiter
  models/                   ← Mongoose schemas (Movie, User)
  services/
    authService.js          ← loginUser, registerUser (business logic)
    movieService.js         ← CRUD operations (business logic)
  users/
    index.js                ← POST /api/users  (login)
    register.js             ← POST /api/users/register
    logout.js               ← POST /api/users/logout
  movies/
    index.js                ← GET + POST /api/movies
    [id].js                 ← GET + PATCH + DELETE /api/movies/:id
  upload.js                 ← POST /api/upload  (Cloudinary poster upload)
  utils/middleware/
    dbMiddleware.js         ← Connects DB before each handler
    jwtAuth.js              ← Reads HttpOnly cookie + verifies JWT
  validation/
    movieValidation.js      ← Joi schema for create + update
    loginValidation.js      ← Joi schema for login
    registerValidation.js   ← Joi schema for registration

src/
  app/                      ← Pages (Next.js App Router)
    sign-in/                ← Login page
    sign-up/                ← Registration page
    movies/
      page.js               ← Movie list (paginated, skeleton loader)
      add/page.js           ← Add movie form
      edit/[id]/page.js     ← Edit movie form
  common/                   ← Reusable UI primitives
    icons/                  ← EditIcon, TrashIcon (design-system colours)
    SkeletonCard/           ← Shimmer loading placeholder
    ConfirmDialog.js        ← Delete confirmation modal
    ErrorBoundary.js        ← Class-based render error boundary
    error.js                ← API error fallback screen
  components/               ← Feature components
    MoviesList.js           ← Grid, pagination, edit/delete actions
    MoviesForm.js           ← Add / edit form with Cloudinary upload
    EmptyList.js            ← Empty state
  hooks/
    useLogout.js            ← Shared logout logic (calls API + clears cache)
  services/                 ← RTK Query APIs + Redux store
    auth.js                 ← login, logout, register mutations
    movies.js               ← movie CRUD queries/mutations
    store.js                ← Redux store
```

### Key Design Decisions

**Dual-router pattern** - Pages Router (`pages/api/`) handles the REST API while App Router (`src/app/`) handles all UI pages. This is a valid Next.js 14 pattern that keeps the API surface familiar (file-based routing, no server actions) while using the modern App Router for the frontend.

**HttpOnly cookie auth** - The JWT is set server-side as an `HttpOnly` cookie on login. It cannot be read or stolen by JavaScript, eliminating the XSS token-theft vulnerability of `localStorage` or client-written cookies. The browser sends it automatically on every same-origin request.

**Service layer separation** - Route handler files are thin dispatchers that only parse the request and send the response. All business logic lives in `pages/api/services/`, making it independently testable without spinning up HTTP.

**Cloudinary over Base64** - Storing images as Base64 in MongoDB inflates document sizes by ~33%, pushes against MongoDB's 16 MB document limit, and bypasses all Next.js `<Image>` optimisation. Cloudinary stores the file on a CDN; MongoDB stores a 70-character URL.

---

## Getting Started

### Prerequisites

- Node.js 18+
- A MongoDB database - free tier at [cloud.mongodb.com](https://cloud.mongodb.com)
- A Cloudinary account - free tier at [cloudinary.com](https://cloudinary.com)

### 1. Clone and install

```bash
git clone <your-repo-url>
cd code-snippet-nextjs-node-movies
npm install
```

### 2. Configure environment variables

```bash
cp .env.example .env
```

Open `.env` and fill in all values:

```env
# MongoDB connection string
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/movies

# Generate with: node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
SECRET_KEY=<your-strong-random-string>
TOKEN_EXPIRATION=7d

NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api/

# From your Cloudinary Dashboard → Product Environment Credentials
CLOUDINARY_CLOUD_NAME=<your-cloud-name>
CLOUDINARY_API_KEY=<your-api-key>
CLOUDINARY_API_SECRET=<your-api-secret>
```

### 3. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) - you will be redirected to `/sign-in` automatically.

### 4. Create your first account

Go to [http://localhost:3000/sign-up](http://localhost:3000/sign-up) and register with:

- Any valid email address
- A password of at least 8 characters containing at least one letter and one number

---

## API Reference

All endpoints return `{ success: boolean, message: string, data?: any }`.

Protected endpoints require a valid `token` HttpOnly cookie, which is set automatically on login.

### Auth

| Method | Endpoint | Protected | Description |
|---|---|---|---|
| `POST` | `/api/users` | No | Sign in - sets `HttpOnly` JWT cookie |
| `POST` | `/api/users/register` | No | Register a new account |
| `POST` | `/api/users/logout` | No | Clear the auth cookie |

### Movies

| Method | Endpoint | Protected | Description |
|---|---|---|---|
| `GET` | `/api/movies?page=1&pageSize=8` | Yes | List your movies (paginated) |
| `POST` | `/api/movies` | Yes | Create a movie |
| `GET` | `/api/movies/:id` | Yes | Get a single movie |
| `PATCH` | `/api/movies/:id` | Yes | Update a movie |
| `DELETE` | `/api/movies/:id` | Yes | Delete a movie |

### Upload

| Method | Endpoint | Protected | Description |
|---|---|---|---|
| `POST` | `/api/upload` | Yes | Upload a poster image to Cloudinary - returns `{ url: string }` |

---

## Security

| Measure | Implementation |
|---|---|
| Password hashing | `bcrypt` with 12 salt rounds |
| Auth token storage | `HttpOnly; SameSite=Strict` server-set cookie |
| Rate limiting | 10 login attempts per 15 min per IP |
| CORS | Restricted to `NEXT_PUBLIC_SITE_URL` |
| Ownership enforcement | Every movie operation checks `user_id` matches the authenticated user |
| Input validation | Joi on the server, Yup on the client |
| Image upload | Processed server-side only - Cloudinary API secret is never sent to the browser |
| Body size limit | 5 MB cap enforced on all routes that accept a request body |

---

## Deployment

### Vercel + MongoDB Atlas + Cloudinary (recommended - all free tier)

1. Push the repository to GitHub
2. Import it at [vercel.com](https://vercel.com) → **Add New Project**
3. Add every variable from `.env.example` in the Vercel **Environment Variables** dashboard
4. Set `NEXT_PUBLIC_SITE_URL` to your Vercel production URL (e.g. `https://my-movies.vercel.app`)
5. Generate a **new** `SECRET_KEY` for production - never reuse the local development value
6. Click **Deploy** - Vercel rebuilds automatically on every push to `main`

---

## Limitations & Future Work

This snippet is intentionally focused. The following items are acknowledged and deferred:

| Item | Notes |
|---|---|
| Automated tests | No tests included. Recommended: Vitest + Testing Library for unit/component tests, Playwright for E2E. |
| TypeScript | Dev dependencies are installed; all source files are `.js`. Type migration is a separate task. |
| Server-Side Rendering | All pages are Client Components. RSC/SSR would improve initial paint and SEO on `/movies`. |
| Logging & error tracking | Errors reach `console.error` only. Winston, Pino, or Sentry are recommended before production. |
| Additional features | TMDB auto-fill, full-text search, genre filter, sort controls, watched toggle, statistics bar, CSV export. |
