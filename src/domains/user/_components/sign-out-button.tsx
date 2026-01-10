"use client";

import { useTransition } from "react";
import { Button } from "@/src/components/ui/button"; 
import { mutate } from "swr";
import { signOut } from "next-auth/react";

export function SignOutButton() {
   
  async function handleSignOut () {
      // Clear the user cache to update the header
      await signOut();
  };

  return (
    <Button variant="outline" onClick={handleSignOut}  >
       Sign Out
    </Button>
  );
}
