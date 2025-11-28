# BeeBnB - Airbnb Clone MVP

Modern property rental platform built with Next.js 16 and Better-Auth.

## Tech Stack

- **Framework:** Next.js 16+ (App Router, React Server Components)
- **Database:** PostgreSQL (Neon) with Drizzle ORM *(Coming soon)*
- **Authentication:** Better-Auth *(UI implemented, integration pending)*
- **Styling:** Tailwind CSS v4 + shadcn/ui
- **Language:** TypeScript
- **Package Manager:** Bun
- **Code Quality:** Biome (formatting + linting)

## Current Status

**Implemented:**
- Full UI for all pages (Homepage, Search, Property Details, Host/Guest Dashboards, Auth)
- Mock data system with 10 properties and 5 bookings
- Responsive design (mobile, tablet, desktop)
- Form validation with React Hook Form + Zod

**In Progress:**
- Database integration (Drizzle + Neon)
- Better-Auth setup
- Server Actions for mutations

## Project Structure

```
src/
├── app/
│   ├── (auth)/          # Login and signup pages
│   ├── (marketing)/     # Homepage and search
│   ├── guest/           # Guest bookings dashboard
│   ├── host/            # Host dashboards (listings, bookings, new)
│   └── properties/      # Property detail pages
├── components/
│   ├── forms/           # Login, Signup, Property forms
│   ├── navigation/      # Header component
│   ├── property/        # Property cards, filters, carousel
│   ├── booking/         # Booking form and card
│   └── ui/              # shadcn/ui components
└── lib/
    ├── types.ts         # TypeScript interfaces
    └── mock-data.ts     # Mock properties and bookings
```

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) installed
- Node.js 18+

### Installation

```bash
# Install dependencies
bun install

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

### For Guests
- Browse and search properties
- Filter by location, price, guests
- View property details and availability
- Save interesting properties to favorites
- Submit booking requests
- Manage bookings

### For Hosts
- Create and manage property listings
- View booking requests
- Accept or decline bookings
- Track all bookings for properties

### User Favorites
- Save interesting properties to favorites
- Toggle favorites from search results and detail pages
- Dedicated "My Favorites" page for easy access
- Persistent favorites across sessions

## Environment Variables (Coming soon)

```env
DATABASE_URL=          # Neon PostgreSQL connection string
BETTER_AUTH_SECRET=    # Better-Auth session secret
BETTER_AUTH_URL=       # Application URL
```

## Routes

- `/` - Homepage with property listings and search
- `/login` - User login
- `/signup` - User registration
- `/properties/[id]` - Property details
- `/search` - Search results
- `/host/listings` - Host's properties
- `/host/bookings` - Host's booking requests
- `/host/new` - Create new property
- `/guest/bookings` - Guest's bookings
- `/guest/favorites` - Guest's saved properties

## Contributing

Please read [CLAUDE.md](./CLAUDE.md) for development standards and patterns.
