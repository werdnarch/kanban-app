"use client";

import React from "react";
import { authClient } from "@/lib/auth-client";
import { Button } from "./ui/button";
import { LogOutIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function LogOut() {
  const router = useRouter();
  const handleLogOut = async () => {
    try {
      const { error } = await authClient.signOut();
      if (error) {
        toast.error(`Sign out error: ${error.message || error}`);
        console.error("Sign out error:", error);
      } else {
        toast.success("Signed out successfully");
        router.push("/");
      }
    } catch (err) {
      console.error("Unexpected sign out error:", err);
    }
  };
  return (
    <Button onClick={handleLogOut}>
      <LogOutIcon className="size-4" />
    </Button>
  );
}
