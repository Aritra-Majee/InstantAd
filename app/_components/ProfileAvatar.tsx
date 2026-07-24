"use client";
import { auth } from "@/configs/firebaseConfig";
import { onAuthStateChanged, signOut } from "firebase/auth";
import Image from "next/image";
import React, { useEffect } from "react";
import { useAuthContext } from "../provider";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { LogOut } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

function ProfileAvatar() {
  const user = useAuthContext();
  const router = useRouter();
  const onButtonPress = async () => {
    try {
      await signOut(auth);

      // Remove the cookie
      document.cookie =
        "firebase_token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";

      router.replace("/app");
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div>
      <Popover>
        <PopoverTrigger>
          {user?.user?.photoURL && (
            <img
              src={user?.user?.photoURL}
              alt="profile"
              className="w-[35px] h-[35px] rounded-full"
            />
          )}
        </PopoverTrigger>
        <PopoverContent className="w-fit p-2">
          <Button
            variant="ghost"
            onClick={onButtonPress}
            className="justify-start gap-2 hover:bg-red-500/10"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </PopoverContent>
      </Popover>
    </div>
  );
}

export default ProfileAvatar;
