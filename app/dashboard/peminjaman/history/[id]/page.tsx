"use client";

import { useEffect, useState, use } from "react";
import { api } from "@/lib/api";
import { 
  ArrowLeft, 
  Calendar, 
  User, 
  Book, 
  Package, 
  CheckCircle2, 
  Clock, 
  Hash, 
  CalendarCheck,
  Info,
  Edit2,
  Trash2,
  CheckCircle,
  XCircle,
  AlertCircle
} from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { id } from "date-fns/locale";

export default function PeminjamanDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: peminjamanId } = use(params);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Return Modal states
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [returnItems, setReturnItems] = useState<any[]>([]);
  const [submitting, setSubmitting] = useState(false);

  // Edit states
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({
    nama_peminjam: "",
    kelas_id: "",
    tgl_rencana_kembali: ""
  });
  const [classes, setClasses] = useState<any[]>([]);

  const fetchDetail = async () => {
    try {
      const result = await api.peminjaman.getById(peminjamanId);
      setData(result);
      setEditForm({
        nama_peminjam: result.nama_peminjam,
        kelas_id: result.kelas_id.toString(),
        tgl_rencana_kembali: result.tgl_rencana_kembali ? result.tgl_rencana_kembali.split('T')[0] : ""
      });
      setReturnItems(result.items.map((item: any) => ({
        ...item,
        kondisi: "baik"
      })));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetail();
    api.kelas.getAll().then(setClasses).catch(console.error);
  }, [peminjamanId]);

  const handleReturn = async () => {
    setSubmitting(true);
    try {
      await api.peminjaman.kembali(peminjamanId, { items: returnItems });
      setShowReturnModal(false);
      fetchDetail();
    } catch (err: any) {
      alert("Gagal mengembalikan: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdate = async () => {
    setSubmitting(true);
    try {
      await api.peminjaman.update(peminjamanId, editForm);
      setShowEditModal(false);
      fetchDetail();
    } catch (err: any) {
      alert("Gagal memperbarui: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-8 text-center">
        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <Info size={32} />
        </div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Gagal Memuat Detail</h2>
        <p className="text-slate-500 mt-2">{error || "Data tidak ditemukan"}</p>
        <Link href="/dashboard/peminjaman/history" className="mt-6 inline-flex text-primary font-bold hover:underline">
          Kembali ke Riwayat
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex items-center gap-4">
        <Link 
          href="/dashboard/peminjaman/history"
          className="p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-400 hover:text-primary transition-all shadow-sm group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
        </Link>
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Detail <span className="text-primary">Peminjaman</span>
            </h1>
            <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
              data.status === 'dipinjam' 
                ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400' 
                : 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400'
            }`}>
              {data.status}
            </div>
          </div>
          <p className="text-slate-500 text-sm font-medium">#{data.id_peminjaman} • {data.nama_peminjam}</p>
        </div>
        
        <div className="ml-auto flex gap-3">
          {data.status === 'dipinjam' && (
            <>
              <button 
                onClick={() => setShowEditModal(true)}
                className="flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-primary hover:border-primary transition-all shadow-sm"
              >
                <Edit2 size={16} />
                Edit Info
              </button>
              <button 
                onClick={() => setShowReturnModal(true)}
                className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-2xl text-sm font-bold hover:shadow-lg hover:shadow-primary/20 transition-all active:scale-95"
              >
                <CheckCircle size={16} />
                Kembalikan Barang
              </button>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="glass-card p-8 rounded-[2rem] border border-slate-200/50 dark:border-slate-800/50">
            <h3 className="text-lg font-black text-slate-900 dark:text-white mb-6 flex items-center gap-2">
              <Package size={20} className="text-primary" />
              Barang yang Dipinjam
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800">
                    <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Nama Barang</th>
                    <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Jumlah</th>
                    <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Kondisi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                  {data.items?.map((item: any) => (
                    <tr key={item.id_detail_peminjaman} className="group">
                      <td className="py-4">
                        <span className="font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors">
                          {item.nama_barang}
                        </span>
                      </td>
                      <td className="py-4 text-center">
                        <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs font-bold">
                          {item.jumlah}
                        </span>
                      </td>
                      <td className="py-4 text-right">
                        <span className="text-xs font-medium text-slate-500 italic">
                          {item.kondisi_kembali || "Sedang Dipinjam"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass-card p-8 rounded-[2rem] border border-slate-200/50 dark:border-slate-800/50">
            <h3 className="text-lg font-black text-slate-900 dark:text-white mb-6">Informasi Peminjam</h3>
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                  <User size={24} />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Peminjam</p>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">{data.nama_peminjam}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-500">
                  <Book size={24} />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Kelas</p>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">{data.nama_kelas}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="glass-card p-8 rounded-[2rem] border border-slate-200/50 dark:border-slate-800/50 bg-slate-50/50 dark:bg-slate-900/20">
            <h3 className="text-lg font-black text-slate-900 dark:text-white mb-6">Timeline</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-1 h-12 bg-emerald-500/20 relative mt-2">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-emerald-500" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Dipinjam Pada</p>
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-200">
                    {format(new Date(data.created_at), "dd MMMM yyyy HH:mm", { locale: id })}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-1 h-6 bg-slate-200 dark:bg-slate-800 relative mt-2">
                  <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full ${data.status === 'selesai' ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Batas Pengembalian</p>
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-200">
                    {data.tgl_rencana_kembali ? format(new Date(data.tgl_rencana_kembali), "dd MMMM yyyy", { locale: id }) : "-"}
                  </p>
                </div>
              </div>
              
              {data.tgl_kembali && (
                <div className="flex items-start gap-4">
                  <div className="w-1 h-6 relative mt-2">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-emerald-500" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Dikembalikan Pada</p>
                    <p className="text-xs font-bold text-emerald-600">
                      {format(new Date(data.tgl_kembali), "dd MMMM yyyy HH:mm", { locale: id })}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Return Modal */}
      {showReturnModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white dark:bg-slate-900 w-full max-w-xl rounded-[2.5rem] shadow-2xl border border-slate-100 dark:border-slate-800 p-10 space-y-8">
            <div>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white">Pengembalian Barang</h2>
              <p className="text-slate-500 text-sm font-medium mt-1">Sesuaikan kondisi barang saat dikembalikan.</p>
            </div>

            <div className="space-y-6">
              {returnItems.map((item, idx) => (
                <div key={item.barang_id} className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-bold text-slate-900 dark:text-white">{item.nama_barang}</span>
                    <span className="text-xs font-black text-primary">QTY: {item.jumlah}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {['baik', 'rusak'].map((cond) => (
                      <button
                        key={cond}
                        onClick={() => {
                          const newItems = [...returnItems];
                          newItems[idx].kondisi = cond;
                          setReturnItems(newItems);
                        }}
                        className={`flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                          item.kondisi === cond
                            ? cond === 'baik' 
                              ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                              : 'bg-red-500 text-white shadow-lg shadow-red-500/20'
                            : 'bg-white dark:bg-slate-800 text-slate-400 border border-slate-200 dark:border-slate-700 hover:border-primary'
                        }`}
                      >
                        {cond === 'baik' ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
                        {cond}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-4 pt-4">
              <button
                onClick={() => setShowReturnModal(false)}
                className="flex-1 py-4 rounded-2xl text-sm font-black uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleReturn}
                disabled={submitting}
                className="flex-1 py-4 bg-primary text-white rounded-2xl text-sm font-black uppercase tracking-widest hover:shadow-xl hover:shadow-primary/20 transition-all active:scale-95 disabled:opacity-50"
              >
                {submitting ? "Memproses..." : "Konfirmasi Kembali"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-[2.5rem] shadow-2xl border border-slate-100 dark:border-slate-800 p-10 space-y-8">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">Edit Informasi</h2>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Nama Peminjam</label>
                <input
                  type="text"
                  value={editForm.nama_peminjam}
                  onChange={(e) => setEditForm({ ...editForm, nama_peminjam: e.target.value })}
                  className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold text-slate-900 dark:text-white"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Kelas</label>
                <select
                  value={editForm.kelas_id}
                  onChange={(e) => setEditForm({ ...editForm, kelas_id: e.target.value })}
                  className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold text-slate-900 dark:text-white"
                >
                  {classes.map((cls) => (
                    <option key={cls.id_kelas} value={cls.id_kelas}>{cls.nama_kelas}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Rencana Kembali</label>
                <input
                  type="date"
                  value={editForm.tgl_rencana_kembali}
                  onChange={(e) => setEditForm({ ...editForm, tgl_rencana_kembali: e.target.value })}
                  className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                onClick={() => setShowEditModal(false)}
                className="flex-1 py-4 rounded-2xl text-sm font-black uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleUpdate}
                disabled={submitting}
                className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl text-sm font-black uppercase tracking-widest hover:shadow-xl hover:shadow-indigo-600/20 transition-all active:scale-95 disabled:opacity-50"
              >
                {submitting ? "Menyimpan..." : "Simpan Perubahan"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
