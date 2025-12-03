"use cache";

export async function Hero() {
  return (
    <section className="relative h-[400px] flex items-center justify-center bg-gradient-to-r from-primary/10 to-primary/20 rounded-lg">
      <div className="text-center z-10 space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold">Find your next stay</h1>
        <p className="text-lg text-muted-foreground">
          Discover unique homes and experiences
        </p>
      </div>
    </section>
  );
}
