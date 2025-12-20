# Pentatonic Ball Bouncer

## Overview

An interactive musical web application where a bouncing ball creates pentatonic melodies by hitting the walls of a pentagon. The project combines physics simulation with audio synthesis to create an engaging musical experience inspired by Chrome Music Lab's playful minimalism.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight React router)
- **State Management**: React Query for server state, React hooks for local state
- **Styling**: Tailwind CSS with shadcn/ui component library (New York style variant)
- **Build Tool**: Vite with custom plugins for Replit integration

The frontend follows a component-based architecture with:
- `PentagonCanvas`: SVG/Canvas-based visualization handling physics and rendering
- `Controls`: Play/pause, reset, speed, and volume controls
- `StatusBar`: Displays current note and bounce statistics
- `NoteHistory`: Shows recent notes played as colored badges

### Backend Architecture
- **Runtime**: Node.js with Express
- **Language**: TypeScript with ESM modules
- **API Pattern**: RESTful routes prefixed with `/api`
- **Storage**: Abstracted storage interface with in-memory implementation (MemStorage)

The server uses a simple architecture with:
- Express middleware for JSON parsing and request logging
- Vite dev server integration for development HMR
- Static file serving for production builds

### Key Technical Decisions

**Physics Engine**: Custom physics implementation in `client/src/lib/physics.ts` handles:
- Pentagon vertex generation
- Wall collision detection
- Velocity reflection calculations
- Ball position updates

**Audio System**: Web Audio API implementation in `client/src/lib/audio.ts`:
- Generates sine wave oscillators for pentatonic notes (C4, D4, E4, G4, A4)
- Each pentagon wall maps to a specific note
- Volume control with exponential decay envelope

**Design System**: Hybrid approach combining Material Design controls with custom artistic visualization:
- Inter font for UI, JetBrains Mono for numerical values
- CSS variables for theming with light/dark mode support
- Spacing based on Tailwind's 2, 4, 6, 8 unit system

### Database Schema
PostgreSQL with Drizzle ORM. Currently minimal schema with users table:
- `id`: UUID primary key
- `username`: Unique text field
- `password`: Text field

Schema validation uses Zod via drizzle-zod integration.

## External Dependencies

### Core Libraries
- **@tanstack/react-query**: Server state management and caching
- **drizzle-orm**: TypeScript ORM for PostgreSQL
- **express**: HTTP server framework
- **wouter**: Client-side routing

### UI Components
- **@radix-ui/***: Headless UI primitives (dialog, slider, tabs, etc.)
- **shadcn/ui**: Pre-styled component library built on Radix
- **lucide-react**: Icon library
- **class-variance-authority**: Variant-based component styling
- **tailwind-merge**: Utility class merging

### Build & Development
- **vite**: Frontend build tool with HMR
- **tsx**: TypeScript execution for Node.js
- **esbuild**: Fast JavaScript bundler for production server
- **drizzle-kit**: Database migration tooling

### Database
- **PostgreSQL**: Primary database (via DATABASE_URL environment variable)
- **connect-pg-simple**: PostgreSQL session store for Express

## Recent Changes

### December 20, 2025
- Initial MVP implementation of Pentatonic Bouncer
- Created physics engine for ball movement and pentagon collision detection
- Implemented Web Audio API for pentatonic note generation (C4, D4, E4, G4, A4)
- Built interactive controls: play/pause, reset, speed slider, volume slider
- Added status bar with current note, bounce count, and elapsed time
- Implemented note history display showing last 8 notes
- Added dark/light theme toggle with localStorage persistence
- Added keyboard shortcuts: Space for play/pause, R for reset
- Added accessibility improvements (aria-pressed, aria-label)