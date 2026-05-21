"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Tag,
  AlertCircle,
  Loader2,
  Save,
  Grid,
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

interface Kategori {
  id_kategori: number;
  nama_kategori: string;
}

export default function KategoriPage() {
  const [kategori, setKategori] = useState<Kategori[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Form State
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingItem, setEditingItem] = useState<Kategori | null>(null);
  const [formData, setFormData] = useState({
    nama_kategori: "",
  });

  const fetchKategori = async () => {
    setLoading(true);
    try {
      const data = await api.kategori.getAll();
      setKategori(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKategori();
  }, []);

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData({ nama_kategori: "" });
    setIsSheetOpen(true);
  };

  const handleOpenEdit = (item: Kategori) => {
    setEditingItem(item);
    setFormData({ nama_kategori: item.nama_kategori });
    setIsSheetOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ nama_kategori: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editingItem) {
        await api.kategori.update(editingItem.id_kategori, formData);
      } else {
        await api.kategori.create(formData);
      }
      setIsSheetOpen(false);
      fetchKategori();
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredKategori = kategori.filter((item) =>
    item.nama_kategori?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleDelete = async (id_kategori: number) => {
    if (
      confirm(
        "Apakah Anda yakin ingin menghapus kategori ini? Semua barang dengan kategori ini mungkin perlu diperbarui.",
      )
    ) {
      try {
        await api.kategori.delete(id_kategori);
        fetchKategori();
      } catch (err: any) {
        let errorMsg = err.message;
        if (
          err.message.includes("23503") ||
          err.message.includes("foreign key")
        ) {
          errorMsg =
            "Tidak dapat menghapus kategori ini karena masih digunakan oleh beberapa barang. Silakan hapus atau pindahkan barang terkait terlebih dahulu.";
        }
        alert("Gagal menghapus: " + errorMsg);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Kategori Barang</h1>
          <p className="text-slate-500">
            Kelola kelompok kategori untuk inventaris Anda.
          </p>
        </div>
        <Button
          onClick={handleOpenAdd}
          className="bg-blue-600 hover:bg-blue-700 text-white gap-2 h-11 px-6 rounded-xl shadow-lg shadow-blue-500/20"
        >
          <Plus size={18} />
          Tambah Kategori
        </Button>
      </div>

      <div className="flex items-center gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="relative flex-1">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            size={18}
          />
          <Input
            placeholder="Search categories..."
            className="pl-11 h-11 bg-slate-50 dark:bg-slate-800 border-none rounded-xl focus-visible:ring-blue-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-24 rounded-2xl bg-slate-100 dark:bg-slate-800 animate-pulse shadow-sm"
            />
          ))}
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center p-12 bg-red-50 dark:bg-red-900/10 rounded-2xl border border-red-100 dark:border-red-900/30 text-red-600">
          <AlertCircle size={48} className="mb-4 opacity-50" />
          <h3 className="text-lg font-semibold">Gagal memuat data</h3>
          <p className="text-sm opacity-80 mb-4">{error}</p>
          <Button
            onClick={fetchKategori}
            variant="outline"
            className="border-red-200 text-red-600 hover:bg-red-50 rounded-xl"
          >
            Coba Lagi
          </Button>
        </div>
      ) : filteredKategori.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-20 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 text-slate-500">
          <div className="p-4 bg-white dark:bg-slate-800 rounded-full shadow-sm mb-4">
            <Tag size={32} className="opacity-20" />
          </div>
          <p className="font-medium text-slate-400">
            Tidak ada kategori yang ditemukan.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredKategori.map((item) => (
            <div
              key={item.id_kategori}
              className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 hover:shadow-xl hover:shadow-blue-500/10 hover:border-blue-500/30 transition-all duration-300 relative overflow-hidden"
            >
              <div className="flex justify-between items-center relative z-10">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <Grid size={18} />
                  </div>
                  <h3 className="font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors uppercase tracking-tight">
                    {item.nama_kategori}
                  </h3>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                    onClick={() => handleOpenEdit(item)}
                  >
                    <Edit2 size={14} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                    onClick={() => handleDelete(item.id_kategori)}
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
              </div>
              <div className="absolute top-0 right-0 w-20 h-20 rounded-full -mr-10 -mt-10 group-hover:bg-blue-500/10 transition-colors" />
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
                <Tag size={24} />
              </div>
              <SheetTitle className="text-2xl font-bold">
                {editingItem ? "Edit Kategori" : "Tambah Kategori Baru"}
              </SheetTitle>
              <SheetDescription className="text-slate-500">
                {editingItem
                  ? "Perbarui nama kategori produk Anda."
                  : "Buat kategori baru untuk mengelompokkan inventaris."}
              </SheetDescription>
            </SheetHeader>

            <form
              onSubmit={handleSubmit}
              className="flex-1 overflow-y-auto p-8 space-y-6"
            >
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Nama Kategori
                </label>
                <Input
                  name="nama_kategori"
                  required
                  value={formData.nama_kategori}
                  onChange={handleInputChange}
                  placeholder="Contoh: Elektronik, Furniture, dll"
                  className="h-11 rounded-xl bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 focus-visible:ring-blue-500"
                />
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
