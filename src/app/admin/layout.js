"use client";

import { SidebarLayout } from "@/components/adminPanel/SideBar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
export default function AdminLayout({ children }) {
  return (
    <SidebarProvider
      toggleable
      defaultCollapsed={false}
      collapsedWidth="w-20"
      expandedWidth="w-64"
    >
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
