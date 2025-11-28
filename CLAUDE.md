# BeeBnB Technology Stack and Architectural Decisions

Additional informations/specs can be found in `/docs/**`.

## Current Implementation Status

**Note:** The application currently runs with mock data (`src/lib/mock-data.ts`) for development and testing. Database integration and authentication are planned for the next phase.

**Completed:**
- All UI pages and components
- TypeScript types matching database schema
- Form validation (Zod schemas)
- Responsive design

**Pending:**
- Drizzle schema implementation
- Neon database connection
- Better-Auth integration
- Server Actions for mutations

---

This document outlines the core technologies and architectural patterns chosen for the BeeBnB MVP. All development must adhere to this stack unless explicitly approved changes are made to the main Specification Document.

## 1. Core Stack

| Layer | Technology | Version / Tool | Rationale |
| :--- | :--- | :--- | :--- |
| **Full-Stack Framework** | **Next.js** | v16+ | Enables a unified full-stack architecture using Server Components (RSCs) and Server Actions, eliminating the need for a separate REST API layer. |
| **Database** | **PostgreSQL** | Neon (Cloud DB) | Robust, transactional, and scalable relational database for strong consistency on core booking data. |
| **ORM / Query Builder** | **Drizzle** | Latest | Provides a type-safe interface for interacting with the Postgres database, enhancing developer experience and reducing runtime errors. |
| **Authentication** | **Better-Auth** | Latest | Email/Password |
| **Styling** | **Tailwind CSS** | Latest | A utility-first CSS framework for rapid and consistent styling. |
| **UI Components** | **shadcn/ui** | Latest | A collection of re-usable components built on Tailwind CSS, ensuring a polished and accessible UI. |

---

## 2. Architectural Paradigm: Server Components First (RSCs)

The BeeBnB application is built around the Next.js **App Router** paradigm, prioritizing **React Server Components (RSCs)**.

* **React Server Components (RSC):** Used for all data fetching (reading from the database) and rendering of static/less-interactive UI parts (e.g., property cards, headers, layouts). This reduces the JavaScript bundle size and improves initial page load performance.
* **React Client Components (RCC):** Used sparingly, primarily for managing user interaction, form state, and browser-specific APIs (e.g., the map component, the calendar component for date selection). Client components must be clearly marked with `'use client'`.

## 3. Data Flow and Mutations

### Server Actions

All write operations (mutations) in the application **must** be implemented using **Next.js Server Actions**.

| Action Type | Examples | Implementation Method |
| :--- | :--- | :--- |
| **Creation** | Create a New Property Listing | Server Action |
| **Updates** | Update a Property, Accept/Decline Booking | Server Action |
| **Deletions** | Cancel a Booking | Server Action |

**Rationale:** Server Actions provide a secure, type-safe, and simplified way to perform database mutations directly from the client (via forms or functions) without manually setting up API endpoints.

## 4. Rendering and Caching Strategy

Performance is a top priority, driving the following rendering decisions:

1.  **ISR (Incremental Static Regeneration):** The main **Property Listing and Search Results pages** will use ISR without a revalidation time. Whenever a property listing is changed, the corresponding tag should be revalidated. This ensures the most common views are served instantly from the cache.
2.  **SSR (Server-Side Rendering):** Used for personalized pages (e.g., Host Dashboard, Guest Bookings) and single **Property Detail pages**. This ensures the data fetched is always fresh for the specific user/request.
3.  **Dynamic Rendering:** The crucial **Date and Availability components** on the Property Detail page must be rendered dynamically and wrapped in a **Suspense Boundary** to prevent caching stale availability data, while the surrounding UI can benefit from caching.

## 5. Development Standards

* **Database Schema:** Must be defined using Drizzle's schema definitions, and migrations must be handled through Drizzle's migration tools.
* **Zod Schema:** Zod schemas must be used to validate inputs on the server and client. Zod schemas can be inferred from the drizzle schema.
* **Code Formatting:** Use Biome.
* **TypeScript:** All code must be written in **TypeScript** to ensure type safety across the application, especially with Drizzle ORM and Server Actions.
- Only create an abstraction if it's actually needed
- Prefer clear function/variable names over inline comments
- Avoid helper functions when a simple inline expression would suffice
- Use 'knip' to remove unused code if making large changes
- The 'gh' CLI is installed, use it
- Don't use emojis

## React
- Avoid massive JSX blocks and compose smaller components
- Colocate code that changes together
- Avoid 'useEffect' unless absolutely needed
## Tailwind
- Mostly use built-in values, occasionally allow dynamic values, rarely globals
- Always use v4 + global CSS file format + shadn/ui
- don't use inline styles
## Next
- Prefer fetching data in RSC (page can still be static)
- Use next/font + next/script when applicable
- next/image above the fold should have 'sync' / 'eager' / use 'priority' sparingly
- Be mindful of serialized prop size for RSC → child components
## TypeScript
- Don't unnecessarily add 'try' /'catch'
- Don't cast to 'any'
