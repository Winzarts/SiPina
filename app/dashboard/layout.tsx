"use client";

import {
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Plus } from "lucide-react";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <AppSidebar />
        <SidebarInset className="flex flex-col flex-1">
          <header className="flex h-20 shrink-0 items-center justify-between gap-4 border-b border-sidebar-border/50 px-8 sticky top-0 glass z-40">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="-ml-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl p-2 transition-colors" />
              <div className="h-6 w-[1px] bg-slate-200 dark:bg-slate-800" />
              <div className="flex flex-col">
                <h2 className="text-xs font-black uppercase tracking-[0.2em] text-primary">
                  System
                </h2>
                <p className="text-sm font-bold text-slate-900 dark:text-white">
                  Dashboard
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <ThemeToggle />
              <Link
                href="/dashboard/peminjaman/tambah"
                className="hidden md:flex items-center gap-2 rounded-2xl bg-primary text-white px-6 py-2.5 text-xs font-black uppercase tracking-widest hover:shadow-lg hover:shadow-primary/30 transition-all hover:-translate-y-0.5"
              >
                <Plus size={16} strokeWidth={3} />
                Pinjam Barang
              </Link>
            </div>
          </header>

          <main className="flex-1 p-6 overflow-y-auto max-w-[1600px] mx-auto w-full">
            {children}
          </main>

          {/* Mobile FAB */}
          <Link
            href="/dashboard/peminjaman/tambah"
            className="md:hidden fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700 transition scale-100 hover:scale-110 active:scale-95 transition-transform"
          >
            <Plus size={24} />
          </Link>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
