import type { Booking, Property, User } from "./types";

export const mockUsers: User[] = [
  {
    id: "user-1",
    name: "John Host",
    email: "host@example.com",
    role: "host",
  },
  {
    id: "user-2",
    name: "Jane Guest",
    email: "guest@example.com",
    role: "guest",
  },
];

export const mockProperties: Property[] = [
  {
    id: "prop-1",
    hostId: "user-1",
    name: "Cozy Downtown Loft",
    description:
      "Beautiful loft in the heart of downtown with stunning city views. Perfect for business travelers or couples looking for a romantic getaway. Features modern amenities and walking distance to restaurants.",
    address: {
      street: "123 Main St",
      city: "San Francisco",
      state: "CA",
      country: "USA",
      zipCode: "94102",
    },
    pricePerNight: 150,
    maxGuests: 4,
    numBedrooms: 2,
    images: [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800",
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800",
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800",
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800",
      "https://images.unsplash.com/photo-1494203484021-3c454daf695d?w=800",
    ],
    status: "active",
    createdAt: "2025-01-15T10:00:00Z",
  },
  {
    id: "prop-2",
    hostId: "user-1",
    name: "Modern Brooklyn Apartment",
    description:
      "Stylish apartment in trendy Brooklyn neighborhood. Close to subway, cafes, and art galleries. Perfect for exploring NYC while enjoying a quiet retreat.",
    address: {
      street: "456 Bedford Ave",
      city: "New York",
      state: "NY",
      country: "USA",
      zipCode: "11249",
    },
    pricePerNight: 200,
    maxGuests: 6,
    numBedrooms: 3,
    images: [
      "https://images.unsplash.com/photo-1522156373667-4c7234bbd804?w=800",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800",
      "https://images.unsplash.com/photo-1560448204-603b3fc33ddc?w=800",
      "https://images.unsplash.com/photo-1560448204-444092e8d3bf?w=800",
    ],
    status: "active",
    createdAt: "2025-01-10T14:30:00Z",
  },
  {
    id: "prop-3",
    hostId: "user-1",
    name: "Charming Austin Cottage",
    description:
      "Quaint cottage with southern charm in East Austin. Backyard garden, front porch swing, and walking distance to music venues. Experience Austin like a local.",
    address: {
      street: "789 E 6th St",
      city: "Austin",
      state: "TX",
      country: "USA",
      zipCode: "78702",
    },
    pricePerNight: 120,
    maxGuests: 4,
    numBedrooms: 2,
    images: [
      "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800",
      "https://images.unsplash.com/photo-1565538810643-b5bdb714032a?w=800",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800",
    ],
    status: "active",
    createdAt: "2025-01-12T09:15:00Z",
  },
  {
    id: "prop-4",
    hostId: "user-1",
    name: "Seattle Waterfront Condo",
    description:
      "Stunning views of Puget Sound from this modern condo. Floor-to-ceiling windows, gourmet kitchen, and steps from Pike Place Market. Luxury meets convenience.",
    address: {
      street: "101 Pike St",
      city: "Seattle",
      state: "WA",
      country: "USA",
      zipCode: "98101",
    },
    pricePerNight: 250,
    maxGuests: 4,
    numBedrooms: 2,
    images: [
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800",
      "https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=800",
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800",
      "https://images.unsplash.com/photo-1600573472592-401b489a3cdc?w=800",
    ],
    status: "active",
    createdAt: "2025-01-08T16:45:00Z",
  },
  {
    id: "prop-5",
    hostId: "user-1",
    name: "Miami Beach Penthouse",
    description:
      "Luxurious penthouse with private rooftop pool and ocean views. Walk to South Beach, world-class dining, and nightlife. The ultimate Miami experience.",
    address: {
      street: "555 Ocean Dr",
      city: "Miami Beach",
      state: "FL",
      country: "USA",
      zipCode: "33139",
    },
    pricePerNight: 350,
    maxGuests: 8,
    numBedrooms: 4,
    images: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800",
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800",
      "https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=800",
    ],
    status: "active",
    createdAt: "2025-01-05T11:20:00Z",
  },
  {
    id: "prop-6",
    hostId: "user-1",
    name: "Denver Mountain Retreat",
    description:
      "Cozy mountain cabin minutes from downtown Denver. Perfect base for skiing, hiking, or relaxing by the fireplace. Combine city and nature in one trip.",
    address: {
      street: "222 Mountain Rd",
      city: "Denver",
      state: "CO",
      country: "USA",
      zipCode: "80202",
    },
    pricePerNight: 180,
    maxGuests: 6,
    numBedrooms: 3,
    images: [
      "https://images.unsplash.com/photo-1587061949409-02df41d5e562?w=800",
      "https://images.unsplash.com/photo-1542718610-a1d656d1884c?w=800",
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800",
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800",
    ],
    status: "active",
    createdAt: "2025-01-07T13:40:00Z",
  },
  {
    id: "prop-7",
    hostId: "user-1",
    name: "Portland Pearl District Studio",
    description:
      "Minimalist studio in the trendy Pearl District. Walk to Powell's Books, restaurants, and galleries. Perfect for solo travelers or couples exploring Portland.",
    address: {
      street: "888 NW 10th Ave",
      city: "Portland",
      state: "OR",
      country: "USA",
      zipCode: "97209",
    },
    pricePerNight: 90,
    maxGuests: 2,
    numBedrooms: 1,
    images: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800",
      "https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=800",
      "https://images.unsplash.com/photo-1554995207-c18c203602cb?w=800",
      "https://images.unsplash.com/photo-1565182999561-18d7dc61c393?w=800",
    ],
    status: "active",
    createdAt: "2025-01-14T08:30:00Z",
  },
  {
    id: "prop-8",
    hostId: "user-1",
    name: "Boston Historic Brownstone",
    description:
      "Historic brownstone in Back Bay with original details and modern updates. Steps from Newbury Street shopping and public gardens. Experience Boston's rich history.",
    address: {
      street: "333 Commonwealth Ave",
      city: "Boston",
      state: "MA",
      country: "USA",
      zipCode: "02116",
    },
    pricePerNight: 220,
    maxGuests: 5,
    numBedrooms: 3,
    images: [
      "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800",
      "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800",
      "https://images.unsplash.com/photo-1600047509358-9dc75507daeb?w=800",
      "https://images.unsplash.com/photo-1600585152915-d208bec867a1?w=800",
    ],
    status: "active",
    createdAt: "2025-01-09T15:10:00Z",
  },
  {
    id: "prop-9",
    hostId: "user-1",
    name: "Nashville Music Row Loft",
    description:
      "Industrial loft on Music Row with vintage charm. Walking distance to honky-tonks, recording studios, and live music venues. Sleep where the stars stay.",
    address: {
      street: "777 Broadway",
      city: "Nashville",
      state: "TN",
      country: "USA",
      zipCode: "37203",
    },
    pricePerNight: 140,
    maxGuests: 4,
    numBedrooms: 2,
    images: [
      "https://images.unsplash.com/photo-1556912998-c57cc6b63cd7?w=800",
      "https://images.unsplash.com/photo-1556912173-3bb406ef7e77?w=800",
      "https://images.unsplash.com/photo-1560184897-ae75f418493e?w=800",
      "https://images.unsplash.com/photo-1600566752229-250ed79470f6?w=800",
    ],
    status: "active",
    createdAt: "2025-01-11T12:00:00Z",
  },
  {
    id: "prop-10",
    hostId: "user-1",
    name: "Chicago Loop High-Rise",
    description:
      "Sleek high-rise apartment in the Loop with panoramic city views. Close to Millennium Park, museums, and the Riverwalk. Luxury in the heart of Chicago.",
    address: {
      street: "100 S Michigan Ave",
      city: "Chicago",
      state: "IL",
      country: "USA",
      zipCode: "60603",
    },
    pricePerNight: 190,
    maxGuests: 4,
    numBedrooms: 2,
    images: [
      "https://images.unsplash.com/photo-1600585154363-67eb9e2e2099?w=800",
      "https://images.unsplash.com/photo-1600585152220-5d3ab0e52f93?w=800",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800",
    ],
    status: "active",
    createdAt: "2025-01-06T10:25:00Z",
  },
];

