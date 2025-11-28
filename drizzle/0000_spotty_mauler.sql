CREATE TYPE "public"."booking_status" AS ENUM('pending', 'accepted', 'declined', 'canceled');--> statement-breakpoint
CREATE TYPE "public"."property_status" AS ENUM('active', 'inactive');--> statement-breakpoint
CREATE TABLE "bookings" (
	"id" serial PRIMARY KEY NOT NULL,
	"property_id" integer NOT NULL,
	"guest_id" uuid NOT NULL,
	"check_in_date" date NOT NULL,
	"check_out_date" date NOT NULL,
	"status" "booking_status" DEFAULT 'pending' NOT NULL,
	"total_price" numeric(10, 2) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "properties" (
	"id" serial PRIMARY KEY NOT NULL,
	"host_id" uuid NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text NOT NULL,
	"street" varchar(255) NOT NULL,
	"city" varchar(100) NOT NULL,
	"state" varchar(100) NOT NULL,
	"country" varchar(100) DEFAULT 'USA' NOT NULL,
	"zip_code" varchar(20) NOT NULL,
	"price_per_night" numeric(10, 2) NOT NULL,
	"max_guests" integer NOT NULL,
	"num_bedrooms" integer NOT NULL,
	"images" text[] NOT NULL,
	"status" "property_status" DEFAULT 'active' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_property_id_properties_id_fk" FOREIGN KEY ("property_id") REFERENCES "public"."properties"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "check_in_idx" ON "bookings" USING btree ("check_in_date");--> statement-breakpoint
CREATE INDEX "check_out_idx" ON "bookings" USING btree ("check_out_date");--> statement-breakpoint
CREATE INDEX "property_id_idx" ON "bookings" USING btree ("property_id");--> statement-breakpoint
CREATE INDEX "city_idx" ON "properties" USING btree ("city");--> statement-breakpoint
CREATE INDEX "price_idx" ON "properties" USING btree ("price_per_night");--> statement-breakpoint
CREATE INDEX "max_guests_idx" ON "properties" USING btree ("max_guests");