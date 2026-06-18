# 🤖 AI Agents & Developer Rules — IntervAI

Dokumen ini berisi instruksi mutlak, standar penulisan kode, dan batasan teknologi (_guardrails_) yang WAJIB dipatuhi oleh seluruh AI Agents (Cursor AI, GitHub Copilot, Gemini/GPT Assistant) serta pengembang manusia dalam proyek **IntervAI**.

---

## 1. Core Stack & Environment Rules

- **Package Manager:** Selalu gunakan **Bun** (`bun install`, `bun run`, `bunx`). JANGAN PERNAH menjalankan perintah `npm`, `yarn`, atau `pnpm`.
- **Runtime/Bundler:** Vite + React.js (Vite dikelola menggunakan ekosistem Bun).
- **State Management:** Wajib menggunakan **Zustand** untuk core feature state (wawancara, audio, transkrip) dan **React Context API** hanya untuk global session (Supabase Auth). JANGAN gunakan Redux atau Prop Drilling yang mendalam.
- **Styling:** Wajib menggunakan **Tailwind CSS** (Utility-first classes). Terapkan pendekatan responsif dan animasi bawaan Tailwind (`animate-pulse`, `transition-all`).
- **Iconography:** Gunakan **Lucide React** sebagai prioritas utama. Jika ikon tidak tersedia, gunakan paket spesifik dari **React Icons**.

---

## 2. Architectural Guardrails (Professional Atomic Design)

Setiap pembuatan komponen baru HARUS mengikuti struktur folder modifikasi Atomic Design yang tertuang pada `architecture.md`. Agen dilarang keras membuat komponen acak di luar struktur berikut:

1.  **Elements (`src/presentation/components/elements/`):**
    - Komponen primitif, murni presentasional, _stateless_ (bergantung pada props), dan _highly reusable_.
    - _Contoh:_ `Button`, `InputText`, `Badge`, `AudioPulse`.
2.  **Modules (`src/presentation/components/modules/`):**
    - Gabungan elemen yang membentuk satu unit fungsional fitur. Bisa memiliki local state yang sederhana.
    - _Contoh:_ `CVUploader`, `TranscriptBox`, `ScoreCard`, `Navbar`.
3.  **Layouts (`src/presentation/layouts/`):**
    - Struktur pembungkus utama halaman (_shell layout_).
    - _Contoh:_ `AuthLayout`, `DashboardLayout`.
4.  **Templates (`src/presentation/templates/`):**
    - Kerangka penempatan (_blueprint macro_) berskala satu halaman penuh. Tidak boleh melakukan data fetching langsung ke Supabase; gunakan data dari props.
5.  **Pages (`src/presentation/pages/`):**
    - Entri poin routing. Tempat mengelola global state, mengonsumsi Zustand store, menghandle Web Speech API, dan melakukan operasi I/O ke Supabase.

---

## 3. Code & Clean Architecture Conventions

### Zustand Store Integration

- Pisahkan logika state pemrosesan suara dan alur wawancara ke dalam folder `src/store/`.
- Gunakan _atomic selectors_ saat mengonsumsi store di dalam komponen untuk mencegah _unnecessary re-renders_.
- _Benar:_ `const transcript = useInterviewStore((state) => state.transcript);`
- _Salah:_ `const { transcript, status } = useInterviewStore();` (Kecuali jika kedua state tersebut memang dibutuhkan bersamaan di satu komponen).

### Web Speech API Implements

- Logika `window.SpeechRecognition` atau `window.webkitSpeechRecognition` harus diisolasi di dalam custom hooks (`src/hooks/useSpeechToText.js`) atau dikelola langsung dari Zustand store tingkat tinggi. Jangan menulis inisialisasi API Speech langsung di dalam komponen UI.
- Wajib menyediakan penanganan kesalahan (_error handling_) jika browser juri tidak mendukung Web Speech API (tampilkan pesan jatuh/fallback yang elegan).

### Security Rules (Supabase & API Keys)

- **DILARANG KERAS** mengekspos API Key sensitif (seperti Gemini API Key) di sisi frontend React.
- Seluruh komunikasi dengan LLM Gemini wajib dijembatani oleh **Supabase Edge Functions** sebagai lapisan _secure gateway_.
- Gunakan variabel lingkungan (_environment variables_) yang diakses via `import.meta.env.VITE_SUPABASE_URL`.

---

## 4. UI/UX & Aesthetic Rules (Blue & White Minimalist)

IntervAI menggunakan identitas visual yang profesional, bersih, dan modern:

- **Warna Dominan:** Putih bersih (`bg-white`, `bg-slate-50`) untuk memberikan kesan lapang dan fokus.
- **Warna Aksen:** Biru profesional (`bg-blue-600`, `text-blue-600`, `hover:bg-blue-700`) untuk memancarkan aura teknologi dan korporat yang tepercaya.
- **Animasi Efek:** Tombol perekaman suara wajib menggunakan efek denyut `animate-pulse` dari Tailwind CSS saat mendeteksi input suara aktif untuk memberikan _feedback_ visual instan kepada user.

---

## 5. Perintah Pengaktifan Agen (Prompt Trigger)

> _"Ketika saya meminta Anda untuk membuatkan fitur atau komponen baru, baca berkas `AGENTS.md` dan `architecture.md` terlebih dahulu. Buat kode dengan sintaksis React terbaru (Functional Components, Hooks), pastikan kompatibel dengan Bun, gunakan Tailwind CSS secara maksimal, dan integrasikan dengan Zustand secara efisien."_
