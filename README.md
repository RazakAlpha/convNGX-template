# ConvNGX Template

A production-ready Angular template with Convex backend and betterAuth authentication. Build real-time, reactive applications with a modern dark-themed UI.

## ✨ Features

- **Angular 20** — Latest framework with standalone components, signals, and zoneless change detection
- **Convex Backend** — Real-time data sync without WebSocket boilerplate
- **betterAuth** — Secure authentication with optional email verification
- **Modern UI** — Dark theme with distinctive design (no generic AI slop)
- **Chat Demo** — Fully functional real-time chat to demonstrate the stack
- **Type-Safe** — End-to-end TypeScript with generated Convex types
- **Developer Tools** — ESLint, Prettier, Husky pre-commit hooks

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- Convex account ([convex.dev](https://convex.dev))

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd convNGX-template

# Install dependencies
npm install

# Set up Convex (creates project & configures env)
npx convex dev
```

### Development

Run both servers simultaneously:

```bash
# Terminal 1 — Convex backend
npm run convex:dev

# Terminal 2 — Angular frontend
npm start
```

Open [http://localhost:4200](http://localhost:4200)

## 📁 Project Structure

```
src/
├── app/
│   ├── chat/                       # Chat feature module
│   │   ├── chat.component.ts       # Main chat view
│   │   ├── chat-list.component.ts  # Message list
│   │   └── chat-input.component.ts # Message input
│   ├── components/
│   │   ├── auth/                   # Auth pages
│   │   │   ├── signin.component.ts
│   │   │   └── signup.component.ts
│   │   └── landing/                # Landing page
│   │       └── landing.component.ts
│   ├── guards/                     # Route guards
│   │   ├── auth.guard.ts
│   │   └── public.guard.ts
│   ├── services/                   # Angular services
│   │   ├── auth.service.ts
│   │   ├── chat.service.ts
│   │   └── convex-auth.state.ts
│   ├── shared/components/          # Reusable UI
│   │   ├── auth-layout.component.ts
│   │   ├── loading-indicator.component.ts
│   │   └── password-input.component.ts
│   ├── app.config.ts
│   └── app.routes.ts
├── convex/                         # Convex backend
│   ├── auth.ts                     # Auth functions
│   ├── auth.config.ts
│   ├── http.ts                     # HTTP routes
│   ├── messages.ts                 # Chat mutations/queries
│   ├── schema.ts                   # Database schema
│   └── users.ts                    # User functions
├── lib/                            # Utilities
│   ├── auth.ts                     # betterAuth setup
│   ├── auth.utils.ts
│   ├── constants.ts
│   ├── error-handler.ts
│   └── validators.ts
└── styles.scss                     # Global styles & design tokens
```

## 🔧 Scripts

```bash
npm start              # Start Angular dev server
npm run convex:dev     # Start Convex dev server

npm run format         # Format with Prettier
npm run format:check   # Check formatting
npm run lint           # Run ESLint
npm run lint:fix       # Fix ESLint issues
npm run typecheck      # TypeScript type check

npm run build          # Production build
```

## 🎨 Design System

The template uses CSS custom properties for theming. Key tokens in `src/styles.scss`:

```scss
:root {
  --color-background: #0a0a0f;
  --color-surface: #111118;
  --color-primary: #6366f1;
  --color-accent-purple: #8b5cf6;
  --color-accent-pink: #ec4899;
  --gradient-primary: linear-gradient(135deg, #6366f1, #8b5cf6);
}
```

## 🔐 Authentication

Authentication uses betterAuth with Convex adapter:

- **Email/password** enabled by default
- **Email verification** optional (disabled by default)
- Configurable in `src/lib/auth.ts`

```typescript
emailAndPassword: {
  enabled: true,
  requireEmailVerification: false, // Set to true if needed
}
```

## 📦 Key Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `@angular/core` | ^20.3.0 | Angular framework |
| `convex` | ^1.27.3 | Backend & real-time sync |
| `@convex-dev/better-auth` | ^0.7.18 | Auth integration |
| `@razakalpha/convngx` | ^0.2.4 | Angular-Convex bridge |
| `better-auth` | ^1.3.8 | Auth client |

## 🛠️ Configuration

### Environment Variables

Create `.env.local` with your Convex deployment:

```env
CONVEX_DEPLOYMENT=your-deployment-url
```

### Email Verification

To enable email verification:

1. Update `src/lib/auth.ts`:
   ```typescript
   emailAndPassword: { enabled: true, requireEmailVerification: true }
   ```

2. Configure an email provider in your Convex dashboard

## 🏗️ Architecture

### Frontend Patterns

- **Standalone components** — No NgModules
- **Signals** — `signal()` for state, `computed()` for derived values
- **inject()** — Dependency injection without constructors
- **OnPush** — All components use `ChangeDetectionStrategy.OnPush`

### Backend Patterns

- **Convex functions** — `query` and `mutation` with validation
- **Auth checks** — All protected functions verify authentication
- **Live queries** — `convexLiveResource()` for reactive data

## 📚 Documentation

- [SETUP.md](./SETUP.md) — Detailed setup guide
- [AGENTS.md](./AGENTS.md) — Coding guidelines for AI agents
- [Convex Docs](https://docs.convex.dev)
- [betterAuth Docs](https://www.better-auth.com)
- [Angular Docs](https://angular.dev)

## 🎯 What's Included

- ✅ Landing page with hero section
- ✅ Sign in / Sign up pages
- ✅ Real-time chat demo
- ✅ Route guards (auth/public)
- ✅ Dark theme UI system
- ✅ Responsive design
- ✅ Loading states
- ✅ Error handling
- ✅ Form validation

## 🚫 What's NOT Included (By Design)

- ❌ UI component library — Add your own (PrimeNG, Angular Material, etc.)
- ❌ Testing setup — Configure Jest/Vitest as needed
- ❌ State management — Use signals or add NgRx/Elf if needed
- ❌ Deployment config — Configure for your platform
- ❌ Email verification flow — Enable if required

## 📄 License

MIT — Use freely for your projects!

---

**Built with Angular + Convex + betterAuth**
