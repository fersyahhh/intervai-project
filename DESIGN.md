# Design System & Aesthetic Guidelines

Dokumen ini mendefinisikan standar visual, tata letak, dan identitas desain yang digunakan dalam pengembangan aplikasi. Fokus utama adalah menciptakan antarmuka yang modern, fungsional, presisi, dan konsisten.

## 1. Core Aesthetic Principles

Desain aplikasi ini mengadopsi tiga pilar visual utama:
*   **Bento Grid / Modular UI**: Pembagian tata letak informasi ke dalam sel-sel kontainer modular yang bersih dengan garis pembatas (*border*) yang tegas namun halus.
*   **Minimalis Modern**: Mengutamakan pemanfaatan ruang putih (*white space/negative space*) yang luas untuk menjaga kejelasan informasi (*readability*) dan hierarki visual yang kuat.
*   **Technical Art / Blueprint**: Penggunaan elemen grafis berbasis garis halus (*line art*), pola biner, atau ilustrasi arsitektural monokromatis pada latar belakang untuk memberikan kesan presisi.

---

## 2. Color Palette & Hex Codes

Gunakan palet warna terstandarisasi di bawah ini untuk menjaga konsistensi di seluruh halaman:

### A. Backgrounds & Layout
| Kegunaan | Warna | Hex Code | Tailwind Class Equivalent |
| :--- | :--- | :--- | :--- |
| **Latar Belakang Utama** | Pure White | `#FFFFFF` | `bg-white` |
| **Kontainer / Sel Bento** | Off-White / Soft Gray | `#F9FAFB` | `bg-gray-50` |
| **Garis Pembatas (Grid)** | Light Border Gray | `#E5E7EB` | `border-gray-200` |

### B. Typography & Components
| Kegunaan | Warna | Hex Code | Tailwind Class Equivalent |
| :--- | :--- | :--- | :--- |
| **Teks Judul Utama / Tombol** | Deep Black / Charcoal | `#000000` | `text-black` / `bg-black` |
| **Teks Deskripsi / Sub-judul**| Muted Gray | `#6B7280` | `text-gray-500` |
| **Garis Ilustrasi Latar Belakang** | Faded Blueprint Gray | `#E1E5EB` | `stroke-gray-300/40` |

### C. Accent Colors (Data & Indicators)
*   **Orange (Aksen Utama/Langkah)**: `#F59E0B` (`text-amber-500`)
*   **Green (Sukses/Aktif)**: `#10B981` (`text-emerald-500`)
*   **Purple/Violet (Penanda)**: `#8B5CF6` (`text-violet-500`)
*   **Blue (Info)**: `#3B82F6` (`text-blue-500`)

---

## 3. Real-time UI & Skeleton Loaders (Supabase Integration)

Karena aplikasi ini mengonsumsi data asinkronus dan real-time dari Supabase, visualisasi transisi status data wajib dijaga agar tidak merusak estetika Bento Grid (*mencegah layout shifting*):
*   **Skeleton Loading**: Saat data dari Supabase sedang di-*fetch*, sel Bento tidak boleh kosong atau hilang. Gunakan komponen skeleton beranimasi pulsa (`animate-pulse bg-gray-200`) yang mempertahankan dimensi asli sel tersebut.
*   **Real-time Transition Opt-in**: Efek visual ketika ada perubahan data real-time harus halus (gunakan transisi CSS seperti `transition-all duration-300 ease-in-out`).

---

## 4. UI Layout Implementation (Tailwind Reference)

Untuk mengimplementasikan struktur Bento Grid, gunakan kombinasi pembatas (*border divider*) tipis:

```tsx
// Contoh implementasi struktur Bento Grid 2 kolom di React
<div className="grid grid-cols-1 md:grid-cols-2 border border-gray-200 divide-y md:divide-y-0 md:divide-x divide-gray-200">
  <div className="p-8 bg-gray-50">
    
  </div>
  <div className="p-8 bg-white">
    
  </div>
</div>