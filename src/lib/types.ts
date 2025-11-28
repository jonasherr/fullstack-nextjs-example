export type PropertyStatus = "active" | "inactive";
export type BookingStatus = "pending" | "accepted" | "declined" | "canceled";

export interface Property {
  id: string;
  hostId: string;
  name: string;
  description: string;
  address: {
    street: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
  };
  pricePerNight: number;
  maxGuests: number;
  numBedrooms: number;
  images: string[];
  status: PropertyStatus;
  createdAt: string;
}

export interface Booking {
  id: string;
  propertyId: string;
  guestId: string;
  checkInDate: string;
  checkOutDate: string;
  status: BookingStatus;
  totalPrice: number;
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: "host" | "guest";
}
