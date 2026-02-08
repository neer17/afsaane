# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Qalachowk Frontend is an e-commerce web application built with Next.js 16 (App Router), React 18, and Mantine UI. The app targets Indian customers and features product browsing, cart/wishlist management with IndexedDB persistence, and a checkout flow with OTP-based authentication.

## Development Commands

```bash
# Package manager (project enforces yarn)
yarn install

# Development server (clears .next cache, listens on 0.0.0.0)
yarn dev

# Production build
yarn build

# Linting
yarn lint                    # ESLint on src/**/*.{js,jsx,ts,tsx}
yarn lint:fix                # Auto-fix lint issues

# Formatting
yarn format                  # Prettier on entire project
yarn prettier:fix            # Prettier on src/ only
```

Pre-commit hook runs: `yarn format && yarn lint && yarn run build`

## Architecture

### Path Alias

- `@/*` maps to `src/*` (configured in tsconfig.json)

### Directory Structure

- `src/app/` - Next.js App Router pages and layouts
- `src/components/` - React components organized by feature (banner/, card/, forms/, modal/, navbar/)
- `src/context/` - React context providers (CartContext, SupabaseAuthContext)
- `src/lib/api/` - API service modules (orderService, userService, otpService, discountService)
- `src/lib/supabase/` - Supabase client setup
- `src/types/` - TypeScript types
  - `api/generated.ts` - Auto-generated from OpenAPI spec (do not edit directly)
  - `api/index.ts` - API type exports
  - `ui/` - UI-specific types
- `src/utils/` - Utilities (constants, types, schema validation, IndexedDB helpers)

### Key Architectural Patterns

**Cart & Wishlist Persistence**: Uses IndexedDB via `idb` library in `CartContext.tsx`. Data stored in `cartDB` database with `cartStore` and `wishlistStore` object stores.

**API Types**: Types in `src/types/api/generated.ts` are auto-generated from backend OpenAPI spec using `openapi-typescript`. Service files import types like:

```typescript
import type { components } from "@/types/api";
export type CreateOrderRequest = components["schemas"]["OrderInput"];
```

**Environment Validation**: Environment variables are validated at startup via Joi schema in `src/utils/schema.ts`. App exits on validation failure.

**Authentication Flow**: Phone-based OTP authentication through backend API. Token refresh handled via `refreshSession()` in `lib/api/common.ts`.

### Required Environment Variables

- `NEXT_PUBLIC_ENVIRONMENT` - Development | Staging | Production
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key
- `NEXT_PUBLIC_GOOGLE_CLIENT_ID` - Google OAuth client ID
- `NEXT_PUBLIC_BACKEND_BASE_URL` - Backend API base URL

### External Dependencies

- **Supabase**: Database and auth infrastructure (images stored in Supabase storage)
- **Mantine**: UI component library with notifications
- **Backend API**: Separate service for orders, products, users, auth (API endpoints defined in `src/utils/constants.tsx`)
