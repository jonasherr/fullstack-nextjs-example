"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { signOut } from "@/lib/auth-client";

export default function LogoutMenuItem() {
  const router = useRouter();

  async function handleSignOut() {
    await signOut();
    toast.success("Logged out successfully");
    router.push("/login");
  }

  return (
    <DropdownMenuItem onClick={handleSignOut}>
      <LogOut className="h-4 w-4 mr-2" />
      Log out
    </DropdownMenuItem>
  );
}
