# 📝 BeeBnB (AirBnB Clone) Minimum Viable Product (MVP) Specification

## 1. Overview & Scope

This document defines the functional and technical requirements for the BeeBnB MVP. The platform connects Hosts and Guests for property rentals.

**Key Scope Decisions:**
* **Revenue Model:** The platform is **free of charge**; no monetary transactions are processed in the MVP.
* **Focus:** The MVP focuses on the core loop: **Listing, Searching, Requesting, and Managing Bookings.**

## 2. User Roles & Goals

| Role | Description | Primary MVP Goals |
| :--- | :--- | :--- |
| **Not Logged In User** | Can browse the site but cannot perform transactions. | View the homepage, search/filter properties, Register/Log in. |
| **Guest** | Logged-in user who books properties. | Search, view details, check availability, and submit a booking request. |
| **Host** | Logged-in user who lists and manages properties. | Create and update property listings. Accept or decline pending booking requests. |

## 3. Functional Requirements (User Stories)

### 3.1. General & Authentication

| ID | User Story | Acceptance Criteria |
| :--- | :--- | :--- |
| **G-1** | As a user, I can **register** and **log in/log out**. | Authentication is handled by Better-Auth using email and password. |
| **G-2** | As any user, I can **view all listed properties**. | The homepage displays an initial feed of all currently active property listings. |

### 3.2. Search & Browsing

| ID | User Story | Acceptance Criteria |
| :--- | :--- | :--- |
| **S-1** | As a user, I can **search/filter properties** using core parameters. | Filters include **Location, Check-in/Check-out Dates, Price Range, and Number of Guests**. |
| **S-2** | As a user, I can **view a property's details**. | I can see the **Name, Description, Address, Price per Night, Max Guests, Number of Bedrooms**, and **1-10 associated images**. |
| **S-3** | As a user, I can **view property availability**. | The property detail page displays an interactive calendar where **unavailable dates are grayed out and unselectable**. |

### 3.3. Property Management (Host)

| ID | User Story | Acceptance Criteria |
| :--- | :--- | :--- |
| **H-1** | As a Host, I can **create a new property listing**. | I must submit the following required fields: **Name, Description, Address, Price per Night, Max Guests, Number of Bedrooms**, and provide **1 to 10 images**. |
| **H-2** | As a Host, I can **update an existing property listing**. | I can modify any field on my active listing. |

### 3.4. Property Favorites

**User Story**: As a logged-in user, I want to save properties to my favorites so I can easily find and compare them later.

**Acceptance Criteria**:
- Users must be logged in to favorite properties
- Heart icon button appears on:
  - Property cards in search results
  - Property detail pages
- Visual feedback when favorited (filled heart vs outline)
- Clicking heart toggles favorite status
- "My Favorites" page shows all saved properties
- Favorites persist across sessions
- Users can only manage their own favorites
- No duplicate favorites allowed (enforced at database level)

**User Flows**:
1. **Adding a Favorite**:
   - User clicks heart icon on property card/detail page
   - Icon fills in, indicating favorited status
   - Toast notification: "Added to favorites"
   - Property appears in "My Favorites" page

2. **Removing a Favorite**:
   - User clicks filled heart icon
   - Icon becomes outline, indicating not favorited
   - Toast notification: "Removed from favorites"
   - Property removed from "My Favorites" page

3. **Viewing Favorites**:
   - User navigates to "My Favorites" from navigation menu
   - See all favorited properties in grid layout
   - Each card shows favorite status (filled heart)
   - Empty state message if no favorites yet

**Non-Functional Requirements**:
- Heart icon toggle must be responsive (< 300ms)
- Favorites page loads in < 2 seconds
- Optimistic UI updates (instant visual feedback)
- Server-side validation prevents race conditions

### 3.5. Booking Management (Guest & Host)

| ID | User Story | Acceptance Criteria |
| :--- | :--- | :--- |
| **B-1** | As a Guest, I can **submit a booking request**. | The booking status is initially **Pending**. |
| **B-2** | As a Host, I can **manage booking requests**. | I can view requests and change the status to **Accepted** or **Declined**. |
| **B-3** | **System Automation:** Availability is managed automatically. | Upon **Acceptance**, the booked dates are **blocked**. Upon **Decline** or **Cancellation**, the dates are **freed up**. |
| **B-4** | **Booking Statuses:** The system supports the following statuses. | **Pending, Accepted, Declined, Canceled**. |

