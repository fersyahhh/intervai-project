import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Briefcase,
  ArrowRight,
  Mic,
  FileText,
  BarChart3,
  Upload,
  Brain,
  Shield,
  ChevronDown,
  Zap,
  Globe,
  CheckCircle,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

/* ───────────────────────────────────
   Sub-components (kept in-file for 
   co-location during landing build)
   ─────────────────────────────────── */

function StepIndicator({ number }: { number: string }) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <span className="w-2.5 h-2.5 rounded-sm bg-amber-500 inline-block" />
      <span className="text-xs font-semibold tracking-widest text-gray-400 uppercase">
        [ Step {number} ]
      </span>
    </div>
  );
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-gray-200 last:border-b-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-5 text-left group"
      >
        <span className="font-semibold text-gray-900 group-hover:text-black transition-colors pr-4">
          {question}
        </span>
        <ChevronDown
          className={`w-5 h-5 text-gray-400 shrink-0 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
        />
      </button>
      <div className={`faq-content ${open ? 'open' : ''}`}>
        <div>
          <p className="pb-5 text-gray-500 leading-relaxed">{answer}</p>
        </div>
      </div>
    </div>
  );
}

/* ───────────────────────────────────
   Main Landing Page
   ─────────────────────────────────── */

export default function LandingPage() {
  const { user, signOut } = useAuth();
  
  return (
    <div className="min-h-screen bg-white text-black flex flex-col">
      {/* ========== NAVBAR ========== */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
              <Briefcase className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight">IntervAI</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-500">
            <a href="#how-it-works" className="hover:text-black transition-colors">Cara Kerja</a>
            <a href="#features" className="hover:text-black transition-colors">Fitur</a>
            <a href="#faq" className="hover:text-black transition-colors">FAQ</a>
          </nav>

          <div className="flex items-center gap-3">
            {user ? (
              <button
                onClick={signOut}
                className="text-sm font-medium text-gray-600 hover:text-black transition-colors px-3 py-2"
              >
                Log out
              </button>
            ) : (
              <Link
                to="/login"
                className="text-sm font-medium text-gray-600 hover:text-black transition-colors px-3 py-2"
              >
                Log in
              </Link>
            )}
            <Link
              to={user ? "/setup" : "/setup"}
              className="text-sm font-medium bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
            >
              {user ? "Mulai saja" : "Masuk Gratis"}
            </Link>
          </div>
        </div>
      </header>

      {/* ========== HERO SECTION ========== */}
      <section className="blueprint-grid relative overflow-hidden">
        {/* Glow Orbs */}
        <div className="glow-orb glow-orb-blue w-[600px] h-[600px] -top-32 -left-32 animate-float"></div>
        <div className="glow-orb glow-orb-purple w-[500px] h-[500px] top-20 right-0 animate-float-reverse delay-300"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 pt-24 pb-32 md:pt-32 md:pb-40 flex flex-col items-center text-center">
          {/* Badge */}
          <div className="animate-fade-in-up inline-flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-full px-4 py-1.5 mb-8">
            <span className="text-xs font-medium text-gray-500">Didukung oleh</span>
            <span className="flex items-center gap-1.5">
              <Brain className="w-4 h-4 text-blue-500" />
              <span className="text-xs font-bold text-gray-800">Gemini AI</span>
            </span>
          </div>

          {/* Headline */}
          <h1 className="animate-fade-in-up delay-100 text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-[1.05] max-w-4xl">
            Kuasai setiap wawancara dengan{' '}
            <span className="relative">
              <span className="text-blue-600">AI Coach</span>
              <svg
                className="absolute -bottom-2 left-0 w-full"
                viewBox="0 0 300 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M2 8C50 2 100 2 150 6C200 10 250 4 298 6"
                  stroke="#3B82F6"
                  strokeWidth="3"
                  strokeLinecap="round"
                  opacity="0.3"
                />
              </svg>
            </span>
          </h1>

          {/* Sub-headline */}
          <p className="animate-fade-in-up delay-200 mt-6 text-lg md:text-xl text-gray-500 max-w-2xl leading-relaxed">
            Unggah CV dan deskripsi pekerjaan. Latihan dengan real-time voice recognition.
            Dapatkan feedback AI instan — <span className="font-semibold text-gray-700">100% gratis</span>.
          </p>

          {/* CTA Buttons */}
          <div className="animate-fade-in-up delay-300 flex flex-col sm:flex-row items-center gap-4 mt-10">
            <Link
              to="/setup"
              className="inline-flex items-center gap-2.5 bg-black text-white px-7 py-3.5 rounded-lg text-base font-semibold hover:bg-gray-800 transition-all hover:gap-4"
            >
              Mulai Latihan Gratis <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="#how-it-works"
              className="inline-flex items-center gap-2 text-gray-500 text-sm font-medium hover:text-black transition-colors"
            >
              Lihat cara kerjanya <ChevronDown className="w-4 h-4" />
            </a>
          </div>

          {/* Stats Row */}
          <div className="animate-fade-in-up delay-500 mt-16 grid grid-cols-3 gap-8 md:gap-16">
            <div className="text-center">
              <p className="text-2xl md:text-3xl font-bold">100%</p>
              <p className="text-xs md:text-sm text-gray-400 mt-1">Gratis Selamanya</p>
            </div>
            <div className="text-center">
              <p className="text-2xl md:text-3xl font-bold">Real-time</p>
              <p className="text-xs md:text-sm text-gray-400 mt-1">Pengenalan Suara</p>
            </div>
            <div className="text-center">
              <p className="text-2xl md:text-3xl font-bold">AI</p>
              <p className="text-xs md:text-sm text-gray-400 mt-1">Feedback Personal</p>
            </div>
          </div>
        </div>

        {/* Gradient fade at bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent z-10" />
      </section>

      {/* ========== HOW IT WORKS ========== */}
      <section id="how-it-works" className="py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6">
          {/* Section Header */}
          <div className="max-w-xl mb-16 md:mb-20">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
              Cara Kerja
            </h2>
            <p className="text-gray-500 text-lg leading-relaxed">
              Dari upload CV hingga laporan AI yang detail,<br className="hidden md:block" />
              perjalananmu hanya dalam tiga langkah.
            </p>
          </div>

          {/* Steps Grid — Bento Style */}
          <div className="grid grid-cols-1 md:grid-cols-2 border border-gray-200 divide-y md:divide-y-0 md:divide-x divide-gray-200 rounded-2xl overflow-hidden">
            {/* Left — Step Content */}
            <div className="divide-y divide-gray-200">
              {/* Step 1 */}
              <div className="p-8 md:p-10 bento-cell hover:bg-gray-50/50">
                <StepIndicator number="01" />
                <h3 className="text-xl font-bold mb-2">Siapkan wawancaramu</h3>
                <p className="text-gray-500 leading-relaxed">
                  Masukkan posisi dan deskripsi pekerjaan, lalu unggah CV-mu dalam format PDF.
                  AI kami akan menganalisis keduanya untuk membuat pertanyaan yang personal.
                </p>
              </div>

              {/* Step 2 */}
              <div className="p-8 md:p-10 bento-cell hover:bg-gray-50/50 border-t border-gray-200">
                <StepIndicator number="02" />
                <h3 className="text-xl font-bold mb-2">Latihan dengan suara</h3>
                <p className="text-gray-500 leading-relaxed">
                  Jawab setiap pertanyaan secara lisan. Speech recognition bawaan browser
                  mengubah suaramu menjadi teks secara real-time — tanpa biaya server, tanpa delay.
                </p>
              </div>

              {/* Step 3 */}
              <div className="p-8 md:p-10 bento-cell hover:bg-gray-50/50 border-t border-gray-200">
                <StepIndicator number="03" />
                <h3 className="text-xl font-bold mb-2">Dapatkan feedback & laporan AI</h3>
                <p className="text-gray-500 leading-relaxed">
                  Gemini AI mengevaluasi jawabanmu — memberi skor relevansi, kejelasan, dan mendeteksi
                  keraguan. Unduh laporan PDF yang detail untuk dipelajari secara offline.
                </p>
              </div>
            </div>

            {/* Right — Visual Demo */}
            <div className="dot-grid bg-gray-50 p-8 md:p-10 flex flex-col justify-center">
              <div className="relative z-10 space-y-6">
                {/* Glow behind cards */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-[300px] glow-orb glow-orb-blue animate-float-slow"></div>

                {/* Mock Interview Card */}
                <div className="glass-card rounded-xl shadow-lg p-6 space-y-4 relative animate-float">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Ruang Wawancara</span>
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Langsung
                    </span>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                    <p className="text-sm text-gray-600 italic">
                      "Ceritakan tentang proyek yang menantang yang pernah kamu kerjakan dan bagaimana kamu mengatasinya."
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
                        <Mic className="w-4 h-4 text-white" />
                      </div>
                      <div className="absolute inset-0 rounded-full border-2 border-blue-400 animate-pulse-ring" />
                    </div>
                    <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full w-3/5 bg-blue-500 rounded-full" />
                    </div>
                  </div>
                </div>

                {/* Mock Score Card */}
                <div className="glass-card rounded-xl shadow-lg p-6 relative animate-float-reverse delay-200">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Skor AI</span>
                    <span className="text-2xl font-bold text-blue-600">87<span className="text-sm text-gray-400">/100</span></span>
                  </div>
                  <div className="space-y-2">
                    {[
                      { label: 'Relevansi', pct: 92, color: 'bg-emerald-500' },
                      { label: 'Kejelasan', pct: 85, color: 'bg-blue-500' },
                      { label: 'Kepercayaan Diri', pct: 78, color: 'bg-amber-500' },
                    ].map((bar) => (
                      <div key={bar.label} className="flex items-center gap-3">
                        <span className="text-xs text-gray-500 w-28">{bar.label}</span>
                        <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${bar.color}`} style={{ width: `${bar.pct}%` }} />
                        </div>
                        <span className="text-xs font-medium text-gray-600 w-8 text-right">{bar.pct}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== FEATURES BENTO GRID ========== */}
      <section id="features" className="py-24 md:py-32 bg-gray-50 border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-xl mb-16 md:mb-20">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
              Dibangun untuk latihan nyata
            </h2>
            <p className="text-gray-500 text-lg leading-relaxed">
              Semua yang kamu butuhkan untuk mempersiapkan wawancara kerja,
              dalam satu platform gratis.
            </p>
          </div>

          {/* Features Bento */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border border-gray-200 divide-y md:divide-y-0 rounded-2xl overflow-hidden bg-white">
            {/* Row 1 */}
            <div className="md:border-r border-b md:border-b-0 border-gray-200 p-8 md:p-10 group bento-cell hover:bg-gray-50/50">
              <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center mb-5 group-hover:bg-blue-100 transition-colors">
                <Mic className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="font-bold text-lg mb-2">Speech-to-Text Real-time</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                Memanfaatkan Web Speech API bawaan browser untuk transkripsi suara instan tanpa biaya langsung di browsermu.
              </p>
            </div>

            <div className="md:border-r border-b md:border-b-0 border-gray-200 p-8 md:p-10 group bento-cell hover:bg-gray-50/50">
              <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center mb-5 group-hover:bg-amber-100 transition-colors">
                <Upload className="w-5 h-5 text-amber-600" />
              </div>
              <h3 className="font-bold text-lg mb-2">Upload CV & Deskripsi Pekerjaan</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                Unggah resume-mu dan tempel lowongan pekerjaan. AI menyesuaikan setiap pertanyaan dengan konteksmu.
              </p>
            </div>

            <div className="border-b md:border-b-0 border-gray-200 p-8 md:p-10 group bento-cell hover:bg-gray-50/50">
              <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center mb-5 group-hover:bg-emerald-100 transition-colors">
                <Brain className="w-5 h-5 text-emerald-600" />
              </div>
              <h3 className="font-bold text-lg mb-2">Evaluasi Gemini AI</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                Setiap jawaban dianalisis oleh Gemini berdasarkan relevansi, kejelasan, dan kepercayaan diri — disertai skor dan saran yang actionable.
              </p>
            </div>

            {/* Divider Row */}
            <div className="md:col-span-3 border-t border-gray-200" />

            {/* Row 2 */}
            <div className="md:border-r border-b md:border-b-0 border-gray-200 p-8 md:p-10 group bento-cell hover:bg-gray-50/50">
              <div className="w-10 h-10 rounded-lg bg-violet-50 flex items-center justify-center mb-5 group-hover:bg-violet-100 transition-colors">
                <BarChart3 className="w-5 h-5 text-violet-600" />
              </div>
              <h3 className="font-bold text-lg mb-2">Deteksi Keraguan</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                Tracking durasi hening di frontend mengidentifikasi jeda gugup, sehingga kamu bisa meningkatkan kelancaran dan kepercayaan diri.
              </p>
            </div>

            <div className="md:border-r border-b md:border-b-0 border-gray-200 p-8 md:p-10 group bento-cell hover:bg-gray-50/50">
              <div className="w-10 h-10 rounded-lg bg-rose-50 flex items-center justify-center mb-5 group-hover:bg-rose-100 transition-colors">
                <FileText className="w-5 h-5 text-rose-600" />
              </div>
              <h3 className="font-bold text-lg mb-2">Ekspor Laporan PDF</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                Unduh laporan PDF lengkap berisi skor, feedback, dan saran perbaikan untuk dipelajari secara offline.
              </p>
            </div>

            <div className="p-8 md:p-10 group bento-cell hover:bg-gray-50/50">
              <div className="w-10 h-10 rounded-lg bg-sky-50 flex items-center justify-center mb-5 group-hover:bg-sky-100 transition-colors">
                <Shield className="w-5 h-5 text-sky-600" />
              </div>
              <h3 className="font-bold text-lg mb-2">Aman & Privat</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                Audio tetap di perangkatmu. Transkrip dilindungi oleh Supabase RLS. Datamu tidak pernah dijual atau dibagikan.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========== WHY FREE ========== */}
      <section className="py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border border-gray-200 rounded-2xl overflow-hidden">
            {/* Left */}
            <div className="dot-grid bg-gray-50 p-10 md:p-14 flex flex-col justify-center relative overflow-hidden">
              <div className="glow-orb glow-orb-amber w-64 h-64 top-0 left-0 animate-float-slow"></div>
              <div className="relative z-10">
                <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
                  Kenapa gratis?
                </h2>
                <p className="text-gray-500 text-lg leading-relaxed mb-8">
                  Platform simulasi wawancara umumnya mematok harga mahal karena pemrosesan audio di server
                  sangat costly. Kami mengambil pendekatan berbeda.
                </p>
                <div className="flex items-center gap-4">
                  <span className="w-2.5 h-2.5 rounded-sm bg-amber-500 inline-block" />
                  <Link to="/setup" className="text-sm font-semibold hover:underline">
                    Coba sendiri &rarr;
                  </Link>
                </div>
              </div>
            </div>

            {/* Right */}
            <div className="p-10 md:p-14 space-y-8 bg-white border-t md:border-t-0 md:border-l border-gray-200">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0">
                  <Globe className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <h3 className="font-bold mb-1">STT Bawaan Browser</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    Web Speech API berjalan sepenuhnya di perangkatmu — nol biaya transkripsi server.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                  <Zap className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-bold mb-1">Gemini Free Tier</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    Google AI Studio menyediakan free tier yang murah hati untuk Gemini API, menjaga biaya evaluasi tetap nol.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-lg bg-violet-50 flex items-center justify-center shrink-0">
                  <CheckCircle className="w-5 h-5 text-violet-600" />
                </div>
                <div>
                  <h3 className="font-bold mb-1">Backend Supabase</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    Auth, storage, dan database menggunakan Supabase free plan — aman, scalable, dan hemat biaya.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== FAQ ========== */}
      <section id="faq" className="py-24 md:py-32 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-12 md:gap-16">
            {/* Left — Title */}
            <div className="md:col-span-2">
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
                Pertanyaan yang sering diajukan
              </h2>
              <p className="text-gray-500 leading-relaxed">
                Temukan jawaban untuk pertanyaan umum seputar IntervAI.
              </p>
            </div>

            {/* Right — FAQ Items */}
            <div className="md:col-span-3">
              <FAQItem
                question="Apakah IntervAI benar-benar 100% gratis?"
                answer="Ya! Kami menggunakan speech recognition bawaan browser (tanpa biaya server) dan free tier Gemini AI. Tidak ada biaya tersembunyi, langganan, atau paket premium."
              />
              <FAQItem
                question="Browser apa saja yang mendukung speech recognition?"
                answer="IntervAI bekerja paling baik di Google Chrome dan Microsoft Edge, yang memiliki dukungan Web Speech API paling lengkap. Safari mendukung secara parsial. Firefox saat ini belum mendukung Web Speech API."
              />
              <FAQItem
                question="Apakah data saya aman dan privat?"
                answer="Tentu saja. Audio kamu tidak pernah keluar dari perangkat — ditranskripsi secara lokal oleh browser. Transkrip yang disimpan di Supabase dilindungi oleh Row Level Security (RLS), memastikan hanya kamu yang bisa mengakses datamu."
              />
              <FAQItem
                question="Bisa latihan pakai Bahasa Indonesia?"
                answer="Bisa! Web Speech API mendukung Bahasa Indonesia (id-ID) untuk pengenalan suara. AI kami juga bisa membuat pertanyaan dan feedback dalam Bahasa Indonesia."
              />
              <FAQItem
                question="Seberapa akurat feedback dari AI?"
                answer="IntervAI menggunakan Gemini AI dari Google untuk mengevaluasi jawabanmu berdasarkan relevansi, kejelasan, dan kepercayaan diri. Meskipun bukan pengganti interviewer sungguhan, ini memberikan insight yang actionable untuk membantumu berkembang."
              />
              <FAQItem
                question="Bisa download hasil wawancara?"
                answer="Bisa! Setelah setiap sesi, kamu bisa mengekspor laporan PDF lengkap yang berisi skor, feedback detail, dan saran spesifik untuk memperbaiki jawabanmu."
              />
            </div>
          </div>
        </div>
      </section>

      {/* ========== CTA BANNER ========== */}
      <section className="blueprint-grid border-t border-gray-200 bg-gray-50">
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 md:py-28 text-center">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Siap kuasai wawancara berikutnya?
          </h2>
          <p className="text-gray-500 mb-8 max-w-lg mx-auto">
            Bergabung dengan ribuan pencari kerja yang berlatih lebih cerdas, bukan lebih keras.
          </p>
          <Link
            to="/setup"
            className="inline-flex items-center gap-2.5 bg-black text-white px-7 py-3.5 rounded-lg text-base font-semibold hover:bg-gray-800 transition-all hover:gap-4"
          >
            Mulai latihan sekarang <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* ========== FOOTER ========== */}
      <footer className="border-t border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-black rounded-md flex items-center justify-center">
              <Briefcase className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-bold text-sm tracking-tight">IntervAI</span>
          </div>
          <p className="text-sm text-gray-400">
            &copy; {new Date().getFullYear()} IntervAI. Dibuat untuk HIMTIF Hackathon.
          </p>
          <div className="flex items-center gap-6 text-sm text-gray-400">
            <a href="#" className="hover:text-black transition-colors">Privasi</a>
            <a href="#" className="hover:text-black transition-colors">Ketentuan</a>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-black transition-colors">GitHub</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
