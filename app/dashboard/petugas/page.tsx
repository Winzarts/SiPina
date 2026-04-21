"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { User, Mail, Calendar, Plus, ShieldCheck, UserCheck } from "lucide-react";
import Link from "next/link";

export default function PetugasListPage() {
  const [petugas, setPetugas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchPetugas() {
      try {
        const data = await api.auth.getListPetugas();
        setPetugas(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchPetugas();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
            Monitoring <span className="text-primary">Petugas</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium">
            Kelola dan pantau semua akun petugas sistem.
          </p>
        </div>
        <Link
          href="/dashboard/petugas/add"
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary/90 text-white rounded-2xl font-bold transition-all shadow-lg shadow-primary/20 hover:-translate-y-0.5"
        >
          <Plus size={18} strokeWidth={3} />
          Tambah Petugas Baru
        </Link>
      </div>

      {error ? (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-6 rounded-3xl text-red-600 dark:text-red-400">
          <p className="font-bold">Gagal memuat data:</p>
          <p className="text-sm opacity-80">{error}</p>
        </div>
      ) : petugas.length === 0 ? (
        <div className="bg-slate-50 dark:bg-slate-900/50 border-2 border-dashed border-slate-200 dark:border-slate-800 p-12 rounded-[2rem] text-center">
          <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 flex items-center justify-center rounded-2xl mx-auto mb-4 text-slate-400">
            <User size={32} />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Belum ada petugas</h3>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Silakan tambahkan petugas pertama Anda.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {petugas.map((item) => (
            <div 
              key={item.id || item.id_users} 
              className="glass-card p-6 rounded-[2rem] hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 group border border-slate-200/50 dark:border-slate-800/50"
            >
              <div className="flex items-start justify-between mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-primary/10 to-indigo-500/10 flex items-center justify-center rounded-2xl group-hover:scale-110 transition-transform duration-500">
                  <UserCheck className="text-primary" size={28} />
                </div>
                <div className="px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase tracking-widest rounded-full">
                  {item.role}
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white leading-tight">
                    {item.username}
                  </h3>
                  <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500 mt-1">
                    <Mail size={14} />
                    <span className="text-sm font-medium truncate">{item.email}</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-slate-400">
                    <Calendar size={14} />
                    <span className="text-xs font-semibold uppercase tracking-wider">
                      {new Date(item.created_at).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                  <ShieldCheck size={18} className="text-emerald-500" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