---

## 4. Technical Specification

### 4.1. Core Technology Stack

| Component | Technology | Use |
| :--- | :--- | :--- |
| **Architecture** | **Traditional Full-Stack** | Next.js Server Components (RSCs) eliminate the need for a separate API. |
| **Framework** | **Next.js 16+** | Primary application framework utilizing RSCs, Caching, and Server Actions. |
| **Database** | **Postgres (Neon)** | The core relational data store. |
| **ORM** | **Drizzle** | Type-safe schema definition and querying. |
| **Authentication** | **Better-Auth** | Email/Password authentication and session management. |
| **Styling** | **Tailwind CSS & shadcn/ui** | Component library and utility-first styling for UI development. |

### 4.2. Next.js Rendering Strategy

| Page / Component | Rendering Method | Rationale |
| :--- | :--- | :--- |
| **Property Listing / Search Results** | **ISR (with revalidate)** | High performance, uses Next.js Cache for the property data list. |
| **Date/Availability Calendar** | **Dynamic Rendering / Suspense** | Must be fresh data. Rendered dynamically within a Suspense Boundary to avoid caching stale availability. |
| **Property Detail Page** | **SSR** | Ensures single property data and associated images are always fresh. |
| **Mutations (Booking, Listing)** | **Server Actions** | Used for all write operations to ensure security and direct database interaction. |

### 4.3. Performance & Data Flow

* **Goal:** "As fast as possible," aiming for search results in under 1 second.
* **Strategy:** Heavy reliance on **Next.js Caching** and **ISR** for read-heavy pages. Queries must be optimized with appropriate Postgres indexes.
* **Consistency:** **Slight delay is acceptable**, confirming that standard Postgres transaction handling meets reliability requirements.

---

## 5. Data Model Specification (Drizzle/Postgres)

### 5.1. `properties` Table

| Field | Type | Constraint / Description |
| :--- | :--- | :--- |
| `id` | Serial (PK) | Primary Key. |
| `hostId` | UUID (FK) | Links to Better-Auth user ID. |
| `name` | Varchar | Required. |
| `description` | Text | Required. |
| `street` | Varchar | Required. |
| `city` | Varchar | Required (indexed for search). |
| `state` | Varchar | Required. |
| `country` | Varchar | Required. Default: 'USA'. |
| `zipCode` | Varchar | Required. |
| `pricePerNight` | Numeric | Required (indexed for range search). |
| `maxGuests` | Integer | Required (indexed for filtering). |
| `numBedrooms` | Integer | Required. |
| `images` | Text[] | Array of 1-10 image URLs. Required (minimum 1). |
| `status` | Enum | 'active' or 'inactive'. Default: 'active'. |
| `createdAt` | Timestamp | Auto-generated creation timestamp. |
| `updatedAt` | Timestamp | Auto-updated modification timestamp. |

### 5.2. `bookings` Table

| Field | Type | Constraint / Description |
| :--- | :--- | :--- |
| `id` | Serial (PK) | Primary Key. |
| `propertyId` | Integer (FK) | Links to `properties.id`. |
| `guestId` | UUID (FK) | Links to Better-Auth user ID. |
| `checkInDate` | Date | Required start date (indexed). |
| `checkOutDate` | Date | Required end date (indexed). |
| `status` | Enum | **Pending, Accepted, Declined, Canceled**. |
| `totalPrice` | Numeric | Total booking price (calculated at creation). |
| `createdAt` | Timestamp | Auto-generated creation timestamp. |
| `updatedAt` | Timestamp | Auto-updated modification timestamp. |

---

## 6. Security Requirements

* **Authentication:** Must be exclusively handled by the **Better-Auth** service.
* **Authorization:** All Server Actions must enforce role-based access control (e.g., only a logged-in Host can execute the `createProperty` action).
* **Data Isolation:** Hosts can only see and modify their own listings and the bookings associated with them. Guests can only see their own bookings.
