# SiPina

SiPina (Si Peminjaman Sarana dan Prasarana) adalah antarmuka web modern yang dibangun menggunakan Next.js untuk sistem manajemen inventaris sekolah. Dashboard ini memungkinkan petugas dan admin untuk mengelola data barang, memantau peminjaman, dan melihat statistik secara real-time.

## ✨ Fitur Utama

- **Modern Dashboard**: Ringkasan data inventaris dan statistik peminjaman.
- **Manajemen Data**: Interface intuitif untuk pengelolaan Barang, Kategori, Kelas, dan Sekolah.
- **Pencatatan Peminjaman (Fitur Utama)**: Fungsi inti website untuk mengelola sirkulasi barang secara akurat dan real-time. Fitur ini mencakup:
  - **Pencatatan Detail**: Mendata identitas peminjam, barang yang dipinjam, jumlah, tanggal peminjaman, dan batas waktu pengembalian.
  - **Pelacakan Status**: Memantau status transaksi secara real-time (seperti "Sedang Dipinjam", "Terlambat", atau "Dikembalikan").
  - **Pengingat & Jatuh Tempo**: Memudahkan identifikasi barang yang mendekati atau telah melewati batas waktu pengembalian (Overdue).
  - **Filter, Pencarian, & Pengurutan**: Mencari data secara spesifik atau mengurutkan riwayat peminjaman berdasarkan tanggal terbaru, status, maupun peminjam untuk efisiensi manajemen.
- **Responsive Design**: Tampilan yang optimal baik di desktop maupun perangkat mobile.
- **Dark Mode Support**: Dukungan tema gelap dan terang melalui `next-themes`.
- **UI Komponen Premium**: Menggunakan komponen berbasis Radix UI untuk aksesibilitas dan performa terbaik.

## 👥 Alur Pengguna (User Flow)

SiPina memiliki dua peran pengguna dengan alur kerja yang berbeda:

### 👑 Alur Kerja Admin
Admin memiliki kontrol penuh atas sistem. Tugas utama admin meliputi:
1. **Mengelola Data Master**: Mengakses halaman *Sekolah*, *Kelas*, dan *Kategori* untuk menambah, mengedit, atau menghapus data master yang akan digunakan oleh petugas.
2. **Pengelolaan Petugas**: Menambahkan atau menghapus akun petugas.
3. **Pengelolaan Barang**: Mengelola katalog barang secara menyeluruh.
4. **Pantau Aktivitas**: Melihat semua aktivitas peminjaman dari dashboard utama.

### 💼 Alur Kerja Petugas
Petugas bertugas dalam operasional harian sekolah. Alur kerja petugas meliputi:
1. **Peminjaman Baru**: Menambahkan transaksi peminjaman baru melalui menu *Peminjaman*. Petugas memilih barang, mencatat detail peminjam, dan menentukan tanggal jatuh tempo.
2. **Pengembalian**: Memperbarui status peminjaman menjadi "Dikembalikan" saat barang fisik telah diterima.
3. **Manajemen Barang**: Menambah daftar barang baru ke sistem (seperti alat tulis, perlengkapan olahraga) serta mengupdate kondisi/stok barang.

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
