```markdown
# Engineering Rules: Clean Code & Security Protocols (Supabase Architecture)

Dokumen ini berisi aturan wajib bagi seluruh pengembang untuk menjaga kualitas kode, maintainabilitas sistem, dan keamanan tingkat tinggi pada ekosistem React dan Supabase.

## 1. Clean Code Standards

### A. General Practices

- **KISS (Keep It Simple, Stupid)**: Hindari over-engineering. Tulis kode yang langsung menyelesaikan masalah secara eksplisit dan mudah dipahami developer lain.
- **DRY (Don't Repeat Yourself)**: Ekstrak logika atau komponen UI yang digunakan berulang kali menjadi fungsi utilitas (_utility functions_) atau komponen reusable.
- **Penamaan Variabel & Fungsi**: Gunakan nama yang deskriptif dan mencerminkan tujuannya (contoh: `fetchUserWorkflows()` lebih baik daripada `getData()`). Gunakan `camelCase` untuk fungsi/variabel dan `PascalCase` untuk komponen.

### B. Supabase Client Integration (React)

- **Single Client Instance**: Jangan menginisialisasi `createClient()` berulang kali di berbagai komponen. Buat satu berkas konfigurasi tunggal (misal: `src/utils/supabaseClient.ts`) dan ekspor instance tersebut untuk digunakan secara global.
- **Custom Hooks untuk Data Fetching**: Bungkus query Supabase (`supabase.from().select()`) di dalam custom React Hooks (atau gunakan library seperti `@tanstack/react-query`) untuk memisahkan logika query dari komponen UI presentasional.
- **Real-time Subscription Lifecycle**: Jika mengaktifkan fitur Real-time (`supabase.channel()`), pastikan untuk selalu melakukan _unsubscribe_ di dalam _cleanup function_ `useEffect` guna mencegah kebocoran memori (_memory leaks_).

---

## 2. Security Protocols & Rules (Supabase Specific)

Keamanan pada Supabase berpusat pada arsitektur "Client-to-Database". Aturan di bawah ini wajib dipatuhi untuk mencegah kebocoran data.

### A. Row Level Security (RLS) - WAJIB AKTIF

- **Jangan Pernah Mematikan RLS**: Semua tabel baru yang dibuat di dashboard Supabase **wajib** mengaktifkan Row Level Security (RLS).
- **Aturan Akses (Policies)**: Jangan membuat policy blanket (`true` untuk semua operasi). Gunakan fungsi bawaan Postgres seperti `auth.uid()` untuk memastikan user hanya bisa membaca, mengubah, atau menghapus data milik mereka sendiri.
- **Proteksi Supabase Storage**: Terapkan RLS policies yang sama ketatnya pada Storage Buckets untuk mengamankan file/gambar yang diunggah pengguna.

### B. Manajemen Kredensial & API Keys

- **Anon Key vs Service Role Key**:
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY` atau `VITE_SUPABASE_ANON_KEY` aman dipublikasikan di frontend karena keamanannya sudah dijaga oleh RLS.
  - `SUPABASE_SERVICE_ROLE_KEY` memiliki hak akses penuh bypass RLS. **Dilarang keras memasukkan Service Role Key ke dalam kode frontend.** Key ini hanya boleh digunakan di lingkungan server yang aman (seperti Edge Functions atau Laravel backend).
- **Proteksi Repositori Git**: Pastikan berkas `.env` yang berisi kredensial lokal terdaftar di `.gitignore`. Jangan pernah melakukan push kredensial ke public/private repository.

### C. Validasi Data & Proteksi Database

- **Postgres Check Constraints**: Jangan hanya mengandalkan validasi di frontend. Gunakan fitur _Check Constraints_, _Foreign Keys_, dan tipe data Postgres yang tepat untuk memastikan integritas data langsung di level database.
- **Database Functions & Edge Functions**: Untuk operasi kompleks yang membutuhkan validasi multi-tabel atau integrasi pihak ketiga (seperti payment gateway), gunakan _Supabase Edge Functions_ atau _Postgres Functions (RPC)_ untuk menyembunyikan logika bisnis sensitif dari client-side.
```
