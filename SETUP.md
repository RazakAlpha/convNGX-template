# Setup Guide

This guide walks you through setting up the ConvNGX template for local development.

## Prerequisites

- **Node.js 18+** (check with `node -v`)
- **npm** or **yarn**
- **Convex account** at [convex.dev](https://convex.dev)

## Quick Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Convex

Create a new Convex project or link an existing one:

```bash
npx convex dev
```

This will:
- Prompt you to log in (if needed)
- Create/link a Convex project
- Generate the `convex/_generated` files
- Start the Convex dev server

### 3. Set Environment Variables

Create a `.env.local` file in the project root:

```env
CONVEX_DEPLOYMENT=https://your-deployment.convex.cloud
AUTH_BASE_URL=https://your-deployment.convex.site
SITE_URL=http://localhost:4200
```

You can find these values in your [Convex dashboard](https://dashboard.convex.dev).

### 4. Start Development

Run both servers simultaneously:

```bash
# Terminal 1 - Convex backend
npm run convex:dev

# Terminal 2 - Angular frontend
npm start
```

Open [http://localhost:4200](http://localhost:4200)

## Troubleshooting

### Module Not Found: @razakalpha/convngx

If you encounter errors about `@razakalpha/convngx` module not being found:

1. **Clear node_modules and reinstall:**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **If that doesn't work**, the npm package may need to be rebuilt. Check for updates:
   ```bash
   npm update @razakalpha/convngx
   ```

3. **For development**, you can clone and link the package locally:
   ```bash
   git clone https://github.com/razakAlpha/convngx.git
   cd convngx
   npm install
   npm run build
   npm link

   cd ../convNGX-template
   npm link @razakalpha/convngx
   ```

### Convex "Not Authenticated" Errors

1. Make sure Convex dev server is running (`npm run convex:dev`)
2. Check that `CONVEX_DEPLOYMENT` is correctly set
3. Try logging out and back in:
   ```bash
   npx convex logout
   npx convex login
   ```

### CORS Errors

Update the allowed origins in `src/convex/http.ts`:

```typescript
const allowedOrigins =
  process.env['NODE_ENV'] === 'production'
    ? ['https://your-production-domain.com']
    : ['http://localhost:4200'];
```

### TypeScript Errors About `process`

The Convex backend files use Node.js `process.env`. This is expected - those files run on the server, not in the browser.

If you see these errors in your IDE, they can be safely ignored as they only apply to the Convex backend.

## Production Deployment

### 1. Deploy Convex Backend

```bash
npx convex deploy
```

### 2. Build Angular Frontend

```bash
npm run build
```

The output will be in `dist/`. Deploy this to your hosting provider of choice.

### 3. Update Environment Variables

Make sure to set production environment variables on your hosting platform:
- `CONVEX_DEPLOYMENT` - Your production Convex URL
- `AUTH_BASE_URL` - Your production Convex site URL
- `SITE_URL` - Your production frontend URL

## Project Configuration

### Email Verification (Optional)

To enable email verification:

1. Update `src/lib/auth.ts`:
   ```typescript
   emailAndPassword: {
     enabled: true,
     requireEmailVerification: true,
   }
   ```

2. Configure an email provider in your Convex dashboard

### Adding a UI Library

This template is UI-library agnostic. To add one:

**PrimeNG:**
```bash
npm install primeng primeicons
# Import styles in angular.json
```

**Angular Material:**
```bash
ng add @angular/material
```

**Tailwind CSS:**
```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init
```

## File Reference

| File | Purpose |
|------|---------|
| `src/app/app.config.ts` | Angular app configuration |
| `src/app/app.routes.ts` | Route definitions |
| `src/lib/auth.ts` | betterAuth configuration |
| `src/lib/constants.ts` | App constants |
| `src/convex/schema.ts` | Database schema |
| `src/convex/auth.ts` | Auth functions |
| `src/convex/http.ts` | HTTP routes (CORS) |
| `src/environments/` | Environment configs |
