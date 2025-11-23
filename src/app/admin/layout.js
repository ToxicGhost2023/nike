"use client";

import SideBar from "@/components/adminPanel/SideBar";
import { SidebarProvider } from "@/components/ui/sidebar";
export default function AdminLayout({ children }) {
  return (
    <SidebarProvider>
      <div className="flex">
        <SideBar />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </SidebarProvider>
  );
}
