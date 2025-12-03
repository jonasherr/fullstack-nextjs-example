# Fullstack Next.js example
- BeeBnB - Airbnb Clone MVP

## Tech Stack

- **Framework:** Next.js 16+ (App Router, React Server Components, Cache Components)
- **Database:** PostgreSQL (Neon) with Drizzle ORM
- **Authentication:** Better-Auth
- **Styling:** Tailwind CSS v4 + shadcn/ui
- **Language:** TypeScript
- **Package Manager:** Bun
- **Code Quality:** Biome (formatting + linting)

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) installed
- Node.js 20+
- Setup [Neon](https://vercel.com/marketplace/neon) DB in Vercel integrations
- Rename `.env.example` to `.env` and replace placeholder values with your env variables

### Installation

```bash
# Install dependencies
bun install

# Push migrations to Neon
bun run db:push

# Run development server
bun run dev

# Open http://localhost:3000
```

### Available Scripts

```bash
bun run dev      # Start development server
bun run build    # Build for production
bun run start    # Start production server
bun run lint     # Run Biome linter
bun run format   # Format code with Biome
```

## Documentation

- **Architecture & Standards:** See [CLAUDE.md](./CLAUDE.md)
- **Full Specification:** See [docs/spec.md](./docs/spec.md)

## Features

### Authentication
- User registration and login with email/password
- Secure session management
- Separate guest and host capabilities

### For Guests
- **Browse & Search:** View all available properties with real-time search
- **Advanced Filtering:** Filter by location (city/state), price range, number of guests, and dates
- **Property Details:** View comprehensive property information, images, amenities, and availability calendar
- **Favorites:** Save interesting properties and access them from a dedicated favorites page
- **Booking Requests:** Submit booking requests with automatic date conflict checking
- **Manage Bookings:** View all your bookings, check status, and cancel if needed

### For Hosts
- **Create Listings:** Add new properties with details, pricing, capacity, and images (URLs)
- **Booking Management:** View all booking requests across your properties
- **Accept/Decline:** Review and respond to booking requests
- **Track Bookings:** Monitor all bookings with status indicators (pending, accepted, declined, canceled)
- **Cancel Bookings:** Cancel accepted bookings when needed

### Additional Features
- **Pagination:** Browse properties with paginated results (9 per page)
- **Optimistic UI:** Instant feedback for favorite toggles with automatic rollback on errors
- **Skeleton Loading:** Polished loading states throughout the application
- **Responsive Design:** Fully functional on mobile, tablet, and desktop

## In Development
- [ ] Edit/update existing property listings
- [ ] Delete property listings
- [ ] Image upload (currently requires direct image URLs)
- [ ] E-Mail confirmation after sign-up
- [ ] AI enhancements for property description/title
- [ ] improved caching and cache invalidation
