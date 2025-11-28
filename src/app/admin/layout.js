"use client";
import dynamic from "next/dynamic";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
const SidebarLayout = dynamic(() => import("@/components/adminPanel/SideBar"), {
  ssr: false,
});
export default function AdminLayout({ children }) {
  return (
    <SidebarProvider>
      <div className="flex">
        <SidebarLayout />
        <main className="flex-1 p-6">
          <SidebarTrigger className="mb-12" />
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}
