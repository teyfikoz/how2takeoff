# Replit.md

## Overview

This is a modern full-stack aviation application built with React on the frontend and Express on the backend. The application provides comprehensive aircraft analysis, flight calculations, and aviation data management tools. It uses PostgreSQL with Drizzle ORM for data persistence and includes a sophisticated UI built with Radix components and Tailwind CSS.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **UI Components**: Radix UI primitives for accessible, customizable components
- **Styling**: Tailwind CSS with custom theme configuration
- **State Management**: TanStack React Query for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Forms**: React Hook Form with Zod validation via @hookform/resolvers

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ESM modules
- **Build Tool**: esbuild for production bundling
- **Development**: tsx for TypeScript execution

### Database Architecture
- **Database**: PostgreSQL (configured for Neon serverless)
- **ORM**: Drizzle ORM for type-safe database operations
- **Migrations**: Drizzle Kit for schema management
- **Connection**: @neondatabase/serverless for optimal serverless performance

### Authentication & Security
- **Password Hashing**: bcryptjs for secure password storage
- **Session Management**: connect-pg-simple for PostgreSQL-backed sessions

## Key Components

### Aviation Data Management
- Aircraft database with comprehensive technical specifications
- Flight calculations including fuel consumption, range, and emissions
- Performance analysis tools with interactive charts
- Route optimization and feasibility analysis

### User Interface Components
- Dashboard with flight requirements input
- Aircraft database browser with detailed specifications
- Performance analysis charts and visualizations
- Real-time calculation results display

### Data Processing
- Wind impact calculations on range and fuel consumption
- Payload and weight balance analysis
- Environmental impact assessments (CO2, NOx emissions)
- Route distance calculations using Haversine formula

### External Integrations
- AviationStack API for live flight data (cached locally)
- Airport database for route calculations
- Weather data integration for performance analysis

## Data Flow

1. **User Input**: Flight parameters entered through React forms
2. **Client Validation**: Form validation using React Hook Form + Zod
3. **API Communication**: TanStack Query manages server communication
4. **Server Processing**: Express routes handle calculations and data retrieval
5. **Database Operations**: Drizzle ORM manages PostgreSQL interactions
6. **Response Handling**: Calculated results returned to client
7. **UI Updates**: React components update with new data

### Calculation Pipeline
- User inputs flight parameters (aircraft, distance, payload)
- Server calculates fuel consumption, emissions, and performance metrics
- Wind impact analysis adjusts range and fuel consumption
- Results displayed in interactive charts and tables

## External Dependencies

### Core Dependencies
- **React Ecosystem**: react, @tanstack/react-query, wouter, react-hook-form
- **UI Library**: Extensive Radix UI component collection
- **Styling**: tailwindcss, postcss, autoprefixer
- **Backend**: express, drizzle-orm, @neondatabase/serverless
- **Authentication**: bcryptjs, connect-pg-simple
- **Development**: typescript, vite, tsx, esbuild

### Aviation-Specific Features
- Aircraft specification database
- Flight performance calculations
- Route optimization algorithms
- Environmental impact analysis
- Real-time data visualization

### Third-Party Services
- **AviationStack API**: Flight data and aircraft information
- **Neon Database**: Serverless PostgreSQL hosting
- **Airport Data**: IATA codes and geographic coordinates

## Deployment Strategy

### Development Environment
- **Local Development**: `npm run dev` starts both frontend and backend
- **Database Management**: `npm run db:push` applies schema changes
- **Type Checking**: `npm run check` validates TypeScript

### Production Build
- **Frontend Build**: Vite compiles React app to `/dist/public`
- **Backend Build**: esbuild bundles Express server to `/dist`
- **Database**: PostgreSQL with Drizzle migrations
- **Environment**: NODE_ENV=production with optimized configurations

### Key Configuration Files
- `vite.config.ts`: Frontend build configuration with path aliases
- `drizzle.config.ts`: Database schema and migration settings
- `tsconfig.json`: TypeScript configuration for monorepo structure
- `tailwind.config.ts`: Custom design system configuration

### Deployment Considerations
- Database URL must be provided via environment variable
- Frontend assets served from `/dist/public`
- Backend API routes handle calculation requests
- Session storage requires PostgreSQL connection
- Static assets cached for performance

The application follows a modern full-stack architecture with clear separation of concerns, type safety throughout, and optimized performance for aviation-specific calculations and data management.