export const mockBookings: Booking[] = [
  {
    id: "book-1",
    propertyId: "prop-1",
    guestId: "user-2",
    checkInDate: "2025-12-01",
    checkOutDate: "2025-12-05",
    status: "pending",
    totalPrice: 600,
    createdAt: "2025-11-20T14:30:00Z",
  },
  {
    id: "book-2",
    propertyId: "prop-2",
    guestId: "user-2",
    checkInDate: "2025-12-10",
    checkOutDate: "2025-12-15",
    status: "accepted",
    totalPrice: 1000,
    createdAt: "2025-11-18T09:15:00Z",
  },
  {
    id: "book-3",
    propertyId: "prop-3",
    guestId: "user-2",
    checkInDate: "2025-11-15",
    checkOutDate: "2025-11-18",
    status: "declined",
    totalPrice: 360,
    createdAt: "2025-11-10T16:45:00Z",
  },
  {
    id: "book-4",
    propertyId: "prop-4",
    guestId: "user-2",
    checkInDate: "2025-12-20",
    checkOutDate: "2025-12-27",
    status: "accepted",
    totalPrice: 1750,
    createdAt: "2025-11-25T11:20:00Z",
  },
  {
    id: "book-5",
    propertyId: "prop-5",
    guestId: "user-2",
    checkInDate: "2025-11-01",
    checkOutDate: "2025-11-05",
    status: "canceled",
    totalPrice: 1400,
    createdAt: "2025-10-28T13:40:00Z",
  },
];

export function getPropertyById(id: string): Property | undefined {
  return mockProperties.find((p) => p.id === id);
}

export function getBookingsByPropertyId(propertyId: string): Booking[] {
  return mockBookings.filter((b) => b.propertyId === propertyId);
}

export function getBookingsByGuestId(guestId: string): Booking[] {
  return mockBookings.filter((b) => b.guestId === guestId);
}

export function getBookingsByHostId(hostId: string): Booking[] {
  const hostPropertyIds = mockProperties
    .filter((p) => p.hostId === hostId)
    .map((p) => p.id);
  return mockBookings.filter((b) => hostPropertyIds.includes(b.propertyId));
}
