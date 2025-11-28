import { db } from "./index";
import { user, properties, bookings } from "./schema";

async function verify() {
	console.log("🔍 Verifying seeded data...\n");

	try {
		// Count users
		const users = await db.select().from(user);
		console.log(`✓ Users: ${users.length}`);
		users.forEach((u) => console.log(`  - ${u.name} (${u.email})`));

		// Count properties
		const props = await db.select().from(properties);
		console.log(`\n✓ Properties: ${props.length}`);
		props.forEach((p) => console.log(`  - ${p.name} in ${p.city}, ${p.state}`));

		// Count bookings
		const books = await db.select().from(bookings);
		console.log(`\n✓ Bookings: ${books.length}`);
		books.forEach((b) =>
			console.log(`  - ${b.status} | ${b.checkInDate} to ${b.checkOutDate}`),
		);

		console.log("\n✅ Verification complete!");
	} catch (error) {
		console.error("❌ Error verifying data:", error);
		throw error;
	}
}

verify()
	.then(() => process.exit(0))
	.catch(() => process.exit(1));
