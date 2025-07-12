# Setup and Deployment

This repository requires your GitHub account to be added directly to Freebites
organization to be able to install packages. You will need a **Personal Access Token (PAT)**

## Generating a PAT

Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

# Tech Stack:

## Front-End

### Anime.js

###

# Architectural Design Decisions

Currently trying to figure out how to present this info better

## Firebase Admin SDK vs Firebase Client SDK

**Decision**: Use both Firebase Admin SDK and Client SDK for server-side
verification and client-side authentication.

**Reasoning**: Firebase Admin SDK works on the server-side, allowing for manual
token verification, which allows to protect api routes, for example. We also can
take advantage of Next.js server-side rendering (which we can't have in-app) to
handle redirection logic.

This _also_ means that we can we chain custom logic to backend verification,
_including_ our MongoDB verification, so that we can verify valid MongoDB
credentials in the same API call/server render.

**Why Both?**
| SDK | Used for | Where |
| ----------------------- | --------------------------------------------------------------- | --------------------------------------------- |
| **Firebase Client SDK** | Signing in/out, getting ID tokens | On the client (browser) |
| **Firebase Admin SDK** | Verifying tokens, protecting API routes, chaining backend logic | On the server (API routes, server components) |

**Sign-in Flow**

1. The user signs in via the Firebase Client SDK (e.g., `signInWithEmailAndPassword()`).
2. Firebase authenticates and returns an ID token for that user.
3. The client sends this token to our backend via a POST request to /api/session.
4. The server:
   - Verifies the token using the Firebase Admin SDK.
   - (Optional) Checks MongoDB to verify user role or registration.
   - If all checks pass, it sets an HTTP-only cookie to persist the session.
5. The client is then redirected to `/admin`.
6. In `/admin`, there an `AuthGuard` server component. It:
   - Runs on every server-side render of protected routes.
   - Validates the cookie and re-verifies the token.
   - Redirects to /admin/login if validation fails (e.g., expired or forged cookie).
