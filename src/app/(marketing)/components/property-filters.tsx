"use client";

import { getFormProps, useForm } from "@conform-to/react";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ConformField, ConformInput } from "@/components/ui/conform-form";

export function PropertyFilters() {
  const router = useRouter();

  const [form, fields] = useForm({
    onSubmit(event, { formData }) {
      event.preventDefault();

      const params = new URLSearchParams();
      const location = formData.get("location");
      const minPrice = formData.get("minPrice");
      const maxPrice = formData.get("maxPrice");
      const guests = formData.get("guests");

      if (location) params.set("location", location.toString());
      if (minPrice) params.set("minPrice", minPrice.toString());
      if (maxPrice) params.set("maxPrice", maxPrice.toString());
      if (guests) params.set("guests", guests.toString());

      router.push(`/?${params.toString()}`);
    },
  });

  return (
    <form
      className="bg-card p-6 rounded-lg shadow-sm border"
      {...getFormProps(form)}
    >
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <ConformField field={fields.location} label="Location">
          <ConformInput field={fields.location} placeholder="City, State" />
        </ConformField>

        <ConformField field={fields.minPrice} label="Min Price">
          <ConformInput
            field={fields.minPrice}
            type="number"
            placeholder="$0"
          />
        </ConformField>

        <ConformField field={fields.maxPrice} label="Max Price">
          <ConformInput
            field={fields.maxPrice}
            type="number"
            placeholder="$1000"
          />
        </ConformField>

        <ConformField field={fields.guests} label="Guests">
          <ConformInput field={fields.guests} type="number" placeholder="1" />
        </ConformField>
      </div>
      <Button type="submit" className="mt-4 w-full md:w-auto">
        <Search className="h-4 w-4 mr-2" />
        Search
      </Button>
    </form>
  );
}
