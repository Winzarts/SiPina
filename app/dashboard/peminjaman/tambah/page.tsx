"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { ArrowLeft, Send, CheckCircle2, AlertCircle } from "lucide-react";
import Link from "next/link";

function TambahPeminjamanForm() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const barangId = searchParams.get("barang_id");
  const barangNama = searchParams.get("nama");

  const [kelas, setKelas] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    kelas_id: "",
    nama_peminjam: "",
    tgl_rencana_kembali: "",
    jumlah: 1,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    async function fetchKelas() {
      try {
        const data = await api.kelas.getAll();
        setKelas(data);
      } catch (err) {
        console.error("Failed to fetch kelas:", err);
      }
    }
    fetchKelas();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!barangId) return;

    setLoading(true);
    setError("");

    try {
      const payload = {
        kelas_id: parseInt(formData.kelas_id),
        nama_peminjam: formData.nama_peminjam,
        tgl_rencana_kembali: formData.tgl_rencana_kembali,
        items: [
          {
            barang_id: parseInt(barangId),
            jumlah: parseInt(formData.jumlah.toString()),
          },
        ],
      };

      await api.peminjaman.create(payload);
      setSuccess(true);
      setTimeout(() => {
        router.push("/dashboard/peminjaman");
      }, 2000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center py-20 animate-in fade-in zoom-in duration-300">
        <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mb-6">
          <CheckCircle2 size={40} />
        </div>
        <h2 className="text-2xl font-bold mb-2">Peminjaman Berhasil!</h2>
        <p className="text-slate-500 mb-8">Data peminjaman telah disimpan.</p>
        <p className="text-sm text-slate-400">
          Mengalihkan ke daftar barang...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <Link
          href="/dashboard/peminjaman"
          className="inline-flex items-center gap-2 text-slate-500 hover:text-blue-600 transition mb-6"
        >
          <ArrowLeft size={18} />
          Kembali ke Daftar
        </Link>
        <h1 className="text-2xl font-bold mb-1">Form Peminjaman</h1>
        <p className="text-slate-500">
          Anda akan meminjam:{" "}
          <span className="font-semibold text-slate-900 dark:text-white">
            {barangNama}
          </span>
        </p>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 p-4 rounded-xl mb-6 flex items-start gap-3">
          <AlertCircle size={20} className="shrink-0 mt-0.5" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Nama Peminjam</label>
            <input
              type="text"
              name="nama_peminjam"
              required
              value={formData.nama_peminjam}
              onChange={handleChange}
              placeholder="Contoh: Budi Santoso"
              className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Kelas</label>
            <select
              name="kelas_id"
              required
              value={formData.kelas_id}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Pilih Kelas</option>
              {kelas.map((k) => (
                <option key={k.id_kelas} value={k.id_kelas}>
                  {k.nama_kelas}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Jumlah Pinjam</label>
            <input
              type="number"
              name="jumlah"
              min="1"
              required
              value={formData.jumlah}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Rencana Kembali</label>
            <input
              type="date"
              name="tgl_rencana_kembali"
              required
              value={formData.tgl_rencana_kembali}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 disabled:opacity-50"
        >
          {loading ? (
            "Menyimpan..."
          ) : (
            <>
              <Send size={18} />
              Konfirmasi Peminjaman
            </>
          )}
        </button>
      </form>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div>Loading form...</div>}>
      <TambahPeminjamanForm />
    </Suspense>
  );
}
