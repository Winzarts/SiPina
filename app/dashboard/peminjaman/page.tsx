"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Package, Search, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function PeminjamanPage() {
  const [barang, setBarang] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchBarang();
  }, []);

  async function fetchBarang() {
    try {
      const data = await api.barang.getAll();
      setBarang(data);
    } catch (error) {
      console.error("Failed to fetch barang:", error);
    } finally {
      setLoading(false);
    }
  }

  const filteredBarang = barang.filter(
    (item) =>
      item.nama_barang.toLowerCase().includes(search.toLowerCase()) ||
      item.kode_barang.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Peminjaman Barang
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Pilih barang yang ingin dipinjam
          </p>
        </div>

        <div className="relative w-full md:w-72">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Cari barang..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none focus:ring-2 focus:ring-blue-500 transition shadow-sm"
          />
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="h-48 rounded-xl bg-slate-200 dark:bg-slate-800 animate-pulse"
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBarang.map((item) => (
            <div
              key={item.id_barang}
              className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow group flex flex-col justify-between"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                  <Package size={24} />
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    item.jumlah_total > 0
                      ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                      : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"
                  }`}
                >
                  {item.jumlah_total > 0 ? "Tersedia" : "Habis"}
                </span>
              </div>

              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-1">
                  {item.nama_barang}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-3 uppercase tracking-wider">
                  {item.kode_barang}
                </p>

                <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400 mb-6">
                  <div>
                    <span className="block font-medium text-slate-900 dark:text-white">
                      {item.jumlah_total}
                    </span>
                    <span>Stok</span>
                  </div>
                  <div className="h-8 w-px bg-slate-200 dark:bg-slate-700" />
                  <div>
                    <span className="block font-medium text-slate-900 dark:text-white">
                      {item.kondisi}
                    </span>
                    <span>Kondisi</span>
                  </div>
                </div>
              </div>

              <Link
                href={`/dashboard/peminjaman/tambah?barang_id=${item.id_barang}&nama=${encodeURIComponent(item.nama_barang)}`}
                className={`flex items-center justify-center gap-2 w-full py-2.5 rounded-lg font-medium transition ${
                  item.jumlah_total > 0
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-slate-100 dark:bg-slate-700 text-slate-400 cursor-not-allowed"
                }`}
                onClick={(e) => item.jumlah_total <= 0 && e.preventDefault()}
              >
                Pinjam Sekarang
                <ArrowRight
                  size={18}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </Link>
            </div>
          ))}
        </div>
      )}

      {!loading && filteredBarang.length === 0 && (
        <div className="text-center py-20">
          <Package size={48} className="mx-auto text-slate-300 mb-4" />
          <p className="text-slate-500">Tidak ada barang ditemukan</p>
        </div>
      )}
    </div>
  );
}
