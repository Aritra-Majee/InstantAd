import { SidebarTrigger } from "@/components/ui/sidebar";
import React from "react";
import ProfileAvatar from "./ProfileAvatar";
import { useAuthContext } from "../provider";
import Link from "next/link";
import { Button } from "@/components/ui/button";

function AppHeader() {
  const { user } = useAuthContext();

  return (
    <header className="flex items-center justify-between w-full p-4 border-b border-zinc-800">
      <SidebarTrigger />

      {!user ? (
        <Link href="/login">
          <Button>Sign In</Button>
        </Link>
      ) : (
        <ProfileAvatar />
      )}
    </header>
  );
}

export default AppHeader;