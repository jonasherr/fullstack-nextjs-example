import { db } from "./index";
import { user, account, properties, bookings } from "./schema";
import crypto from "node:crypto";

// Simple password hashing function (for seeding only)
function hashPassword(password: string): string {
	return crypto.createHash("sha256").update(password).digest("hex");
}

async function seed() {
	console.log("🌱 Seeding database...");

	try {
		// Create users directly in database
		console.log("Creating users...");

		const [hostUser, guestUser] = await db
			.insert(user)
			.values([
				{
					name: "John Host",
					email: "host@example.com",
					emailVerified: true,
				},
				{
					name: "Jane Guest",
					email: "guest@example.com",
					emailVerified: true,
				},
			])
			.returning();

		// Create account entries with hashed passwords for email/password auth
		await db.insert(account).values([
			{
				accountId: hostUser.email,
				providerId: "credential",
				userId: hostUser.id,
				password: hashPassword("password123"),
			},
			{
				accountId: guestUser.email,
				providerId: "credential",
				userId: guestUser.id,
				password: hashPassword("password123"),
			},
		]);

		console.log(`✓ Created host user: ${hostUser.email}`);
		console.log(`✓ Created guest user: ${guestUser.email}`);

		// Create properties
		console.log("\nCreating properties...");

		const propertyData = [
			{
				hostId: hostUser.id,
				name: "Cozy Downtown Loft",
				description:
					"Beautiful loft in the heart of downtown with stunning city views. Perfect for business travelers or couples looking for a romantic getaway. Features modern amenities and walking distance to restaurants.",
				street: "123 Main St",
				city: "San Francisco",
				state: "CA",
				country: "USA",
				zipCode: "94102",
				pricePerNight: "150",
				maxGuests: 4,
				numBedrooms: 2,
				images: [
					"https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800",
					"https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800",
					"https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800",
					"https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800",
					"https://images.unsplash.com/photo-1494203484021-3c454daf695d?w=800",
				],
			},
			{
				hostId: hostUser.id,
				name: "Modern Brooklyn Apartment",
				description:
					"Stylish apartment in trendy Brooklyn neighborhood. Close to subway, cafes, and art galleries. Perfect for exploring NYC while enjoying a quiet retreat.",
				street: "456 Bedford Ave",
				city: "New York",
				state: "NY",
				country: "USA",
				zipCode: "11249",
				pricePerNight: "200",
				maxGuests: 6,
				numBedrooms: 3,
				images: [
					"https://images.unsplash.com/photo-1522156373667-4c7234bbd804?w=800",
					"https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800",
					"https://images.unsplash.com/photo-1560448204-603b3fc33ddc?w=800",
					"https://images.unsplash.com/photo-1560448204-444092e8d3bf?w=800",
				],
			},
			{
				hostId: hostUser.id,
				name: "Charming Austin Cottage",
				description:
					"Quaint cottage with southern charm in East Austin. Backyard garden, front porch swing, and walking distance to music venues. Experience Austin like a local.",
				street: "789 E 6th St",
				city: "Austin",
				state: "TX",
				country: "USA",
				zipCode: "78702",
				pricePerNight: "120",
				maxGuests: 4,
				numBedrooms: 2,
				images: [
					"https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800",
					"https://images.unsplash.com/photo-1565538810643-b5bdb714032a?w=800",
					"https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800",
					"https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800",
				],
			},
			{
				hostId: hostUser.id,
				name: "Seattle Waterfront Condo",
				description:
					"Stunning views of Puget Sound from this modern condo. Floor-to-ceiling windows, gourmet kitchen, and steps from Pike Place Market. Luxury meets convenience.",
				street: "101 Pike St",
				city: "Seattle",
				state: "WA",
				country: "USA",
				zipCode: "98101",
				pricePerNight: "250",
				maxGuests: 4,
				numBedrooms: 2,
				images: [
					"https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800",
					"https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=800",
					"https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800",
					"https://images.unsplash.com/photo-1600573472592-401b489a3cdc?w=800",
				],
			},
			{
				hostId: hostUser.id,
				name: "Miami Beach Penthouse",
				description:
					"Luxurious penthouse with private rooftop pool and ocean views. Walk to South Beach, world-class dining, and nightlife. The ultimate Miami experience.",
				street: "555 Ocean Dr",
				city: "Miami Beach",
				state: "FL",
				country: "USA",
				zipCode: "33139",
				pricePerNight: "350",
				maxGuests: 8,
				numBedrooms: 4,
				images: [
					"https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800",
					"https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800",
					"https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800",
					"https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=800",
				],
			},
			{
				hostId: hostUser.id,
				name: "Denver Mountain Retreat",
				description:
					"Cozy mountain cabin minutes from downtown Denver. Perfect base for skiing, hiking, or relaxing by the fireplace. Combine city and nature in one trip.",
				street: "222 Mountain Rd",
				city: "Denver",
				state: "CO",
				country: "USA",
				zipCode: "80202",
				pricePerNight: "180",
				maxGuests: 6,
				numBedrooms: 3,
				images: [
					"https://images.unsplash.com/photo-1587061949409-02df41d5e562?w=800",
					"https://images.unsplash.com/photo-1542718610-a1d656d1884c?w=800",
					"https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800",
					"https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800",
				],
			},
			{
				hostId: hostUser.id,
				name: "Portland Pearl District Studio",
				description:
					"Minimalist studio in the trendy Pearl District. Walk to Powell's Books, restaurants, and galleries. Perfect for solo travelers or couples exploring Portland.",
				street: "888 NW 10th Ave",
				city: "Portland",
				state: "OR",
				country: "USA",
				zipCode: "97209",
				pricePerNight: "90",
				maxGuests: 2,
				numBedrooms: 1,
				images: [
					"https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800",
					"https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=800",
					"https://images.unsplash.com/photo-1554995207-c18c203602cb?w=800",
					"https://images.unsplash.com/photo-1565182999561-18d7dc61c393?w=800",
				],
			},
			{
				hostId: hostUser.id,
				name: "Boston Historic Brownstone",
				description:
					"Historic brownstone in Back Bay with original details and modern updates. Steps from Newbury Street shopping and public gardens. Experience Boston's rich history.",
				street: "333 Commonwealth Ave",
				city: "Boston",
				state: "MA",
				country: "USA",
				zipCode: "02116",
				pricePerNight: "220",
				maxGuests: 5,
				numBedrooms: 3,
				images: [
					"https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800",
					"https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800",
					"https://images.unsplash.com/photo-1600047509358-9dc75507daeb?w=800",
					"https://images.unsplash.com/photo-1600585152915-d208bec867a1?w=800",
				],
			},
			{
				hostId: hostUser.id,
				name: "Nashville Music Row Loft",
				description:
					"Industrial loft on Music Row with vintage charm. Walking distance to honky-tonks, recording studios, and live music venues. Sleep where the stars stay.",
				street: "777 Broadway",
				city: "Nashville",
				state: "TN",
				country: "USA",
				zipCode: "37203",
				pricePerNight: "140",
				maxGuests: 4,
				numBedrooms: 2,
				images: [
					"https://images.unsplash.com/photo-1556912998-c57cc6b63cd7?w=800",
					"https://images.unsplash.com/photo-1556912173-3bb406ef7e77?w=800",
					"https://images.unsplash.com/photo-1560184897-ae75f418493e?w=800",
					"https://images.unsplash.com/photo-1600566752229-250ed79470f6?w=800",
				],
			},
			{
				hostId: hostUser.id,
				name: "Chicago Loop High-Rise",
				description:
					"Sleek high-rise apartment in the Loop with panoramic city views. Close to Millennium Park, museums, and the Riverwalk. Luxury in the heart of Chicago.",
				street: "100 S Michigan Ave",
				city: "Chicago",
				state: "IL",
				country: "USA",
				zipCode: "60603",
				pricePerNight: "190",
				maxGuests: 4,
				numBedrooms: 2,
				images: [
					"https://images.unsplash.com/photo-1600585154363-67eb9e2e2099?w=800",
					"https://images.unsplash.com/photo-1600585152220-5d3ab0e52f93?w=800",
					"https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800",
					"https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800",
				],
			},
		];

		const insertedProperties = await db
			.insert(properties)
			.values(propertyData)
			.returning();

		console.log(`✓ Created ${insertedProperties.length} properties`);

		// Create bookings
		console.log("\nCreating bookings...");

		const bookingData = [
			{
				propertyId: insertedProperties[0].id,
				guestId: guestUser.id,
				checkInDate: "2025-12-01",
				checkOutDate: "2025-12-05",
				status: "pending" as const,
				totalPrice: "600",
			},
			{
				propertyId: insertedProperties[1].id,
				guestId: guestUser.id,
				checkInDate: "2025-12-10",
				checkOutDate: "2025-12-15",
				status: "accepted" as const,
				totalPrice: "1000",
			},
			{
				propertyId: insertedProperties[2].id,
				guestId: guestUser.id,
				checkInDate: "2025-11-15",
				checkOutDate: "2025-11-18",
				status: "declined" as const,
				totalPrice: "360",
			},
			{
				propertyId: insertedProperties[3].id,
				guestId: guestUser.id,
				checkInDate: "2025-12-20",
				checkOutDate: "2025-12-27",
				status: "accepted" as const,
				totalPrice: "1750",
			},
			{
				propertyId: insertedProperties[4].id,
				guestId: guestUser.id,
				checkInDate: "2025-11-01",
				checkOutDate: "2025-11-05",
				status: "canceled" as const,
				totalPrice: "1400",
			},
		];

		const insertedBookings = await db
			.insert(bookings)
			.values(bookingData)
			.returning();

		console.log(`✓ Created ${insertedBookings.length} bookings`);

		console.log("\n✅ Database seeded successfully!");
		console.log("\nTest credentials:");
		console.log("Host: host@example.com / password123");
		console.log("Guest: guest@example.com / password123");
	} catch (error) {
		console.error("❌ Error seeding database:", error);
		throw error;
	}
}

seed()
	.then(() => {
		console.log("\n✨ Seed completed");
		process.exit(0);
	})
	.catch((error) => {
		console.error("\n💥 Seed failed:", error);
		process.exit(1);
	});
