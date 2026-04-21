"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Package, Inbox, Users, ArrowUpRight, Plus, Tag } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalBarang: 0,
    totalPeminjaman: 0,
    totalKelas: 0,
  });
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [statsData, activitiesData] = await Promise.all([
          api.peminjaman.getStats(),
          api.peminjaman.getAll(),
        ]);
        setStats(statsData);
        setActivities(activitiesData.slice(0, 5));
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const statCards = [
    {
      title: "Total Barang",
      value: stats.totalBarang,
      icon: Package,
      color: "from-blue-500 to-indigo-600",
      url: "/dashboard/barang",
      description: "Inventory items tracked",
    },
    {
      title: "Peminjaman Aktif",
      value: stats.totalPeminjaman,
      icon: Inbox,
      color: "from-emerald-500 to-teal-600",
      url: "/dashboard/peminjaman",
      description: "Currently borrowed items",
    },
    {
      title: "Total Kelas",
      value: stats.totalKelas,
      icon: Users,
      color: "from-purple-500 to-pink-600",
      url: "/dashboard/kelas",
      description: "Registered school classes",
    },
  ];

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Selamat Datang, <span className="text-gradient">Admin</span> 👋
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">
            Monitor dan kelola inventaris sekolah dalam satu dashboard premium.
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/dashboard/peminjaman/tambah"
            className="px-6 py-3 bg-primary text-white rounded-2xl font-bold shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all active:scale-95 text-sm"
          >
            Buat Peminjaman
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {statCards.map((card) => (
          <Link
            href={card.url}
            key={card.title}
            className="group relative overflow-hidden glass-card p-1 rounded-3xl transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl"
          >
            <div className="p-8 space-y-6 relative z-10">
              <div className="flex justify-between items-start">
                <div
                  className={`p-4 rounded-2xl bg-gradient-to-br ${card.color} text-white shadow-lg shadow-indigo-500/20 group-hover:scale-110 transition-transform duration-500`}
                >
                  <card.icon size={28} strokeWidth={2.5} />
                </div>
                <ArrowUpRight
                  className="text-slate-300 group-hover:text-primary transition-colors duration-300"
                  size={20}
                />
              </div>
              <div>
                <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-1">
                  {card.title}
                </h3>
                <div className="flex items-baseline gap-2">
                  <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">
                    {loading ? (
                      <span className="inline-block w-12 h-8 bg-slate-200 dark:bg-slate-800 animate-pulse rounded-lg"></span>
                    ) : (
                      card.value
                    )}
                  </h2>
                  <span className="text-xs font-semibold text-slate-400">
                    Total
                  </span>
                </div>
                <p className="text-[10px] font-medium text-slate-400 mt-2 italic">
                  {card.description}
                </p>
              </div>
            </div>
            {/* Decorative background element */}
            <div
              className={`absolute -right-4 -bottom-4 w-24 h-24 bg-gradient-to-br ${card.color} opacity-5 blur-3xl group-hover:opacity-20 transition-opacity duration-500`}
            ></div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass-card p-8 rounded-3xl space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-black text-slate-900 dark:text-white">
              Aktivitas Terbaru
            </h3>
            <Link
              href="/dashboard/peminjaman/history"
              className="text-xs font-bold text-primary hover:underline"
            >
              Lihat Semua
            </Link>
          </div>
          <div className="space-y-4">
            {loading ? (
              [1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-20 bg-slate-100 dark:bg-slate-800 animate-pulse rounded-2xl"
                />
              ))
            ) : activities.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
                <div className="w-20 h-20 bg-primary/5 rounded-full flex items-center justify-center text-primary/40">
                  <Package size={40} strokeWidth={1.5} />
                </div>
                <div>
                  <p className="font-bold text-slate-900 dark:text-white">
                    Siap untuk Memulai?
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400 max-w-[250px] mx-auto mt-1">
                    Data aktivitas akan muncul di sini setelah Anda mulai
                    melakukan peminjaman.
                  </p>
                </div>
              </div>
            ) : (
              activities.map((activity) => (
                <div
                  key={activity.id_peminjaman}
                  className="flex items-center justify-between p-4 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group border border-transparent hover:border-slate-100 dark:hover:border-slate-800"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                      {activity.nama_peminjam?.[0].toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900 dark:text-white">
                        {activity.nama_peminjam}
                      </p>
                      <p className="text-[10px] font-medium text-slate-500 uppercase tracking-widest">
                        {activity.nama_kelas} • {activity.nama_petugas || "Admin"}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div
                      className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-md mb-1 ${
                        activity.status === "dipinjam"
                          ? "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400"
                          : "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400"
                      }`}
                    >
                      {activity.status}
                    </div>
                    <p className="text-[10px] text-slate-400 font-medium">
                      {new Date(activity.created_at).toLocaleDateString("id-ID")}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="glass-card p-8 rounded-3xl bg-gradient-to-br from-primary/5 via-transparent to-transparent border-primary/10">
          <h3 className="text-xl font-black text-slate-900 dark:text-white mb-6">
            Panduan Cepat
          </h3>
          <div className="space-y-4">
            {[
              {
                title: "Tambah Barang ke Inventaris",
                desc: "Daftarkan aset baru sekolah Anda.",
                icon: Plus,
              },
              {
                title: "Kelola Kategori",
                desc: "Kelompokkan barang agar mudah dicari.",
                icon: Tag,
              },
              {
                title: "Input Data Kelas",
                desc: "Daftar kelas yang berhak meminjam.",
                icon: Users,
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="flex gap-4 p-4 rounded-2xl hover:bg-white/50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer group"
              >
                <div className="w-10 h-10 shrink-0 rounded-xl bg-white dark:bg-slate-800 shadow-sm flex items-center justify-center text-slate-400 group-hover:text-primary transition-colors">
                  <item.icon size={20} />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">
                    {item.title}
                  </p>
                  <p className="text-xs text-slate-500">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
