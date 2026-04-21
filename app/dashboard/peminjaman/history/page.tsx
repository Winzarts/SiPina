"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Search, Calendar, User, Book, Package, CheckCircle2, Clock, Trash2 } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { id } from "date-fns/locale";

export default function BorrowingHistoryPage() {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchHistory = async () => {
    try {
      const data = await api.peminjaman.getAll();
      setHistory(data);
    } catch (err) {
      console.error("Failed to fetch history:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Apakah Anda yakin ingin menghapus data ini? Stok barang akan dikembalikan jika status masih 'dipinjam'.")) return;
    try {
      await api.peminjaman.delete(id);
      fetchHistory();
    } catch (err: any) {
      alert("Gagal menghapus: " + err.message);
    }
  };

  const filteredHistory = history.filter((item) =>
    item.nama_peminjam.toLowerCase().includes(search.toLowerCase()) ||
    item.nama_kelas?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
            Riwayat <span className="text-primary">Peminjaman</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium">
            Lihat semua catatan peminjaman barang.
          </p>
        </div>

        <div className="relative w-full md:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Cari peminjam atau kelas..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all shadow-sm"
          />
        </div>
      </div>

      <div className="glass-card overflow-hidden rounded-[2rem] border border-slate-200/50 dark:border-slate-800/50">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-900/50">
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Peminjam</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Kelas</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Tanggal Pinjam</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Petugas</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredHistory.map((item) => (
                <tr key={item.id_peminjaman} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors group">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary font-bold">
                        {item.nama_peminjam[0].toUpperCase()}
                      </div>
                      <span className="font-bold text-slate-900 dark:text-white">{item.nama_peminjam}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 font-medium">
                      <Book size={14} />
                      {item.nama_kelas}
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-200">
                        <Calendar size={14} className="text-primary" />
                        {format(new Date(item.created_at), "dd MMM yyyy", { locale: id })}
                      </div>
                      <div className="flex items-center gap-2 text-[10px] font-medium text-slate-400">
                        <Clock size={12} />
                        Estimasi: {item.tgl_rencana_kembali ? format(new Date(item.tgl_rencana_kembali), "dd MMM yyyy", { locale: id }) : "-"}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                      item.status === 'dipinjam' 
                        ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400' 
                        : 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400'
                    }`}>
                      {item.status === 'selesai' && <CheckCircle2 size={12} />}
                      {item.status}
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400">{item.nama_petugas || "Admin"}</span>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <Link 
                      href={`/dashboard/peminjaman/history/${item.id_peminjaman}`}
                      className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-primary hover:bg-primary/5 px-3 py-1.5 rounded-xl transition-all"
                    >
                      Detail
                    </Link>
                    <button 
                      onClick={() => handleDelete(item.id_peminjaman)}
                      className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-red-500 hover:bg-red-50 px-3 py-1.5 rounded-xl transition-all ml-2"
                    >
                      <Trash2 size={12} />
                      Hapus
                    </button>
                  </td>
                </tr>
              ))}

              {filteredHistory.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center justify-center space-y-4">
                      <Package size={48} className="text-slate-200 dark:text-slate-800" />
                      <div>
                        <p className="font-bold text-slate-900 dark:text-white">Tidak Ada Data</p>
                        <p className="text-sm text-slate-500">Belum ada riwayat peminjaman yang ditemukan.</p>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
