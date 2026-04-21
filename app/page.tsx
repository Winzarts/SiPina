"use client";

import { useState } from "react";

export default function LoginPage() {
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    nama_sekolah: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (isRegister && formData.password !== formData.confirmPassword) {
      setError("Password dan konfirmasi password tidak cocok");
      setLoading(false);
      return;
    }

    const endpoint = isRegister ? "/auth/register" : "/auth/login";
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

    try {
      const response = await fetch(`${baseUrl}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(
          isRegister
            ? {
                username: formData.username,
                email: formData.email,
                password: formData.password,
                nama_sekolah: formData.nama_sekolah,
              }
            : { email: formData.email, password: formData.password },
        ),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Terjadi kesalahan");
      }

      if (isRegister) {
        alert("Register berhasil! Silakan login.");
        setIsRegister(false);
      } else {
        localStorage.setItem("token", data.token);
        alert("Login berhasil!");
        window.location.href = "/dashboard";
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-indigo-100 via-slate-50 to-blue-100 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950 px-4 transition-colors duration-1000 overflow-hidden relative">
      {/* Decorative Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-400/10 rounded-full blur-[120px] animate-pulse delay-1000"></div>

      <div className="w-full max-w-md glass-card p-10 rounded-3xl relative z-10 animate-in fade-in zoom-in duration-700">
        <div className="flex flex-col items-center mb-10">
          <div className="w-20 h-20 bg-transparent mb-6 drop-shadow-2xl hover:scale-110 transition-transform duration-500">
            <img
              src="Sipina.png"
              alt="logo"
              className="w-full h-full object-contain"
            />
          </div>
          <h1 className="text-4xl font-black text-center text-slate-900 dark:text-white tracking-tight">
            {isRegister ? "Join " : "Welcome to "}
            <span className="text-gradient">SiPina</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-3 font-medium">
            Sistem Peminjaman Inventaris Barang Sekolah
          </p>
        </div>

        {error && (
          <div
            className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3.5 rounded-2xl mb-8 text-sm flex items-center gap-3 animate-in slide-in-from-top-2 duration-300"
            role="alert"
          >
            <span className="shrink-0 text-lg">⚠️</span>
            <span className="font-medium">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {isRegister && (
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 ml-1">
                Nama Lengkap
              </label>
              <input
                type="text"
                name="username"
                required
                placeholder="John Doe"
                value={formData.username}
                onChange={handleChange}
                className="w-full px-5 py-3.5 bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-4 focus:ring-primary/20 focus:border-primary transition-all dark:text-white placeholder:text-slate-400"
              />
            </div>
          )}

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 ml-1">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              required
              placeholder="name@company.com"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-5 py-3.5 bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-4 focus:ring-primary/20 focus:border-primary transition-all dark:text-white placeholder:text-slate-400"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 ml-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              required
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-5 py-3.5 bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-4 focus:ring-primary/20 focus:border-primary transition-all dark:text-white placeholder:text-slate-400"
            />
          </div>

          {isRegister && (
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 ml-1">
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                required
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-5 py-3.5 bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-4 focus:ring-primary/20 focus:border-primary transition-all dark:text-white placeholder:text-slate-400"
              />
            </div>
          )}
          {isRegister && (
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 ml-1">
                Nama Sekolah
              </label>
              <input
                type="text"
                name="nama_sekolah"
                required
                placeholder="Contoh: SMK Negeri 1 Jakarta"
                value={formData.nama_sekolah}
                onChange={handleChange}
                className="w-full px-5 py-3.5 bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-4 focus:ring-primary/20 focus:border-primary transition-all dark:text-white placeholder:text-slate-400"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-4 rounded-2xl text-white font-bold transition-all shadow-xl shadow-primary/20 active:scale-[0.98] ${
              loading
                ? "opacity-50 cursor-not-allowed"
                : "hover:shadow-primary/40 hover:-translate-y-0.5"
            } ${
              isRegister
                ? "bg-gradient-to-r from-emerald-500 to-teal-600"
                : "bg-gradient-to-r from-primary to-indigo-600"
            }`}
          >
            {loading
              ? "Processing..."
              : isRegister
                ? "Create Account"
                : "Sign In"}
          </button>
        </form>

        <div className="relative my-10">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-slate-200 dark:border-slate-800"></span>
          </div>
          <div className="relative flex justify-center text-xs uppercase tracking-widest font-bold">
            <span className="bg-transparent px-4 text-slate-400">OR</span>
          </div>
        </div>

        <p className="text-center text-sm text-slate-500 dark:text-slate-400 font-medium">
          {isRegister ? "Already have an account?" : "New to SiPina?"}{" "}
          <span
            onClick={() => {
              setIsRegister(!isRegister);
              setError("");
            }}
            className="text-primary font-bold cursor-pointer hover:underline ml-1 underline-offset-4"
          >
            {isRegister ? "Sign In" : "Register Now"}
          </span>
        </p>
      </div>
    </div>
  );
}
