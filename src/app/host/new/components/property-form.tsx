"use client";

import { getFormProps, useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod/v4";
import { MinusIcon, PlusIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useActionState } from "react";
import { createProperty } from "@/app/actions/properties";
import { Button } from "@/components/ui/button";
import {
  ConformField,
  ConformInput,
  ConformTextarea,
} from "@/components/ui/conform-form";
import { insertPropertySchema, maximumImagesPerProperty } from "@/lib/schemas";

interface PropertyFormProps {
  hostId: string;
}

export function PropertyForm({ hostId }: PropertyFormProps) {
  const router = useRouter();

  // Manage server action state
  const [lastResult, action, isPending] = useActionState(
    createProperty,
    undefined,
  );

  // Client-side validation
  const [form, fields] = useForm({
    lastResult,
    defaultValue: {
      images: [""],
    },
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: insertPropertySchema });
    },
  });

  const images = fields.images.getFieldList();

  return (
    <form action={action} className="space-y-8" {...getFormProps(form)}>
      <input type="hidden" name="hostId" value={hostId} />
      <input type="hidden" name="status" value="active" />
      <input type="hidden" name="country" value="USA" />

      {process.env.NODE_ENV === "development" && (
        <div className="flex justify-end">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => fillTestData(form.id)}
            className="text-xs"
          >
            Fill Test Data
          </Button>
        </div>
      )}

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Property Details</h2>

        <ConformField field={fields.name} label="Property Name">
          <ConformInput field={fields.name} placeholder="Cozy Downtown Loft" />
          {fields.name.errors}
        </ConformField>

        <ConformField field={fields.description} label="Description">
          <ConformTextarea
            field={fields.description}
            placeholder="Describe your property..."
            className="min-h-32"
          />
        </ConformField>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Location</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ConformField field={fields.street} label="Street Address">
            <ConformInput field={fields.street} placeholder="123 Main St" />
          </ConformField>

          <ConformField field={fields.city} label="City">
            <ConformInput field={fields.city} placeholder="San Francisco" />
          </ConformField>

          <ConformField field={fields.state} label="State">
            <ConformInput field={fields.state} placeholder="CA" />
          </ConformField>

          <ConformField field={fields.zipCode} label="Zip Code">
            <ConformInput field={fields.zipCode} placeholder="94102" />
          </ConformField>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Pricing & Capacity</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ConformField
            field={fields.pricePerNight}
            label="Price per Night ($)"
          >
            <ConformInput
              field={fields.pricePerNight}
              type="number"
              step="0.01"
              placeholder="150"
            />
          </ConformField>

          <ConformField field={fields.maxGuests} label="Max Guests">
            <ConformInput
              field={fields.maxGuests}
              type="number"
              placeholder="4"
            />
          </ConformField>

          <ConformField field={fields.numBedrooms} label="Bedrooms">
            <ConformInput
              field={fields.numBedrooms}
              type="number"
              placeholder="2"
            />
          </ConformField>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex justify-between">
          <h2 className="text-xl font-semibold">Images</h2>
          <div className="flex gap-1">
            <Button
              variant="outline"
              size="sm"
              disabled={images.length > maximumImagesPerProperty - 1}
              {...form.insert.getButtonProps({
                name: fields.images.name,
              })}
            >
              <PlusIcon />
            </Button>
            <Button
              variant="destructive"
              size="sm"
              disabled={images.length < 2}
              {...form.remove.getButtonProps({
                name: fields.images.name,
                index: images.length - 1,
              })}
            >
              <MinusIcon />
            </Button>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          Enter between 1 and {maximumImagesPerProperty} Unsplash image URLs
        </p>

        {images.map((image, index) => (
          <ConformField
            key={image.key}
            field={image}
            label={`Image ${index + 1}`}
          >
            <ConformInput
              field={image}
              placeholder="https://images.unsplash.com/..."
            />
          </ConformField>
        ))}
      </section>

      <div className="flex gap-4">
        <Button type="submit" disabled={isPending}>
          {isPending ? "Creating..." : "Create Listing"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isPending}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
