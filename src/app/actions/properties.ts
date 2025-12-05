"use server";

import { parseWithZod } from "@conform-to/zod/v4";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { properties } from "@/db/schema";
import { getSession } from "@/lib/auth-server";
import { insertPropertySchema } from "@/lib/schemas";

export async function createProperty(_prevState: unknown, formData: FormData) {
  const submission = parseWithZod(formData, {
    schema: insertPropertySchema,
  });

  // Return validation errors
  if (submission.status !== "success") {
    return submission.reply();
  }

  try {
    // Check authentication
    const session = await getSession();
    if (!session?.user) {
      return submission.reply({
        formErrors: ["You must be logged in to create a property"],
      });
    }

    // Access fully typed, validated data
    const formDataValues = submission.value;

    // Verify authorization
    if (formDataValues.hostId !== session.user.id) {
      return submission.reply({
        formErrors: [
          "Unauthorized: You can only create properties for yourself",
        ],
      });
    }

    // pricePerNight: formDataValues.pricePerNight.toFixed(2),

    // Validate DB schema
    const validatedData = insertPropertySchema.parse(formDataValues);

    // Insert into database
    await db.insert(properties).values(validatedData);
  } catch (error) {
    console.error("Error creating property:", error);
    return submission.reply({
      formErrors: [
        error instanceof Error ? error.message : "Failed to create property",
      ],
    });
  }

  // Revalidate the host listings page
  revalidatePath("/host/listings");
  redirect("/host/listings");
}
