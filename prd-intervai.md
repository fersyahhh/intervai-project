# PRODUCT REQUIREMENT DOCUMENT (PRD)
## Project: IntervAI — AI-Powered Mock Interview Platform

---

## 1. Document Control
*   **Project Name:** IntervAI
*   **Version:** 1.0 (MVP Scope for Hackathon)
*   **Date:** June 2026
*   **Status:** Approved for Development

---

## 2. Executive Summary & Problem Statement
Banyak *job seeker* (terutama fresh graduate) mengalami kegagalan pada tahap wawancara kerja bukan karena kekurangan skill teknis, melainkan karena kurangnya persiapan yang terarah (*personalized*) dan rasa gugup saat berkomunikasi. Di sisi lain, platform latihan yang ada saat ini sering kali berbayar mahal karena tingginya biaya pemrosesan infrastruktur audio di sisi server.

**IntervAI** hadir sebagai solusi platform web simulasi wawancara kerja pintar yang 100% gratis biaya pemrosesan suara dengan memanfaatkan teknologi *native speech recognition* pada browser pengguna. Platform ini menganalisis CV dan Deskripsi Pekerjaan secara spesifik untuk memberikan simulasi interaktif, mendengarkan jawaban user secara *real-time*, dan memberikan laporan perbaikan (*report*) yang dapat diunduh.

---

## 3. Tech Stack Specifications
Untuk mengejar efisiensi waktu, performa, dan penghematan biaya selama *hackathon*, tim sepakat menggunakan *stack* berikut:

*   **Frontend Framework:** React.js (Cepat untuk komponen reaktif)
*   **Styling & UI Components:** Tailwind CSS (Desain modern & minimalis)
*   **Iconography:** Lucide React & React Icons (Konsisten dan bersih)
*   **Speech-to-Text Engine:** Web Speech API (`SpeechRecognition`) — *Native, Real-time, 100% Free*
*   **Backend & Database:** Supabase (PostgreSQL, Auth, Storage, Edge Functions)
*   **Core AI Engine:** Gemini API (Free Tier via Google AI Studio), Groq AI, Open AI

---

## 4. User Journey (Alur Pengguna)
1.  **Landing & Auth:** User masuk ke landing page IntervAI dan melakukan registrasi/login singkat.
2.  **Setup Room:** User menginput Posisi Pekerjaan, Deskripsi Lowongan, dan mengunggah CV (PDF).
3.  **Interview Session:** AI memberikan pertanyaan $\rightarrow$ User mengaktifkan mikrofon $\rightarrow$ Teks jawaban muncul di layar secara *real-time* $\rightarrow$ User menyelesaikan sesi.
4.  **Analysis Generation:** Sistem mengirimkan transkrip ke Gemini API melalui Supabase Edge Functions.
5.  **Dashboard Report:** User melihat grafik skor, analisis kelancaran, dan saran perbaikan kalimat.
6.  **Export:** User mengunduh dokumen PDF hasil evaluasi untuk dipelajari secara luring.

---

## 5. Functional Requirements (MVP Scope)

### FR-1: Authentication & Session Management
*   **Deskripsi:** Sistem harus dapat mengidentifikasi user agar riwayat latihan tidak bercampur.
*   **Spesifikasi:** Integrasi Supabase Auth menggunakan Email/Password atau OTP.
*   **UI/UX:** Tampilan login bersih dengan palet warna dominan putih (*clean white*) dan aksen biru profesional.

### FR-2: Job & CV Context Ingestion
*   **Deskripsi:** User menyediakan konteks agar pertanyaan AI bersifat *personalized*.
*   **Spesifikasi:** Form input untuk judul posisi kerja dan detail kualifikasi loker. Dilengkapi dengan uploader file PDF ke Supabase Storage.
*   **UI/UX:** Komponen input modern memanfaatkan ikon Lucide (`Briefcase`, `FileText`).

### FR-3: Interactive Interview Room & Real-time STT
*   **Deskripsi:** Ruangan inti simulasi wawancara suara.
*   **Spesifikasi:** 
    *   Mengaktifkan objek `window.SpeechRecognition` bawaan browser dengan konfigurasi `lang = 'id-ID'` dan `continuous = true`.
    *   Tombol kontrol dengan 3 state: *Idle* (Mulai), *Recording* (Selesai dengan efek animasi *pulse*), dan *Processing* (Loading state).
    *   Sistem menghitung jeda waktu diam (*silence duration*) di frontend sebagai parameter deteksi kegugupan (*hesitation counter*).
*   **UI/UX:** Kotak teks interaktif yang memunculkan teks berjalan seiring user berbicara (*live-typing effect*).

### FR-4: AI Evaluator Dashboard & PDF Exporter
*   **Deskripsi:** Menyajikan umpan balik dari Gemini API secara visual terstruktur.
*   **Spesifikasi:** 
    *   Memproses teks transkrip via Supabase Edge Functions menuju Gemini API (Model: `gemini-1.5-flash`).
    *   Gemini dipaksa mengembalikan format JSON yang berisi skor (0-100), feedback substantif, dan rekomendasi revisi kalimat.
    *   Menyediakan tombol cetak halaman/export HTML ke PDF di sisi klien (*client-side*).

---

## 6. Database Schema (Supabase PostgreSQL)

### Tabel `interviews`
```sql
create table interviews (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id),
  position_applied text not null,
  job_description text not null,
  cv_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

### Tabel `interview_details`
```sql
create table interview_details (
  id uuid default gen_random_uuid() primary key,
  interview_id uuid references interviews(id) on delete cascade,
  question_text text not null,
  user_answer_text text,
  hesitation_count integer default 0,
  ai_feedback jsonb, -- Menyimpan keys: score, feedback, corrections
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);