# VintageStyle E-commerce Application

## Overview

This is a full-stack e-commerce application built with React, TypeScript, and Express. The application features a modern clothing store interface with shopping cart functionality, product catalog, and responsive design. It uses shadcn/ui components for the frontend and is configured for PostgreSQL database integration with Drizzle ORM.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **UI Library**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design tokens
- **State Management**: TanStack Query for server state management
- **Routing**: React Router for client-side navigation

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Database Connection**: Neon serverless PostgreSQL
- **Session Management**: Built-in session handling with connect-pg-simple
- **Development**: Hot reload with TSX runtime

## Key Components

### Frontend Structure
```
client/
├── src/
│   ├── components/ui/     # Reusable UI components (shadcn/ui)
│   ├── pages/            # Route components (Index, Shop, About, Contact)
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Utility functions
│   └── main.tsx          # Application entry point
```

### Backend Structure
```
server/
├── index.ts              # Express server setup
├── routes.ts             # API route definitions
├── storage.ts            # Data access layer with memory/DB adapters
└── vite.ts               # Development server integration
```

### Shared Code
```
shared/
└── schema.ts             # Database schema and types
```

## Data Flow

1. **Frontend Request Flow**:
   - User interacts with React components
   - TanStack Query manages API calls to Express backend
   - Components update based on server responses

2. **Backend Request Flow**:
   - Express routes handle incoming API requests
   - Storage layer abstracts database operations
   - Drizzle ORM manages PostgreSQL interactions

3. **Database Operations**:
   - Schema defined in `shared/schema.ts`
   - Drizzle migrations in `./migrations/`
   - Type-safe database queries with Drizzle ORM

## External Dependencies

### Frontend Dependencies
- **UI Framework**: React, React DOM, React Router
- **Component Library**: Radix UI primitives, shadcn/ui components
- **State Management**: TanStack Query
- **Styling**: Tailwind CSS, class-variance-authority
- **Form Handling**: React Hook Form, Hookform resolvers
- **Utilities**: clsx, date-fns, lucide-react icons

### Backend Dependencies
- **Server**: Express.js
- **Database**: Drizzle ORM, @neondatabase/serverless
- **Session**: connect-pg-simple
- **Development**: tsx, esbuild for building

### Development Tools
- **Build**: Vite with React plugin
- **TypeScript**: Full type safety across frontend and backend
- **Database**: Drizzle Kit for migrations and schema management

## Deployment Strategy

### Development
- Run `npm run dev` to start both frontend and backend in development mode
- Vite dev server handles frontend with hot reload
- Express server runs with tsx for TypeScript compilation
- Database migrations run with `npm run db:push`

### Production Build
- Frontend: Vite builds optimized React application to `dist/public`
- Backend: esbuild compiles TypeScript Express server to `dist/index.js`
- Database: PostgreSQL connection via environment variable `DATABASE_URL`

### Environment Setup
- Requires `DATABASE_URL` environment variable for PostgreSQL connection
- Configured for Neon serverless PostgreSQL in production
- Memory storage fallback for development/testing

## Changelog

```
Changelog:
- July 07, 2025: Initial setup and migration from Lovable to Replit
- July 07, 2025: Complete website overhaul with modern improvements:
  * Added dark mode support with theme toggle
  * Implemented responsive navigation component
  * Created reusable product card component with wishlist functionality
  * Added shopping cart persistence with localStorage
  * Enhanced shop page with advanced filtering (category, price, sorting, view modes)
  * Improved About page with team section and company values
  * Enhanced Contact page with detailed forms and FAQ section
  * Added loading states and skeleton components
  * Implemented proper error handling and toast notifications
  * Added smooth animations and hover effects
  * Improved mobile responsiveness across all pages
  * Integrated modern UI patterns with shadcn/ui components
- July 07, 2025: Supabase database integration:
  * Created products schema matching admin dashboard requirements
  * Implemented REST API endpoints for CRUD operations
  * Added database storage layer with fallback to memory storage
  * Updated frontend to fetch products from database
  * Configured PostgreSQL connection with SSL for Supabase
  * Added error handling for database connection issues
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```