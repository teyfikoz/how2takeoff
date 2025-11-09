# Replit.md - Aviation Flight Analysis Platform

## Overview

This is a full-stack aviation analytics application that provides comprehensive flight feasibility analysis, profitability estimation, and aircraft performance calculations. The platform combines航空 (aviation) domain expertise with modern web technologies to deliver interactive dashboards for route optimization, weight-balance calculations, fuel consumption analysis, and emission tracking.

The application targets aviation professionals, airline revenue managers, flight planners, and researchers who need to evaluate aircraft performance across different operational scenarios.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Technology Stack

**Frontend Architecture:**
- **Framework:** React 18 with TypeScript
- **Build Tool:** Vite for fast development and optimized production builds
- **UI Components:** Radix UI primitives with shadcn/ui design system
- **Styling:** Tailwind CSS with custom theme configuration (professional variant, light appearance)
- **State Management:** TanStack Query (React Query) for server state management
- **Routing:** Wouter for lightweight client-side routing
- **Form Handling:** React Hook Form with Zod resolvers for validation
- **Data Visualization:** Expected to use charting libraries (Recharts or similar) for performance graphs and comparisons

**Backend Architecture:**
- **Runtime:** Node.js with Express.js server
- **Language:** TypeScript with ES modules
- **API Pattern:** RESTful API architecture
- **Session Management:** Express sessions with PostgreSQL session storage (connect-pg-simple)
- **Authentication:** bcryptjs for password hashing

**Database Layer:**
- **Database:** PostgreSQL (via Neon serverless)
- **ORM:** Drizzle ORM for type-safe database operations
- **Migrations:** Drizzle Kit for schema migrations (output to `./migrations`)
- **Schema Location:** `./shared/schema.ts` for shared type definitions

### Project Structure

The application follows a monorepo structure with clear separation of concerns:

```
/client          - Frontend React application
  /src           - Source code
    /pages       - Route-level page components (Dashboard, AircraftDatabase)
    /components  - Reusable UI components
    /tests       - Frontend test setup
/server          - Backend Express.js API
/shared          - Shared TypeScript types and database schema
/migrations      - Database migration files
```

**Path Aliases:**
- `@/*` resolves to `./client/src/*`
- `@shared/*` resolves to `./shared/*`

### Key Architectural Decisions

**1. Database Strategy**
- **Choice:** PostgreSQL with Drizzle ORM
- **Rationale:** Type-safe queries, automatic schema generation, excellent TypeScript integration
- **Schema Design:** Centralized in `shared/schema.ts` for consistent types across frontend and backend
- **Session Storage:** PostgreSQL-backed sessions for scalability and persistence

**2. Frontend Architecture**
- **Choice:** Vite + React + TypeScript
- **Rationale:** Fast HMR, modern build tooling, strong typing prevents runtime errors
- **Component Library:** Radix UI primitives provide accessible, unstyled components
- **Styling Approach:** Tailwind CSS with theme.json for consistent design tokens
- **Form Strategy:** React Hook Form reduces re-renders, Zod provides runtime validation

**3. API Design**
- **Choice:** RESTful Express.js server
- **Build Strategy:** esbuild bundles server code for production deployment
- **Module System:** ES modules throughout (type: "module" in package.json)
- **Production Separation:** Vite builds client to `dist/public`, esbuild bundles server to `dist`

**4. Aviation Domain Implementation**
- **Aircraft Database:** Stores comprehensive aircraft specifications (capacity, range, fuel efficiency, emissions)
- **Calculation Modules:** 
  - Weight and balance calculations (CG limits, payload optimization)
  - Fuel burn calculations (distance, load factor, wind impact)
  - Emissions tracking (CO₂, NOx calculations)
  - Route feasibility analysis (Haversine distance, RASK/CASK metrics)
- **Performance Analysis:** Multi-scenario modeling (25%/50%/75%/100% load factors, range variations, wind effects)

**5. Testing Infrastructure**
- **Choice:** Vitest with jsdom environment
- **Rationale:** Fast, Vite-native testing with React component support
- **Setup:** Global test configuration in `vitest.config.ts`, test setup in `client/src/tests/setup.ts`

### Data Flow

1. **User Input → Frontend Forms:** React Hook Form captures flight parameters (origin, destination, aircraft type, load factors)
2. **API Calls → TanStack Query:** Client queries backend endpoints for calculations and database operations
3. **Backend Processing:** Express routes handle business logic (distance calculations, aircraft matching, profitability analysis)
4. **Database Queries:** Drizzle ORM retrieves aircraft specifications and stores user sessions
5. **Response → UI Updates:** TanStack Query caches results, React components render visualizations

### Configuration Files

- **drizzle.config.ts:** Database connection and migration settings
- **vite.config.ts:** Frontend build configuration with custom plugins
- **tailwind.config.ts:** Design system tokens and theme extensions
- **theme.json:** Replit-specific theme configuration (professional variant)
- **tsconfig.json:** TypeScript compiler settings with path aliases

## External Dependencies

### Third-Party Services

**Database:**
- **Neon Serverless PostgreSQL** (`@neondatabase/serverless`)
  - Serverless PostgreSQL database
  - Connection via `DATABASE_URL` environment variable
  - Required for application startup (throws error if missing)

**Session Storage:**
- **connect-pg-simple**
  - PostgreSQL session store for Express
  - Integrates with existing database connection

### External APIs (Potential)

Based on attached documents, the application may integrate:
- **IP Geolocation Services** (ipinfo.io, ip-api.com) for user analytics
- **Airport Data APIs** for IATA code validation and coordinates
- **Weather/Wind Data APIs** for enhanced flight calculations

### UI Component Libraries

- **Radix UI:** 25+ primitive components (dialogs, dropdowns, tabs, tooltips, etc.)
- **@ctrl/react-adsense:** AdSense integration (revenue generation)
- **cmdk:** Command palette component
- **class-variance-authority + clsx:** Dynamic className utilities

### Development Tools

- **Vite Plugins:**
  - `@vitejs/plugin-react`: React Fast Refresh
  - `@replit/vite-plugin-shadcn-theme-json`: Theme integration
  - `@replit/vite-plugin-runtime-error-modal`: Development error overlay

- **Testing:**
  - Vitest with coverage support
  - Vitest UI for visual test runner

### Build Dependencies

- **esbuild:** Server-side bundling for production
- **tsx:** TypeScript execution for development server
- **drizzle-kit:** Database migration tooling
- **PostCSS + Autoprefixer:** CSS processing pipeline