"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { UserPlus, Loader2, ArrowLeft, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function AddPetugasPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await api.auth.createPetugas(formData);
      setSuccess(true);
      setTimeout(() => {
        router.push("/dashboard");
      }, 2000);
    } catch (err: any) {
      setError(err.message || "Gagal membuat akun petugas");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] animate-in fade-in zoom-in duration-500">
        <div className="bg-emerald-50 dark:bg-emerald-900/20 p-8 rounded-full mb-6">
          <CheckCircle2 size={64} className="text-emerald-500" />
        </div>
        <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-2 text-center">
          Berhasil Dibuat!
        </h1>
        <p className="text-slate-500 text-center max-w-xs mb-8">
          Akun petugas baru telah berhasil didaftarkan ke dalam sistem.
        </p>
        <div className="flex gap-4">
          <Button
            onClick={() => setSuccess(false)}
            variant="outline"
            className="rounded-2xl px-8"
          >
            Tambah Lagi
          </Button>
          <Button asChild className="rounded-2xl px-8">
            <Link href="/dashboard">Ke Dashboard</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-8">
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-primary mb-6 transition-colors"
      >
        <ArrowLeft size={16} />
        Kembali ke Dashboard
      </Link>

      <Card className="border-none shadow-2xl shadow-slate-200/50 dark:shadow-none dark:bg-slate-900/50 rounded-[2rem] overflow-hidden">
        <CardHeader className="p-8 pb-4">
          <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
            <UserPlus className="text-primary" size={28} />
          </div>
          <CardTitle className="text-2xl font-black tracking-tight">
            Tambah Petugas
          </CardTitle>
          <CardDescription className="text-slate-500 font-medium pt-1">
            Buat akun petugas baru untuk mengelola peminjaman barang.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-8 pt-4">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-6">
              <div className="space-y-2">
                <Label
                  htmlFor="username"
                  className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1"
                >
                  Username
                </Label>
                <Input
                  id="username"
                  placeholder="Contoh: petugas_perpustakaan"
                  required
                  className="rounded-2xl border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 h-12 px-4 focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                  value={formData.username}
                  onChange={(e) =>
                    setFormData({ ...formData, username: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1"
                >
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="petugas@sipina.id"
                  required
                  className="rounded-2xl border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 h-12 px-4 focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="password"
                  className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1"
                >
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  required
                  className="rounded-2xl border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 h-12 px-4 focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 text-red-600 dark:text-red-400 text-sm font-bold p-4 rounded-2xl animate-shake">
                {error}
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl h-14 font-black uppercase tracking-widest text-xs shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Memproses...
                </>
              ) : (
                "Simpan Akun Petugas"
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="p-8 pt-0 flex justify-center border-t border-slate-50 dark:border-slate-800 mt-4">
          <p className="text-[10px] uppercase font-bold tracking-[0.2em] text-slate-400 mt-4">
            Secured SIPINA Cloud Infrastructure
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
