# WebStore

**A full-stack e-commerce portfolio project with a responsive storefront, persistent user data, product management, reviews, and order administration.**

[Live demo](https://webstore-portfolio.onrender.com/) · [API health](https://webstore-portfolio.onrender.com/api/health) · [Українська версія](README.uk.md)

> This is a demonstration project. Payments, shipping providers, and transactional email are not connected.

## Overview

WebStore demonstrates a complete customer journey: browsing and filtering products, opening product details, creating an account, maintaining a wishlist and cart, placing an order, and reviewing previous purchases. Administrators can manage the catalogue, orders, and review replies.

The React application and Express API are deployed as one service. PostgreSQL stores application data, while Cloudinary provides persistent media storage.

## Demo access

| Role | Email | Password |
| --- | --- | --- |
| Customer | `user@example.com` | `PortfolioDemo2026!` |

The administrator password is generated privately during deployment and is intentionally not published.

The free Render service may need up to a minute to wake after inactivity.

## Features

### Storefront

- Responsive product catalogue with search, filters, sorting, and pagination
- Product detail pages with stock, colour options, ratings, and media
- Server-backed wishlist and shopping cart
- Checkout flow and personal order history
- Customer profile and account management
- Ratings and reviews with image/video attachments
- Informational pages for delivery, warranty, promotions, credit, and trade-in

### Administration

- Role-protected administration routes
- Product creation, editing, deletion, and image upload
- Order list and status management
- Administrator replies to customer reviews

### Platform

- Email/password authentication with JWT and bcrypt
- Optional Google OAuth integration
- PostgreSQL data model managed through Prisma ORM
- Cloudinary-backed persistent uploads
- Lazy-loaded React routes
- Same-origin production delivery for the frontend and API
- Seeded catalogue and demo accounts
- Render health check at `/api/health`

## Architecture

```text
Browser
  └── React + Vite
       └── /api
            └── Express + JWT + Prisma
                 ├── PostgreSQL (Neon)
                 └── Cloudinary media storage
```

In production, Express serves both the compiled React application and the REST API from one domain. This keeps the deployment simple and avoids requiring a client to install or run anything locally.

## Technology stack

| Area | Technologies |
| --- | --- |
| Frontend | React 18, Vite, React Router, Axios, Framer Motion, Tailwind CSS, Sass, Radix UI |
| Backend | Node.js 22, Express, Prisma, JWT, bcrypt, Multer |
| Data | PostgreSQL, Neon |
| Media | Cloudinary |
| Deployment | Render Blueprint |
| Verification | Node test runner, Supertest, Vite build, npm audit |

## Repository structure

```text
WEB-store/
├── client/                 React storefront
│   ├── src/components/     Shared interface components
│   ├── src/context/        Authentication, cart, and wishlist state
│   ├── src/pages/          Route-level pages
│   └── src/services/       API client
├── server/
│   ├── prisma/             Schema and deterministic demo seed
│   ├── src/controllers/    API business logic
│   ├── src/middleware/     Authentication, uploads, and security
│   ├── src/routes/         REST routes
│   └── test/               API smoke tests
├── render.yaml             Production Blueprint
└── package.json            Workspace scripts
```

## Local development

### Requirements

- Node.js 22+
- PostgreSQL database
- Cloudinary account only if persistent media uploads are required

### 1. Install dependencies

```bash
git clone https://github.com/Wertoquri/WEB-store.git
cd WEB-store
npm run install:all
```

### 2. Configure the API

Copy `server/.env.example` to `server/.env` and provide at least:

```env
PORT=5000
NODE_ENV=development
DATABASE_URL=postgresql://user:password@localhost:5432/webstore?schema=public
JWT_SECRET=replace-with-a-secret-of-at-least-32-characters
CLIENT_URL=http://localhost:3001
```

Optional integrations:

```env
CLOUDINARY_URL=cloudinary://api_key:api_secret@cloud_name
GOOGLE_CLIENT_ID=
DEMO_ADMIN_PASSWORD=
DEMO_USER_PASSWORD=
```

For Google Sign-In in the Vite client, add `VITE_GOOGLE_CLIENT_ID` to `client/.env`.

### 3. Prepare the database

```bash
npm run prisma:generate --prefix server
npm run prisma:deploy --prefix server
npm run prisma:seed --prefix server
```

The seed command recreates the demonstration catalogue and accounts. Do not run it against a database containing data that must be preserved.

### 4. Start both applications

Terminal 1:

```bash
npm run dev --prefix server
```

Terminal 2:

```bash
npm run dev --prefix client
```

- Frontend: <http://localhost:3001>
- API health: <http://localhost:5000/api/health>

## Verification

Run the complete local verification pipeline:

```bash
npm run verify
```

It runs the API tests, builds the production client, and audits production dependencies for both applications.

## Free deployment

The included [`render.yaml`](render.yaml) deploys the project as one Render web service.

1. Create a PostgreSQL database in Neon.
2. Create a Cloudinary account for persistent uploads.
3. Create a Render Blueprint from this repository.
4. Add `DATABASE_URL` and `CLOUDINARY_URL` when prompted.
5. Let Render generate `JWT_SECRET` and the private administrator password.
6. Verify the live storefront and `/api/health`.

Production build commands:

```bash
npm run render:build
npm run render:start
```

## Security notes

- Secrets are supplied through environment variables and excluded from Git.
- Production requires a JWT secret with at least 32 characters.
- Passwords are hashed with bcrypt.
- Protected and administrator routes are verified by the API.
- Uploads enforce file type, size, and count limits.
- Production errors do not expose internal stack traces.

## Demo limitations

- Checkout does not charge a real payment method.
- Shipping and transactional email providers are not connected.
- Google OAuth requires separate credentials and an authorised production origin.
- Free hosting has quotas and cold starts.
- The Render start command reseeds the demonstration database, so this deployment is not intended to store real customer orders.

## License

Released under the [MIT License](LICENSE).
