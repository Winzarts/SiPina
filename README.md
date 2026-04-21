# KIK - Frontend

KIK (Kartu Inventaris Kelas) Frontend adalah antarmuka web modern yang dibangun menggunakan Next.js untuk sistem manajemen inventaris sekolah. Dashboard ini memungkinkan petugas dan admin untuk mengelola data barang, memantau peminjaman, dan melihat statistik secara real-time.

## ✨ Fitur Utama

- **Modern Dashboard**: Ringkasan data inventaris dan statistik peminjaman.
- **Manajemen Data**: Interface intuitif untuk pengelolaan Barang, Kategori, Kelas, dan Sekolah.
- **Sistem Peminjaman**: Alur kerja peminjaman dan pengembalian barang yang mudah.
- **Responsive Design**: Tampilan yang optimal baik di desktop maupun perangkat mobile.
- **Dark Mode Support**: Dukungan tema gelap dan terang melalui `next-themes`.
- **UI Komponen Premium**: Menggunakan komponen berbasis Radix UI untuk aksesibilitas dan performa terbaik.

## 🛠️ Stack Teknologi

- **Framework**: Next.js 16+ (App Router)
- **Library UI**: React 19
- **Styling**: Tailwind CSS 4
- **Components**: Radix UI (Shadcn UI style)
- **Icons**: Lucide React
- **Data Handling**: Fetch API & Custom API Utility

## 📋 Prasyarat

- Node.js (v18+)
- Backend KIK sedang berjalan (port default: 4000)

## ⚙️ Instalasi

1. Clone repositori ini.
2. Instal dependensi:
   ```bash
   npm install
   ```
3. Konfigurasi Environment:
   Buat file `.env.local` dan tentukan URL API Backend:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:4000
   ```
4. Jalankan aplikasi dalam mode development:
   ```bash
   npm run dev
   ```
5. Buka [http://localhost:3000](http://localhost:3000) di browser Anda.

## 📂 Struktur Folder

```text
KIK-Frontend/
├── app/             # Next.js App Router (Pages & Layout)
├── components/      # Komponen UI Reusable
├── hooks/           # Custom React Hooks
├── lib/             # Utility functions & API client
├── public/          # Static assets (images, icons)
├── package.json     # Dependensi dan script
└── next.config.ts   # Konfigurasi Next.js
```

## 🚀 Build for Production

Untuk membuat build produksi:
```bash
npm run build
npm run start
```

## 📝 Lisensi

ISC License.
