import { Header } from "@/components/navigation/header";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-8 min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="w-full max-w-md">{children}</div>
      </main>
    </>
  );
}
