import React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  Calendar,
  Home,
  Inbox,
  Megaphone,
  Search,
  Settings,
} from "lucide-react";
import Image from "next/image";
import { useParams, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useAuthContext } from "../provider";
import ProfileAvatar from "./ProfileAvatar";

const items = [
  {
    title: "Home",
    url: "/app",
    icon: Home,
  },
  {
    title: "Creative Tools",
    url: "/creative-ai-tools",
    icon: Inbox,
  },
  {
    title: "My Ads",
    url: "/my-ads",
    icon: Megaphone,
  },
  // {
  //   title: "Search",
  //   url: "#",
  //   icon: Search,
  // },
  // {
  //   title: "Profile",
  //   url: "#",
  //   icon: Settings,
  // },
];

export function AppSidebar() {
  const path = usePathname();
  const { user } = useAuthContext();
  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-3 px-5 py-5">
          <Image
            src="/logo2.svg"
            alt="InstantAd"
            width={48}
            height={48}
            className="h-12 w-auto shrink-0"
          />

          <div>
            <h2 className="text-xl font-semibold tracking-tight text-white">
              InstantAd
            </h2>
            <p className="text-xs text-gray-400">Product Ads in Seconds</p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="mt-5">
              {items.map((item, index) => (
                // <SidebarMenuItem key={item.title} className='p-2'>
                //     <SidebarMenuButton asChild className=''>
                <Link
                  href={item.url}
                  key={index}
                  className={`p-2 text-lg flex gap-2 items-center
    hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg
    ${
      item.url === "/creative-ai-tools"
        ? path.startsWith("/creative-ai-tools") &&
          "bg-gray-100 dark:bg-zinc-800"
        : path === item.url && "bg-gray-100 dark:bg-zinc-800"
    }`}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.title}</span>
                </Link>
                //     </SidebarMenuButton>
                // </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        {!user ? (
          <Link href={"/login"} className="w-full">
            <Button className="w-full">Sign In</Button>
          </Link>
        ) : (
          <div className="flex justify-between items-center p-2 px-4 bg-zince-800 rounded-lg">
            <h2>Profile</h2>
            <ProfileAvatar />
          </div>
        )}
        <h2 className="p-2 text-gray-400 text-sm">
          Copyright © 2026 InstantAd
        </h2>
      </SidebarFooter>
    </Sidebar>
  );
}
