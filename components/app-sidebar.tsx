"use client";

import { Home, Inbox, Settings, Package, Tag, Book, Clock } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";

const menuItems = [
  { title: "Home", url: "/dashboard", icon: Home },
  { title: "Kategori", url: "/dashboard/kategori", icon: Tag },
  { title: "Barang", url: "/dashboard/barang", icon: Package },
  { title: "Petugas", url: "/dashboard/petugas", icon: Settings },
  { title: "Peminjaman", url: "/dashboard/peminjaman", icon: Inbox },
  { title: "Kelas", url: "/dashboard/kelas", icon: Book },
  { title: "Riwayat Pinjam", url: "/dashboard/peminjaman/history", icon: Clock },
];

export function AppSidebar() {
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await api.auth.getMe();
        setUser(userData);
      } catch (err) {
        console.error("Failed to fetch user:", err);
      }
    };
    fetchUser();
  }, []);

  return (
    <Sidebar
      collapsible="icon"
      className="border-r border-sidebar-border bg-sidebar/50 backdrop-blur-xl"
    >
      <SidebarHeader className="p-6">
        <div className="flex items-center gap-4 px-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 dark:ring-white/10 p-2">
            <img
              src="/Sipina.png"
              alt="Logo"
              className="w-full h-full object-contain"
            />
          </div>
          <div className="flex flex-col group-data-[collapsible=icon]:hidden">
            <span className="font-black text-2xl tracking-tight text-gradient">
              {user?.nama_sekolah || "SiPina"}
            </span>
            {user?.nama_sekolah && (
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 -mt-1">
                KIK Management
              </span>
            )}
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-3">
        <SidebarGroup>
          <SidebarGroupLabel className="px-4 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
            Main Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1.5">
              {menuItems.map((item) => {
                const isActive = pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={item.title}
                      className={`flex items-center gap-3.5 px-4 py-6 rounded-2xl transition-all duration-300 ${
                        isActive
                          ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 font-bold"
                          : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50 hover:text-primary"
                      }`}
                    >
                      <Link href={item.url}>
                        <item.icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                        <span className="group-data-[collapsible=icon]:hidden">
                          {item.title}
                        </span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-sidebar-border/50">
        <div className="flex items-center gap-4 p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/50 ring-1 ring-slate-100 dark:ring-white/5 group-data-[collapsible=icon]:hidden">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-indigo-600 flex items-center justify-center text-sm font-black text-white shadow-md uppercase">
            {user?.username?.[0] || user?.nama?.[0] || "U"}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-bold truncate dark:text-white">
              {user?.username || "Loading..."}
            </span>
            <span className="text-[10px] font-medium text-slate-400 truncate">
              {user?.email || "..."}
            </span>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
