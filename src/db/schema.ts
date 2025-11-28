import {
	pgTable,
	serial,
	uuid,
	varchar,
	text,
	numeric,
	integer,
	pgEnum,
	timestamp,
	date,
	index,
	boolean,
} from "drizzle-orm/pg-core";

// Enums
export const propertyStatusEnum = pgEnum("property_status", [
	"active",
	"inactive",
]);

export const bookingStatusEnum = pgEnum("booking_status", [
	"pending",
	"accepted",
	"declined",
	"canceled",
]);

// Better Auth tables
export const user = pgTable("user", {
	id: uuid("id").primaryKey().defaultRandom(),
	name: text("name").notNull(),
	email: text("email").notNull().unique(),
	emailVerified: boolean("email_verified").notNull().default(false),
	image: text("image"),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at")
		.notNull()
		.defaultNow()
		.$onUpdate(() => new Date()),
});

export const session = pgTable("session", {
	id: uuid("id").primaryKey().defaultRandom(),
	expiresAt: timestamp("expires_at").notNull(),
	token: text("token").notNull().unique(),
	ipAddress: text("ip_address"),
	userAgent: text("user_agent"),
	userId: uuid("user_id")
		.notNull()
		.references(() => user.id, { onDelete: "cascade" }),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at")
		.notNull()
		.defaultNow()
		.$onUpdate(() => new Date()),
});

export const account = pgTable("account", {
	id: uuid("id").primaryKey().defaultRandom(),
	accountId: text("account_id").notNull(),
	providerId: text("provider_id").notNull(),
	userId: uuid("user_id")
		.notNull()
		.references(() => user.id, { onDelete: "cascade" }),
	accessToken: text("access_token"),
	refreshToken: text("refresh_token"),
	idToken: text("id_token"),
	expiresAt: timestamp("expires_at"),
	password: text("password"),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at")
		.notNull()
		.defaultNow()
		.$onUpdate(() => new Date()),
});

export const verification = pgTable("verification", {
	id: uuid("id").primaryKey().defaultRandom(),
	identifier: text("identifier").notNull(),
	value: text("value").notNull(),
	expiresAt: timestamp("expires_at").notNull(),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at")
		.notNull()
		.defaultNow()
		.$onUpdate(() => new Date()),
});

// Properties table
export const properties = pgTable(
	"properties",
	{
		id: serial("id").primaryKey(),
		hostId: uuid("host_id")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
		name: varchar("name", { length: 255 }).notNull(),
		description: text("description").notNull(),
		street: varchar("street", { length: 255 }).notNull(),
		city: varchar("city", { length: 100 }).notNull(),
		state: varchar("state", { length: 100 }).notNull(),
		country: varchar("country", { length: 100 }).notNull().default("USA"),
		zipCode: varchar("zip_code", { length: 20 }).notNull(),
		pricePerNight: numeric("price_per_night", {
			precision: 10,
			scale: 2,
		}).notNull(),
		maxGuests: integer("max_guests").notNull(),
		numBedrooms: integer("num_bedrooms").notNull(),
		images: text("images").array().notNull(),
		status: propertyStatusEnum("status").notNull().default("active"),
		createdAt: timestamp("created_at").notNull().defaultNow(),
		updatedAt: timestamp("updated_at")
			.notNull()
			.defaultNow()
			.$onUpdate(() => new Date()),
	},
	(table) => ({
		cityIdx: index("city_idx").on(table.city),
		priceIdx: index("price_idx").on(table.pricePerNight),
		maxGuestsIdx: index("max_guests_idx").on(table.maxGuests),
	}),
);

// Bookings table
export const bookings = pgTable(
	"bookings",
	{
		id: serial("id").primaryKey(),
		propertyId: integer("property_id")
			.notNull()
			.references(() => properties.id, { onDelete: "cascade" }),
		guestId: uuid("guest_id")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
		checkInDate: date("check_in_date").notNull(),
		checkOutDate: date("check_out_date").notNull(),
		status: bookingStatusEnum("status").notNull().default("pending"),
		totalPrice: numeric("total_price", { precision: 10, scale: 2 }).notNull(),
		createdAt: timestamp("created_at").notNull().defaultNow(),
		updatedAt: timestamp("updated_at")
			.notNull()
			.defaultNow()
			.$onUpdate(() => new Date()),
	},
	(table) => ({
		checkInIdx: index("check_in_idx").on(table.checkInDate),
		checkOutIdx: index("check_out_idx").on(table.checkOutDate),
		propertyIdIdx: index("property_id_idx").on(table.propertyId),
	}),
);

// Type exports for use in the application
export type User = typeof user.$inferSelect;
export type NewUser = typeof user.$inferInsert;
export type Session = typeof session.$inferSelect;
export type NewSession = typeof session.$inferInsert;
export type Account = typeof account.$inferSelect;
export type NewAccount = typeof account.$inferInsert;
export type Verification = typeof verification.$inferSelect;
export type NewVerification = typeof verification.$inferInsert;

export type Property = typeof properties.$inferSelect;
export type NewProperty = typeof properties.$inferInsert;
export type Booking = typeof bookings.$inferSelect;
export type NewBooking = typeof bookings.$inferInsert;
