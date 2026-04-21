"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Package,
  MapPin,
  Tag,
  Info,
  AlertCircle,
  Loader2,
  Save,
  TriangleAlert,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import Link from "next/link";

interface Kategori {
  id_kategori: number;
  nama_kategori: string;
}

interface Barang {
  id_barang: number;
  kode_barang: string;
  nama_barang: string;
  id_kategori: number;
  nama_kategori: string;
  jumlah_total: number;
  lokasi: string;
  kondisi: string;
  status: string;
  created_at?: string;
}

export default function BarangPage() {
  const [barang, setBarang] = useState<Barang[]>([]);
  const [categories, setCategories] = useState<Kategori[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Form State
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingItem, setEditingItem] = useState<Barang | null>(null);
  const [formData, setFormData] = useState({
    kode_barang: "",
    nama_barang: "",
    id_kategori: 0,
    jumlah_total: 0,
    lokasi: "",
    kondisi: "Baik",
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [barangData, kategoriData] = await Promise.all([
        api.barang.getAll(),
        api.kategori.getAll(),
      ]);
      setBarang(barangData);
      setCategories(kategoriData);

      // Update default category id in form if categories available
      if (kategoriData.length > 0 && formData.id_kategori === 0) {
        setFormData((prev) => ({
          ...prev,
          id_kategori: kategoriData[0].id_kategori,
        }));
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData({
      kode_barang: "",
      nama_barang: "",
      id_kategori: categories.length > 0 ? categories[0].id_kategori : 0,
      jumlah_total: 0,
      lokasi: "",
      kondisi: "Baik",
    });
    setIsSheetOpen(true);
  };

  const handleOpenEdit = (item: Barang) => {
    setEditingItem(item);
    setFormData({
      kode_barang: item.kode_barang,
      nama_barang: item.nama_barang,
      id_kategori: item.id_kategori,
      jumlah_total: item.jumlah_total,
      lokasi: item.lokasi,
      kondisi: item.kondisi,
    });
    setIsSheetOpen(true);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "jumlah_total" ? parseInt(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.id_kategori === 0) {
      alert("Pilih kategori terlebih dahulu.");
      return;
    }
    setIsSubmitting(true);
    try {
      if (editingItem) {
        await api.barang.update(editingItem.id_barang, formData);
      } else {
        await api.barang.create(formData);
      }
      setIsSheetOpen(false);
      fetchData();
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredBarang = barang.filter(
    (item) =>
      item.nama_barang.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.kode_barang.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.lokasi.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleDelete = async (id_barang: number) => {
    if (confirm("Apakah Anda yakin ingin menghapus barang ini?")) {
      try {
        await api.barang.delete(id_barang);
        fetchData();
      } catch (err: any) {
        let errorMsg = err.message;
        if (
          err.message.includes("23503") ||
          err.message.includes("foreign key")
        ) {
          errorMsg =
            "Tidak dapat menghapus barang ini karena sudah memiliki riwayat peminjaman. Sistem harus menyimpan data ini untuk laporan.";
        }
        alert("Gagal menghapus: " + errorMsg);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Data Barang</h1>
          <p className="text-slate-500">
            Kelola informasi inventaris barang Anda.
          </p>
        </div>
        <Button
          onClick={handleOpenAdd}
          disabled={categories.length === 0}
          className="bg-blue-600 hover:bg-blue-700 text-white gap-2 h-11 px-6 rounded-xl shadow-lg shadow-blue-500/20 disabled:opacity-50"
        >
          <Plus size={18} />
          Tambah Barang
        </Button>
      </div>

      {categories.length === 0 && !loading && (
        <div className="bg-orange-50 dark:bg-orange-900/10 border border-orange-200 dark:border-orange-800 p-4 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 animate-in fade-in slide-in-from-top-4 duration-500 shadow-sm border-l-4 border-l-orange-500">
          <div className="flex gap-3 text-left">
            <div className="shrink-0 w-10 h-10 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-xl flex items-center justify-center">
              <TriangleAlert size={20} />
            </div>
            <div>
              <p className="font-bold text-orange-800 dark:text-orange-300">
                Kategori Belum Tersedia
              </p>
              <p className="text-sm text-orange-700/80 dark:text-orange-400/80">
                Anda harus menambahkan minimal satu kategori sebelum dapat
                memasukkan data barang.
              </p>
            </div>
          </div>
          <Link href="/dashboard/kategori">
            <Button
              variant="outline"
              className="border-orange-200 text-orange-700 hover:bg-orange-100 dark:hover:bg-orange-900/20 gap-2 shrink-0 rounded-xl"
            >
              Buat Kategori
              <ArrowRight size={16} />
            </Button>
          </Link>
        </div>
      )}

      <div className="flex items-center gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="relative flex-1">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            size={18}
          />
          <Input
            placeholder="Search by name, code, or location..."
            className="pl-11 h-11 bg-slate-50 dark:bg-slate-800 border-none rounded-xl focus-visible:ring-blue-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="h-48 rounded-2xl bg-slate-100 dark:bg-slate-800 animate-pulse shadow-sm"
            />
          ))}
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center p-12 bg-red-50 dark:bg-red-900/10 rounded-2xl border border-red-100 dark:border-red-900/30 text-red-600">
          <AlertCircle size={48} className="mb-4 opacity-50" />
          <h3 className="text-lg font-semibold">Gagal memuat data</h3>
          <p className="text-sm opacity-80 mb-4">{error}</p>
          <Button
            onClick={fetchData}
            variant="outline"
            className="border-red-200 text-red-600 hover:bg-red-50 rounded-xl"
          >
            Coba Lagi
          </Button>
        </div>
      ) : filteredBarang.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-20 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 text-slate-500">
          <div className="p-4 bg-white dark:bg-slate-800 rounded-full shadow-sm mb-4">
            <Package size={32} className="opacity-20" />
          </div>
          <p className="font-medium text-slate-400">
            Tidak ada barang yang ditemukan.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBarang.map((item) => (
            <div
              key={item.id_barang}
              className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 hover:shadow-2xl hover:shadow-blue-500/10 hover:border-blue-500/30 transition-all duration-300 relative overflow-hidden"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-xl">
                  <Package size={24} />
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                    onClick={() => handleOpenEdit(item)}
                  >
                    <Edit2 size={16} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                    onClick={() => handleDelete(item.id_barang)}
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>

              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-1 flex items-center gap-1">
                  <Tag size={12} />
                  {item.kode_barang}
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 line-clamp-1 group-hover:text-blue-600 transition-colors">
                  {item.nama_barang}
                </h3>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <MapPin size={14} className="text-slate-400" />
                    <span>{item.lokasi}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-500 text-[11px] font-medium px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded w-fit">
                    Kategori:{" "}
                    {categories.find(
                      (c) => String(c.id_kategori) == String(item.id_kategori),
                    )?.nama_kategori || `Unknown (ID: ${item.id_kategori})`}
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">
                      Stok Tersedia
                    </span>
                    <span className="text-xl font-black text-slate-900 dark:text-white">
                      {item.jumlah_total}{" "}
                      <span className="text-xs font-normal text-slate-500">
                        pcs
                      </span>
                    </span>
                  </div>
                  <div
                    className={`px-4 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider shadow-sm ${
                      item.status?.toLowerCase() === "tersedia"
                        ? "bg-green-500/10 text-green-600 dark:text-green-400"
                        : "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                    }`}
                  >
                    {item.status}
                  </div>
                </div>
              </div>

              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-blue-500/10 transition-colors" />
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Sheet */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent
          side="right"
          className="w-full sm:max-w-md p-0 overflow-hidden border-l-0"
        >
          <div className="flex flex-col h-full bg-white dark:bg-slate-950">
            <SheetHeader className="p-8 pb-4 bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-blue-500/20">
                <Package size={24} />
              </div>
              <SheetTitle className="text-2xl font-bold">
                {editingItem ? "Edit Barang" : "Tambah Barang Baru"}
              </SheetTitle>
              <SheetDescription className="text-slate-500">
                {editingItem
                  ? "Perbarui informasi barang yang sudah terdaftar."
                  : "Masukkan detail barang untuk menambah stok baru."}
              </SheetDescription>
            </SheetHeader>

            <form
              onSubmit={handleSubmit}
              className="flex-1 overflow-y-auto p-8 space-y-6"
            >
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Kode Barang
                </label>
                <Input
                  name="kode_barang"
                  required
                  value={formData.kode_barang}
                  onChange={handleInputChange}
                  placeholder="Contoh: ELK-001"
                  className="h-11 rounded-xl bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Nama Barang
                </label>
                <Input
                  name="nama_barang"
                  required
                  value={formData.nama_barang}
                  onChange={handleInputChange}
                  placeholder="Contoh: Laptop ThinkPad"
                  className="h-11 rounded-xl bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Kategori
                  </label>
                  <select
                    name="id_kategori"
                    required
                    value={formData.id_kategori}
                    onChange={handleInputChange}
                    className="w-full h-11 px-4 border rounded-xl bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  >
                    <option value={0} disabled>
                      Pilih Kategori
                    </option>
                    {categories.map((cat) => (
                      <option key={cat.id_kategori} value={cat.id_kategori}>
                        {cat.nama_kategori}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Jumlah Stok
                  </label>
                  <Input
                    name="jumlah_total"
                    type="number"
                    required
                    min="0"
                    value={formData.jumlah_total}
                    onChange={handleInputChange}
                    className="h-11 rounded-xl bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Kondisi
                  </label>
                  <select
                    name="kondisi"
                    required
                    value={formData.kondisi}
                    onChange={handleInputChange}
                    className="w-full h-11 px-4 border rounded-xl bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  >
                    <option value="Baik">Baik</option>
                    <option value="Rusak Ringan">Rusak Ringan</option>
                    <option value="Rusak Berat">Rusak Berat</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Lokasi
                  </label>
                  <Input
                    name="lokasi"
                    required
                    value={formData.lokasi}
                    onChange={handleInputChange}
                    placeholder="Contoh: Gudang A"
                    className="h-11 rounded-xl bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800"
                  />
                </div>
              </div>
            </form>

            <div className="p-8 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex gap-3">
              <Button
                type="button"
                variant="outline"
                className="flex-1 h-12 rounded-xl border-slate-200 dark:border-slate-800"
                onClick={() => setIsSheetOpen(false)}
              >
                Batal
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex-1 h-12 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold gap-2 shadow-lg shadow-blue-500/20"
              >
                {isSubmitting ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <Save size={20} />
                )}
                Simpan
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
