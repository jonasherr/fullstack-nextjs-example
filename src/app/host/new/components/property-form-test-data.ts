const fillTestData = (formId: string) => {
  const formElement = document.getElementById(formId) as HTMLFormElement;
  if (!formElement) return;

  const testData = {
    name: "Cozy Downtown Loft",
    description:
      "Beautiful loft in the heart of downtown with stunning city views. Recently renovated with modern amenities and high-end finishes.",
    street: "123 Main Street",
    city: "San Francisco",
    state: "CA",
    zipCode: "94102",
    pricePerNight: "150",
    maxGuests: "4",
    numBedrooms: "2",
    images: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267",
      "https://images.unsplash.com/photo-1502672260066-6bc05c107e00",
    ],
  };

  // Fill text and number inputs
  Object.entries(testData).forEach(([key, value]) => {
    if (key === "images") return; // Handle images separately
    const input = formElement.querySelector(
      `[name="${key}"]`,
    ) as HTMLInputElement;
    if (input) {
      input.value = value as string;
      input.dispatchEvent(new Event("input", { bubbles: true }));
      input.dispatchEvent(new Event("change", { bubbles: true }));
    }
  });

  // Fill image fields
  testData.images.forEach((url, index) => {
    const input = formElement.querySelector(
      `[name="images[${index}]"]`,
    ) as HTMLInputElement;
    if (input) {
      input.value = url;
      input.dispatchEvent(new Event("input", { bubbles: true }));
      input.dispatchEvent(new Event("change", { bubbles: true }));
    }
  });
};
