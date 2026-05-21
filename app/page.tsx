"use client";

import { useState } from "react";
import { ThemeToggle } from "@/components/theme-toggle";

type ViewState = "login" | "register" | "register_otp" | "forgot_password" | "reset_password";

export default function LoginPage() {
  const [currentView, setCurrentView] = useState<ViewState>("login");
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    nama_sekolah: "",
  });

  const [otpCode, setOtpCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRequestRegisterOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccessMessage("");

    if (formData.password !== formData.confirmPassword) {
      setError("Password dan konfirmasi password tidak cocok");
      setLoading(false);
      return;
    }

    const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

    try {
      const response = await fetch(`${BASE_URL}/auth/send-register-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          username: formData.username,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Gagal mengirim OTP pendaftaran");
      }

      setSuccessMessage("Kode OTP pendaftaran telah dikirim ke email Anda.");
      setCurrentView("register_otp");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

    try {
      const response = await fetch(`${baseUrl}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
          nama_sekolah: formData.nama_sekolah,
          otp: otpCode,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Gagal melakukan registrasi");
      }

      alert("Registrasi berhasil! Silakan login.");
      setCurrentView("login");
      setOtpCode("");
      // Reset form password
      setFormData({
        ...formData,
        password: "",
        confirmPassword: "",
      });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestResetOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccessMessage("");

    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

    try {
      const response = await fetch(`${baseUrl}/auth/send-reset-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Gagal mengirim OTP reset password");
      }

      setSuccessMessage("Kode OTP reset password telah dikirim ke email Anda.");
      setCurrentView("reset_password");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (newPassword !== confirmNewPassword) {
      setError("Password baru dan konfirmasi password tidak cocok");
      setLoading(false);
      return;
    }

    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

    try {
      const response = await fetch(`${baseUrl}/auth/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          newPassword: newPassword,
          otp: otpCode,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Gagal menyetel ulang password");
      }

      alert("Password berhasil diperbarui! Silakan login.");
      setCurrentView("login");
      setOtpCode("");
      setNewPassword("");
      setConfirmNewPassword("");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

    try {
      const response = await fetch(`${baseUrl}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Terjadi kesalahan");
      }

      localStorage.setItem("token", data.token);
      alert("Login berhasil!");
      window.location.href = "/dashboard";
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-indigo-100 via-slate-50 to-blue-100 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950 px-4 transition-colors duration-1000 overflow-hidden relative">
      {/* Decorative Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-400/5 rounded-full delay-1000"></div>

      <div className="absolute top-6 right-6 z-50">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-md glass-card p-10 rounded-3xl relative z-10 animate-in fade-in zoom-in duration-700">
        <div className="flex flex-col items-center mb-8">
          <div className="w-20 h-20 bg-transparent mb-6 drop-shadow-2xl hover:scale-110 transition-transform duration-500">
            <img
              src="/Sipina.png"
              alt="logo"
              className="w-full h-full object-contain"
            />
          </div>
          <h1 className="text-4xl font-black text-center text-slate-900 dark:text-white tracking-tight">
            SiPina
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-2 font-medium text-center">
            Sistem Peminjaman Inventaris Barang Sekolah
          </p>
        </div>

        {error && (
          <div
            className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3.5 rounded-2xl mb-6 text-sm flex items-center gap-3 animate-in slide-in-from-top-2 duration-300"
            role="alert"
          >
            <span className="shrink-0 text-lg">⚠️</span>
            <span className="font-medium">{error}</span>
          </div>
        )}

        {successMessage && (
          <div
            className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 px-4 py-3.5 rounded-2xl mb-6 text-sm flex items-center gap-3 animate-in slide-in-from-top-2 duration-300"
            role="alert"
          >
            <span className="shrink-0 text-lg">✅</span>
            <span className="font-medium">{successMessage}</span>
          </div>
        )}

        {/* --- VIEW: LOGIN --- */}
        {currentView === "login" && (
          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 ml-1">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                required
                placeholder="name@school.edu"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-5 py-3.5 bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-4 focus:ring-primary/20 focus:border-primary transition-all dark:text-white placeholder:text-slate-400"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
                  Password
                </label>
                <span
                  onClick={() => {
                    setError("");
                    setSuccessMessage("");
                    setCurrentView("forgot_password");
                  }}
                  className="text-xs text-primary font-bold hover:underline cursor-pointer"
                >
                  Forgot Password?
                </span>
              </div>
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

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-2xl text-white font-bold transition-all shadow-xl shadow-primary/20 active:scale-[0.98] bg-gradient-to-r from-primary to-indigo-600 hover:shadow-primary/40 hover:-translate-y-0.5"
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>

            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-slate-200 dark:border-slate-800"></span>
              </div>
              <div className="relative flex justify-center text-xs uppercase tracking-widest font-bold">
                <span className="bg-transparent px-4 text-slate-400">OR</span>
              </div>
            </div>

            <p className="text-center text-sm text-slate-500 dark:text-slate-400 font-medium">
              New to SiPina?{" "}
              <span
                onClick={() => {
                  setCurrentView("register");
                  setError("");
                  setSuccessMessage("");
                }}
                className="text-primary font-bold cursor-pointer hover:underline ml-1 underline-offset-4"
              >
                Register Now
              </span>
            </p>
          </form>
        )}

        {/* --- VIEW: REGISTER --- */}
        {currentView === "register" && (
          <form onSubmit={handleRequestRegisterOtp} className="space-y-5">
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

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 ml-1">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                required
                placeholder="name@school.edu"
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

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-2xl text-white font-bold transition-all shadow-xl shadow-primary/20 active:scale-[0.98] bg-gradient-to-r from-emerald-500 to-teal-600 hover:shadow-emerald-500/40 hover:-translate-y-0.5"
            >
              {loading ? "Sending OTP..." : "Create Account"}
            </button>

            <p className="text-center text-sm text-slate-500 dark:text-slate-400 font-medium pt-4">
              Already have an account?{" "}
              <span
                onClick={() => {
                  setCurrentView("login");
                  setError("");
                  setSuccessMessage("");
                }}
                className="text-primary font-bold cursor-pointer hover:underline ml-1 underline-offset-4"
              >
                Sign In
              </span>
            </p>
          </form>
        )}

        {/* --- VIEW: REGISTER OTP VERIFICATION --- */}
        {currentView === "register_otp" && (
          <form onSubmit={handleVerifyRegister} className="space-y-5 animate-in fade-in duration-300">
            <div className="text-center mb-4">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Verify Your Email</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Kami telah mengirim kode verifikasi 6 digit ke <strong>{formData.email}</strong>.
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 ml-1">
                6-Digit OTP Code
              </label>
              <input
                type="text"
                required
                maxLength={6}
                placeholder="123456"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                className="w-full text-center tracking-[8px] font-mono text-2xl px-5 py-3.5 bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-4 focus:ring-primary/20 focus:border-primary transition-all dark:text-white placeholder:text-slate-400"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-2xl text-white font-bold transition-all shadow-xl shadow-primary/20 active:scale-[0.98] bg-gradient-to-r from-emerald-500 to-teal-600 hover:shadow-emerald-500/40 hover:-translate-y-0.5"
            >
              {loading ? "Verifying..." : "Verify & Create Account"}
            </button>

            <p className="text-center text-sm text-slate-500 dark:text-slate-400 font-medium pt-4">
              Incorrect email?{" "}
              <span
                onClick={() => {
                  setCurrentView("register");
                  setError("");
                  setSuccessMessage("");
                }}
                className="text-primary font-bold cursor-pointer hover:underline ml-1 underline-offset-4"
              >
                Back to Register
              </span>
            </p>
          </form>
        )}

        {/* --- VIEW: FORGOT PASSWORD REQUEST --- */}
        {currentView === "forgot_password" && (
          <form onSubmit={handleRequestResetOtp} className="space-y-5 animate-in fade-in duration-300">
            <div className="text-center mb-4">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Forgot Password</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Masukkan email terdaftar Anda untuk menerima kode OTP verifikasi pemulihan.
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 ml-1">
                Email Address
              </label>
              <input
                type="email"
                required
                placeholder="name@school.edu"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-5 py-3.5 bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-4 focus:ring-primary/20 focus:border-primary transition-all dark:text-white placeholder:text-slate-400"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-2xl text-white font-bold transition-all shadow-xl shadow-primary/20 active:scale-[0.98] bg-gradient-to-r from-primary to-indigo-600 hover:shadow-primary/40 hover:-translate-y-0.5"
            >
              {loading ? "Sending Code..." : "Send Reset Code"}
            </button>

            <p className="text-center text-sm text-slate-500 dark:text-slate-400 font-medium pt-4">
              Remembered password?{" "}
              <span
                onClick={() => {
                  setCurrentView("login");
                  setError("");
                  setSuccessMessage("");
                }}
                className="text-primary font-bold cursor-pointer hover:underline ml-1 underline-offset-4"
              >
                Back to Login
              </span>
            </p>
          </form>
        )}

        {/* --- VIEW: RESET PASSWORD INPUT --- */}
        {currentView === "reset_password" && (
          <form onSubmit={handleVerifyResetPassword} className="space-y-5 animate-in fade-in duration-300">
            <div className="text-center mb-4">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Reset Password</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Masukkan kode OTP dari email Anda beserta kata sandi baru.
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 ml-1">
                6-Digit OTP Code
              </label>
              <input
                type="text"
                required
                maxLength={6}
                placeholder="123456"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                className="w-full text-center tracking-[8px] font-mono text-xl px-5 py-3.5 bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-4 focus:ring-primary/20 focus:border-primary transition-all dark:text-white placeholder:text-slate-400"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 ml-1">
                New Password
              </label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-5 py-3.5 bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-4 focus:ring-primary/20 focus:border-primary transition-all dark:text-white placeholder:text-slate-400"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 ml-1">
                Confirm New Password
              </label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                className="w-full px-5 py-3.5 bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-4 focus:ring-primary/20 focus:border-primary transition-all dark:text-white placeholder:text-slate-400"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-2xl text-white font-bold transition-all shadow-xl shadow-primary/20 active:scale-[0.98] bg-gradient-to-r from-primary to-indigo-600 hover:shadow-primary/40 hover:-translate-y-0.5"
            >
              {loading ? "Updating..." : "Save New Password"}
            </button>

            <p className="text-center text-sm text-slate-500 dark:text-slate-400 font-medium pt-4">
              Cancel reset?{" "}
              <span
                onClick={() => {
                  setCurrentView("login");
                  setError("");
                  setSuccessMessage("");
                }}
                className="text-primary font-bold cursor-pointer hover:underline ml-1 underline-offset-4"
              >
                Back to Login
              </span>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
