"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { getPropertyById } from "@/db/queries";
import { properties } from "@/db/schema";
import { getSession } from "@/lib/auth-server";
import { insertPropertySchema } from "@/lib/schemas";

export async function createProperty(formData: FormData) {
  try {
    // Check authentication
    const session = await getSession();
    if (!session?.user) {
      return {
        success: false,
        error: "You must be logged in to create a property",
      };
    }

    // Extract data from FormData
    const rawData = {
      hostId: formData.get("hostId") as string,
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      street: formData.get("street") as string,
      city: formData.get("city") as string,
      state: formData.get("state") as string,
      country: (formData.get("country") as string) || "USA",
      zipCode: formData.get("zipCode") as string,
      pricePerNight: formData.get("pricePerNight") as string,
      maxGuests: Number(formData.get("maxGuests")),
      numBedrooms: Number(formData.get("numBedrooms")),
      images: JSON.parse(formData.get("images") as string) as string[],
      status: "active" as const,
    };

    // Verify the hostId matches the authenticated user
    if (rawData.hostId !== session.user.id) {
      return {
        success: false,
        error: "Unauthorized: You can only create properties for yourself",
      };
    }

    // Validate with Zod schema
    const validatedData = insertPropertySchema.parse(rawData);

    // Insert into database
    const [newProperty] = await db
      .insert(properties)
      .values(validatedData)
      .returning();

    // Revalidate the host listings page
    revalidatePath("/host/listings");

    return {
      success: true,
      propertyId: newProperty.id.toString(),
    };
  } catch (error) {
    console.error("Error creating property:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to create property",
    };
  }
}

export async function updateProperty(propertyId: number, formData: FormData) {
  try {
    // Check authentication
    const session = await getSession();
    if (!session?.user) {
      return {
        success: false,
        error: "You must be logged in to update a property",
      };
    }

    // Verify the property belongs to the authenticated user
    const property = await getPropertyById(propertyId);
    if (!property) {
      return {
        success: false,
        error: "Property not found",
      };
    }

    if (property.hostId !== session.user.id) {
      return {
        success: false,
        error: "Unauthorized: You can only update your own properties",
      };
    }

    // Extract data from FormData
    const rawData = {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      street: formData.get("street") as string,
      city: formData.get("city") as string,
      state: formData.get("state") as string,
      country: (formData.get("country") as string) || "USA",
      zipCode: formData.get("zipCode") as string,
      pricePerNight: formData.get("pricePerNight") as string,
      maxGuests: Number(formData.get("maxGuests")),
      numBedrooms: Number(formData.get("numBedrooms")),
      images: JSON.parse(formData.get("images") as string) as string[],
    };

    // Validate with Zod schema (omit hostId since we're updating)
    const validatedData = insertPropertySchema
      .omit({ hostId: true })
      .parse(rawData);

    // Update in database
    await db
      .update(properties)
      .set(validatedData)
      .where(eq(properties.id, propertyId));

    // Revalidate pages
    revalidatePath("/host/listings");
    revalidatePath(`/properties/${propertyId}`);

    return {
      success: true,
    };
  } catch (error) {
    console.error("Error updating property:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to update property",
    };
  }
}

export async function deleteProperty(propertyId: number) {
  try {
    // Check authentication
    const session = await getSession();
    if (!session?.user) {
      return {
        success: false,
        error: "You must be logged in to delete a property",
      };
    }

    // Verify the property belongs to the authenticated user
    const property = await getPropertyById(propertyId);
    if (!property) {
      return {
        success: false,
        error: "Property not found",
      };
    }

    if (property.hostId !== session.user.id) {
      return {
        success: false,
        error: "Unauthorized: You can only delete your own properties",
      };
    }

    await db.delete(properties).where(eq(properties.id, propertyId));

    // Revalidate the host listings page
    revalidatePath("/host/listings");

    return {
      success: true,
    };
  } catch (error) {
    console.error("Error deleting property:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to delete property",
    };
  }
}
