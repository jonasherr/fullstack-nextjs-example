"use client";

import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface FilterFormData {
  location: string;
  minPrice: string;
  maxPrice: string;
  guests: string;
}

export function PropertyFilters() {
  const router = useRouter();
  const { register, handleSubmit } = useForm<FilterFormData>();

  function onSubmit(data: FilterFormData) {
    const params = new URLSearchParams();
    if (data.location) params.set("location", data.location);
    if (data.minPrice) params.set("minPrice", data.minPrice);
    if (data.maxPrice) params.set("maxPrice", data.maxPrice);
    if (data.guests) params.set("guests", data.guests);

    router.push(`/?${params.toString()}`);
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-card p-6 rounded-lg shadow-sm border"
    >
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            placeholder="City, State"
            {...register("location")}
          />
        </div>
        <div>
          <Label htmlFor="minPrice">Min Price</Label>
          <Input
            id="minPrice"
            type="number"
            placeholder="$0"
            {...register("minPrice")}
          />
        </div>
        <div>
          <Label htmlFor="maxPrice">Max Price</Label>
          <Input
            id="maxPrice"
            type="number"
            placeholder="$1000"
            {...register("maxPrice")}
          />
        </div>
        <div>
          <Label htmlFor="guests">Guests</Label>
          <Input
            id="guests"
            type="number"
            placeholder="1"
            {...register("guests")}
          />
        </div>
      </div>
      <Button type="submit" className="mt-4 w-full md:w-auto">
        <Search className="h-4 w-4 mr-2" />
        Search
      </Button>
    </form>
  );
}
