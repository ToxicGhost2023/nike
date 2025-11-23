"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Box, Users, ShoppingCart, LogOut, Settings } from "lucide-react";

export default function SideBar() {
  const { data: session, status } = useSession();
  const pathname = usePathname();

  const items = [
    { label: "Dashboard", href: "/admin", icon: <Home className="h-4 w-4" /> },
    {
      label: "Products",
      href: "/admin/products",
      icon: <Box className="h-4 w-4" />,
    },
    {
      label: "Users",
      href: "/admin/users",
      icon: <Users className="h-4 w-4" />,
    },
    {
      label: "Orders",
      href: "/admin/orders",
      icon: <ShoppingCart className="h-4 w-4" />,
    },
  ];

  return (
    <Sidebar className="bg-gray-900  w-64 md:w-72 min-h-screen shadow-lg fixed md:relative z-40">
      <SidebarHeader className="flex flex-col gap-1 px-4 py-6 border-b border-gray-700">
        <div className="font-bold text-lg">Admin Panel</div>
        <div className="text-sm ">
          {status === "loading" && "Loading..."}
          {status === "authenticated" && session?.user?.fullName}
          {status === "unauthenticated" && "Guest"}
        </div>
        <div className="text-xs ">{session?.user?.email}</div>
      </SidebarHeader>
      <SidebarContent className="flex-1 px-2 py-4">
        <SidebarGroup>
          <ul className="flex flex-col gap-1">
            {items.map((item) => {
              const isActive = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors
                      ${
                        isActive
                          ? "bg-gray-700 text-white"
                          : "text-gray-500 hover:bg-gray-700 hover:text-white"
                      }`}
                  >
                    {item.icon}
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="px-4 py-4 border-t border-gray-700">
        <button
          onClick={() => signOut()}
          className="flex items-center gap-2 w-full px-3 py-2 text-sm font-medium rounded-md hover:bg-red-600 hover:text-white transition"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>

        <Link
          href="/admin/settings"
          className="flex items-center gap-2 w-full mt-2 px-3 py-2 text-sm font-medium rounded-md hover:bg-gray-700 hover:text-white transition"
        >
          <Settings className="h-4 w-4" />
          Settings
        </Link>
      </SidebarFooter>
    </Sidebar>
  );
}
