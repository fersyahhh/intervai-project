# 🏛️ Architecture & Folder Structure — IntervAI

Dokumen ini menjelaskan standar arsitektur frontend dan struktur folder yang diterapkan pada platform **IntervAI**. Dokumentasi ini mengadaptasi metodologi **Atomic Design** yang telah dimodifikasi ke tingkat profesional untuk memastikan kode yang dihasilkan bersifat _scalable_, mudah di-maintain, dan modular selama masa pengembangan _hackathon_ hingga ke tahap produksi.

---

## 1. Arsitektur Komponen (Professional Atomic Design Map)

Kami memetakan prinsip Atomic Design (Atoms, Molecules, Organisms, Templates, Pages) ke dalam istilah industri yang lebih deskriptif tanpa kehilangan esensi modularitasnya:

### Keunggulan Pendekatan Ini:

1. **Pemisahan Logika (Separation of Concerns):** `pages` berfokus pada data-fetching dan interaksi dengan Supabase, sedangkan `templates` dan `components` murni fokus pada presentasi UI.
2. **Kecepatan Development:** Paralelisasi pengerjaan komponen UI (Tailwind CSS + Lucide Icons) terpisah dari implementasi API (Web Speech API & Supabase).

---

## 2. Struktur Direktori Proyek (`/src`)

Berikut adalah pohon direktori utama pada sisi frontend React JS:

```text
src/
├── assets/                 # Aset statis seperti logo IntervAI, gambar, dan ilustrasi SVG
├── config/                 # Konfigurasi aplikasi (inisialisasi Supabase client, env variables)
├── context/                # Global state management (e.g., AuthContext, InterviewSessionContext)
├── hooks/                  # Custom React hooks (e.g., useSpeechToText, useTimer)
├── services/               # Integrasi API eksternal dan Supabase Edge Functions
├── utils/                  # Helper functions (format tanggal, parser transkrip, pdf-generator)
│
└── presentation/           # Lapisan Presentasi UI (Modified Atomic Design)
    ├── layouts/            # Layout Shell global (bersifat reusable lintas halaman)
    │   ├── AuthLayout.jsx
    │   └── DashboardLayout.jsx
    │
    ├── pages/              # Entri poin routing utama (Mengelola state & Supabase data)
    │   ├── LandingPage.jsx
    │   ├── LoginPage.jsx
    │   ├── SetupPage.jsx
    │   ├── InterviewRoomPage.jsx
    │   └── ReportDashboardPage.jsx
    │
    ├── templates/          # Struktur kerangka halaman (Kombinasi komponen pengisi blueprint)
    │   ├── SetupTemplate.jsx
    │   ├── InterviewRoomTemplate.jsx
    │   └── ReportDashboardTemplate.jsx
    │
    └── components/         # Komponen UI modular terkecil hingga menengah (Atom & Molekul)
        ├── elements/       # Komponen dasar super kecil (Primitive Atoms)
        │   ├── Button.jsx
        │   ├── InputText.jsx
        │   ├── Badge.jsx
        │   └── AudioPulse.jsx
        │
        └── modules/        # Gabungan elemen penunjang fitur spesific (Molecules/Organisms)
            ├── Navbar.jsx
            ├── CVUploader.jsx
            ├── TranscriptBox.jsx
            └── ScoreCard.jsx
```
