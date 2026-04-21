"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import {
  Users,
  Plus,
  Search,
  Edit2,
  Trash2,
  X,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

interface Kelas {
  id_kelas: number;
  nama_kelas: string;
}

interface ToastState {
  message: string;
  type: "success" | "error";
}

export default function KelasPage() {
  const [kelas, setKelas] = useState<Kelas[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Dialog states
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState<"add" | "edit" | "delete">(
    "add",
  );
  const [selectedKelas, setSelectedKelas] = useState<Kelas | null>(null);
  const [formData, setFormData] = useState({ nama_kelas: "" });
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<ToastState | null>(null);

  useEffect(() => {
    fetchKelas();
  }, []);

  async function fetchKelas() {
    try {
      setLoading(true);
      const data = await api.kelas.getAll();
      setKelas(Array.isArray(data) ? data : []);
    } catch (err) {
      showToast("Gagal mengambil data kelas", "error");
    } finally {
      setLoading(false);
    }
  }

  const showToast = (
    message: string,
    type: "success" | "error" = "success",
  ) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const filteredKelas = (kelas || []).filter((k) =>
    k.nama_kelas?.toLowerCase().includes(search.toLowerCase()),
  );

  const handleOpenDialog = (
    type: "add" | "edit" | "delete",
    k: Kelas | null = null,
  ) => {
    setDialogType(type);
    setSelectedKelas(k);
    setFormData({ nama_kelas: k ? k.nama_kelas : "" });
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (dialogType === "add") {
        await api.kelas.create(formData);
        showToast("Kelas berhasil ditambahkan");
      } else if (dialogType === "edit" && selectedKelas) {
        await api.kelas.update(selectedKelas.id_kelas, formData);
        showToast("Kelas berhasil diupdate");
      } else if (dialogType === "delete" && selectedKelas) {
        await api.kelas.delete(selectedKelas.id_kelas);
        showToast("Kelas berhasil dihapus");
      }
      setIsDialogOpen(false);
      fetchKelas();
    } catch (err: any) {
      showToast(err.message || "Terjadi kesalahan", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Manajemen <span className="text-gradient">Kelas</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">
            Kelola daftar kelas yang berhak menggunakan layanan inventaris.
          </p>
        </div>
        <button
          onClick={() => handleOpenDialog("add")}
          className="flex items-center justify-center gap-2 px-6 py-3.5 bg-primary text-white rounded-2xl font-bold shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-1 transition-all active:scale-95 text-sm"
        >
          <Plus size={18} strokeWidth={3} />
          Tambah Kelas
        </button>
      </div>

      {/* Main Content Card */}
      <div className="glass-card rounded-3xl overflow-hidden">
        {/* Search Bar Area */}
        <div className="p-6 border-b border-white/10 flex flex-col md:flex-row gap-4 items-center justify-between bg-white/50 dark:bg-slate-900/50">
          <div className="relative w-full md:w-96 group">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors"
              size={18}
            />
            <input
              type="text"
              placeholder="Cari nama kelas..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all text-sm font-medium"
            />
          </div>
          <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            Total: {filteredKelas.length} Kelas
          </div>
        </div>

        {/* Table Area */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-slate-800/50">
                <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-slate-400">
                  Nama Kelas
                </th>
                <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-slate-400">
                  ID Kelas
                </th>
                <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-slate-400 text-right">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {loading ? (
                Array(5)
                  .fill(0)
                  .map((_, i) => (
                    <tr key={i}>
                      <td colSpan={3} className="px-8 py-6">
                        <div className="h-6 w-full bg-slate-100 dark:bg-slate-800 animate-pulse rounded-lg"></div>
                      </td>
                    </tr>
                  ))
              ) : filteredKelas.length > 0 ? (
                filteredKelas.map((k) => (
                  <tr
                    key={k.id_kelas}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors group"
                  >
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4 text-slate-900 dark:text-white font-bold">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-black">
                          {k.nama_kelas.charAt(0)}
                        </div>
                        {k.nama_kelas}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <code className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs font-mono text-slate-500">
                        #{k.id_kelas}
                      </code>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleOpenDialog("edit", k)}
                          className="p-2.5 hover:bg-white dark:hover:bg-slate-700 text-slate-400 hover:text-primary rounded-xl transition-all shadow-sm hover:shadow-md"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleOpenDialog("delete", k)}
                          className="p-2.5 hover:bg-white dark:hover:bg-slate-700 text-slate-400 hover:text-destructive rounded-xl transition-all shadow-sm hover:shadow-md"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-300">
                        <Users size={32} />
                      </div>
                      <p className="font-bold text-slate-400">
                        Tidak ada data kelas ditemukan
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Dialog */}
      {isDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="w-full max-w-md glass-card rounded-3xl p-8 shadow-2xl animate-in zoom-in duration-300">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-black text-slate-900 dark:text-white">
                {dialogType === "add" && "Tambah Kelas Baru"}
                {dialogType === "edit" && "Edit Data Kelas"}
                {dialogType === "delete" && "Hapus Kelas"}
              </h2>
              <button
                onClick={() => !submitting && setIsDialogOpen(false)}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-slate-400 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {dialogType === "delete" ? (
              <div className="space-y-6">
                <div className="bg-destructive/5 p-4 rounded-2xl flex gap-4 text-destructive border border-destructive/10">
                  <AlertCircle className="shrink-0" />
                  <p className="text-sm font-medium">
                    Apakah Anda yakin ingin menghapus kelas{" "}
                    <strong>{selectedKelas?.nama_kelas}</strong>? Tindakan ini
                    tidak dapat dibatalkan.
                  </p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setIsDialogOpen(false)}
                    className="flex-1 py-3.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-2xl font-bold hover:bg-slate-200 transition"
                  >
                    Batal
                  </button>
                  <button
                    disabled={submitting}
                    onClick={handleSubmit}
                    className="flex-1 py-3.5 bg-destructive text-white rounded-2xl font-bold hover:bg-destructive/90 transition shadow-lg shadow-destructive/20 disabled:opacity-50"
                  >
                    {submitting ? "Menghapus..." : "Ya, Hapus"}
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">
                    Nama Kelas
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: XII RPL 1"
                    value={formData.nama_kelas}
                    onChange={(e) =>
                      setFormData({ ...formData, nama_kelas: e.target.value })
                    }
                    className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-bold"
                  />
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-4 bg-primary text-white rounded-2xl font-black uppercase tracking-widest shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-1 transition-all active:scale-95 disabled:opacity-50 disabled:translate-y-0"
                >
                  {submitting
                    ? "Processing..."
                    : dialogType === "add"
                      ? "Tambah Kelas"
                      : "Simpan Perubahan"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] px-6 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom-4 duration-300 ${
            toast.type === "error"
              ? "bg-destructive text-white"
              : "bg-slate-900 dark:bg-white text-white dark:text-slate-900"
          }`}
        >
          {toast.type === "error" ? (
            <AlertCircle size={20} />
          ) : (
            <CheckCircle2 size={20} />
          )}
          <span className="font-bold text-sm tracking-tight">
            {toast.message}
          </span>
        </div>
      )}
    </div>
  );
}
