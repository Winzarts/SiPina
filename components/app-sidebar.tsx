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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await api.auth.getMe();
        setUser(userData);
      } catch (err) {
        console.error("Failed to fetch user:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUser();
  }, []);

  return (
    <Sidebar
      collapsible="icon"
      className="border-r border-sidebar-border bg-white dark:bg-slate-950"
    >
      <SidebarHeader className="p-4 md:p-6 group-data-[collapsible=icon]:p-2">
        <div className="flex items-center gap-3 px-2 group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:justify-center">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center">
            <img
              src="/Sipina.png"
              alt="Logo"
              className="w-full h-full object-contain"
            />
          </div>
          <div className="flex flex-col min-w-0 group-data-[collapsible=icon]:hidden">
            <span className="font-bold text-xl tracking-tight truncate">
              {user?.nama_sekolah || "SiPina"}
            </span>
            {user?.nama_sekolah && (
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 truncate">
                Sarpras Management
              </span>
            )}
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-3">
        <SidebarGroup>
          <SidebarGroupLabel className="px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Main Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              {menuItems.map((item) => {
                const isActive = pathname === item.url || (item.url !== '/dashboard' && pathname.startsWith(item.url));
                
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={item.title}
                      className={`flex items-center gap-3 px-3 py-5 rounded-xl transition-colors ${
                        isActive
                          ? "bg-primary text-primary-foreground font-semibold"
                          : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-foreground"
                      }`}
                    >
                      <Link href={item.url}>
                        <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
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

      <SidebarFooter className="p-4">
        <div className="flex items-center gap-3 p-2 rounded-xl bg-slate-50 dark:bg-slate-900 group-data-[collapsible=icon]:hidden">
          <div className="h-9 w-9 shrink-0 rounded-lg bg-primary flex items-center justify-center text-sm font-bold text-primary-foreground uppercase">
            {isLoading ? "-" : (user?.username?.[0] || user?.nama?.[0] || "U")}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-semibold truncate text-foreground">
              {isLoading ? "Loading..." : (user?.username || "Guest")}
            </span>
            <span className="text-xs text-slate-500 truncate">
              {isLoading ? "..." : (user?.email || "")}
            </span>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
