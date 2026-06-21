import { Link, useNavigate } from 'react-router-dom';
import { Download, TrendingUp, TrendingDown, AlertTriangle, CheckCircle2, Home, Briefcase, ArrowRight } from 'lucide-react';
import { useInterviewStore } from '../../store/useInterviewStore';
import { useEffect, useRef } from 'react';
import { jsPDF } from 'jspdf';
import toast from 'react-hot-toast';

export default function ReportDashboardPage() {
  const navigate = useNavigate();
  const {
    position,
    overallScore,
    detailedFeedbacks,
    resetStore
  } = useInterviewStore();

  // Redirect if no interview data
  useEffect(() => {
    if (detailedFeedbacks.length === 0) {
      navigate('/setup');
    }
  }, [detailedFeedbacks, navigate]);

  if (detailedFeedbacks.length === 0) {
    return null;
  }

  // Ref for PDF export (not used with jsPDF, but keeping for potential future use)
  const reportRef = useRef<HTMLDivElement>(null);

  // PDF Export Handler using jsPDF
  const handleExportPDF = () => {
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 20;
      const maxWidth = pageWidth - (margin * 2);
      let yPos = margin;

      // Helper function to check if we need a new page
      const checkPageBreak = (neededSpace: number) => {
        if (yPos + neededSpace > pageHeight - margin) {
          doc.addPage();
          yPos = margin;
          return true;
        }
        return false;
      };

      // Helper function to add text with word wrap
      const addText = (text: string, fontSize: number, isBold: boolean = false, color: number[] = [0, 0, 0]) => {
        doc.setFontSize(fontSize);
        doc.setFont('helvetica', isBold ? 'bold' : 'normal');
        doc.setTextColor(color[0], color[1], color[2]);
        const lines = doc.splitTextToSize(text, maxWidth);
        
        for (let i = 0; i < lines.length; i++) {
          checkPageBreak(fontSize * 0.5);
          doc.text(lines[i], margin, yPos);
          yPos += fontSize * 0.5;
        }
      };

      // Header
      addText('LAPORAN HASIL INTERVIEW', 20, true, [0, 0, 0]);
      yPos += 5;
      addText(`Posisi: ${displayPosition}`, 12, false, [100, 100, 100]);
      yPos += 3;
      addText(`Tanggal: ${new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}`, 10, false, [150, 150, 150]);
      yPos += 10;

      // Divider line
      doc.setDrawColor(200, 200, 200);
      doc.line(margin, yPos, pageWidth - margin, yPos);
      yPos += 10;

      // Overall Score Section
      addText('SKOR KESELURUHAN', 14, true, [59, 130, 246]);
      yPos += 5;
      addText(`${Math.round(score)} / 100`, 24, true, [0, 0, 0]);
      yPos += 5;
      
      const scoreInfo = getScoreInterpretation(score);
      addText(`Kategori: ${scoreInfo.label}`, 12, false, [100, 100, 100]);
      yPos += 10;

      // Statistics
      addText('RINGKASAN', 14, true, [59, 130, 246]);
      yPos += 5;
      addText(`• Total Pertanyaan: ${detailedFeedbacks.length}`, 10, false);
      yPos += 2;
      addText(`• Kekuatan yang Teridentifikasi: ${allStrengths.length}`, 10, false);
      yPos += 2;
      addText(`• Area Peningkatan: ${allImprovements.length}`, 10, false);
      yPos += 2;
      addText(`• Koreksi Verbal: ${allCorrections.length}`, 10, false);
      yPos += 15;

      // Detailed Feedback
      addText('FEEDBACK DETAIL', 14, true, [59, 130, 246]);
      yPos += 10;

      detailedFeedbacks.forEach((item, index) => {
        checkPageBreak(50);

        // Question number and score
        addText(`PERTANYAAN ${index + 1} (Skor: ${item.feedback?.score || 0}/100)`, 12, true, [0, 0, 0]);
        yPos += 5;

        // Question text
        addText(`Q: ${item.question}`, 10, false, [50, 50, 50]);
        yPos += 5;

        // User's answer
        addText('Jawaban Anda:', 10, true, [100, 100, 100]);
        yPos += 3;
        addText(item.answer, 9, false, [80, 80, 80]);
        yPos += 5;

        // AI Feedback
        if (item.feedback?.feedback) {
          addText('Feedback AI:', 10, true, [100, 100, 100]);
          yPos += 3;
          addText(item.feedback.feedback, 9, false, [80, 80, 80]);
          yPos += 5;
        }

        // Strengths
        if (item.feedback?.strengths && item.feedback.strengths.length > 0) {
          checkPageBreak(30);
          addText('✓ Kekuatan:', 10, true, [16, 185, 129]);
          yPos += 3;
          item.feedback.strengths.forEach(strength => {
            checkPageBreak(15);
            addText(`  • ${strength}`, 9, false, [50, 50, 50]);
            yPos += 2;
          });
          yPos += 3;
        }

        // Improvements
        if (item.feedback?.improvements && item.feedback.improvements.length > 0) {
          checkPageBreak(30);
          addText('↑ Area Pengembangan:', 10, true, [245, 158, 11]);
          yPos += 3;
          item.feedback.improvements.forEach(improvement => {
            checkPageBreak(15);
            addText(`  • ${improvement}`, 9, false, [50, 50, 50]);
            yPos += 2;
          });
          yPos += 3;
        }

        // Corrections
        if (item.feedback?.corrections && item.feedback.corrections.length > 0) {
          checkPageBreak(30);
          addText('! Koreksi Verbal:', 10, true, [239, 68, 68]);
          yPos += 3;
          item.feedback.corrections.forEach(correction => {
            checkPageBreak(15);
            addText(`  • ${correction}`, 9, false, [50, 50, 50]);
            yPos += 2;
          });
          yPos += 3;
        }

        // Separator between questions
        yPos += 5;
        if (index < detailedFeedbacks.length - 1) {
          doc.setDrawColor(230, 230, 230);
          doc.line(margin, yPos, pageWidth - margin, yPos);
          yPos += 10;
        }
      });

      // Footer on last page
      yPos += 15;
      
      // Horizontal separator line
      doc.setDrawColor(200, 200, 200);
      doc.line(margin, yPos, pageWidth - margin, yPos);
      yPos += 10;
      
      // Footer text - centered and professional
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(120, 120, 120);
      const footerText1 = 'Laporan ini dihasilkan oleh IntervAI';
      const footerText2 = 'Platform Latihan Wawancara Berbasis AI';
      const footerText3 = `© ${new Date().getFullYear()} IntervAI. All rights reserved.`;
      
      const text1Width = doc.getTextWidth(footerText1);
      const text2Width = doc.getTextWidth(footerText2);
      doc.text(footerText1, (pageWidth - text1Width) / 2, yPos);
      yPos += 5;
      
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      const text2WidthSmall = doc.getTextWidth(footerText2);
      doc.text(footerText2, (pageWidth - text2WidthSmall) / 2, yPos);
      yPos += 4;
      
      doc.setFontSize(7);
      doc.setTextColor(180, 180, 180);
      const text3Width = doc.getTextWidth(footerText3);
      doc.text(footerText3, (pageWidth - text3Width) / 2, yPos);

      // Save PDF
      const filename = `IntervAI_Report_${displayPosition.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
      doc.save(filename);
      
      console.log('PDF generated successfully');
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Terjadi kesalahan saat mengekspor PDF. Silakan coba lagi.');
    }
  };

  const displayPosition = position || "Posisi Pekerjaan";
  const score = overallScore || 0;

  // Score interpretation with semantic colors (UX best practice)
  const getScoreInterpretation = (score: number) => {
    if (score >= 85) return { label: 'Sangat Baik', color: 'text-emerald-600', bgColor: 'bg-emerald-50', borderColor: 'border-emerald-200' };
    if (score >= 70) return { label: 'Baik', color: 'text-blue-600', bgColor: 'bg-blue-50', borderColor: 'border-blue-200' };
    if (score >= 60) return { label: 'Cukup', color: 'text-amber-600', bgColor: 'bg-amber-50', borderColor: 'border-amber-200' };
    return { label: 'Perlu Peningkatan', color: 'text-red-600', bgColor: 'bg-red-50', borderColor: 'border-red-200' };
  };

  const scoreInfo = getScoreInterpretation(score);

  // Aggregate all strengths and improvements
  const allStrengths = detailedFeedbacks.flatMap(item => item.feedback?.strengths || []);
  const allImprovements = detailedFeedbacks.flatMap(item => item.feedback?.improvements || []);
  const allCorrections = detailedFeedbacks.flatMap(item => item.feedback?.corrections || []);

  const handleStartNew = () => {
    resetStore();
    navigate('/setup');
  };

  return (
    <div className="min-h-screen bg-white text-black pb-24 pt-12 animate-fade-in-up">
      <div ref={reportRef} className="max-w-6xl mx-auto px-4 sm:px-6 space-y-8 md:space-y-12">
        
        {/* Header Section */}
        <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-6 pb-4 md:pb-6 border-b border-gray-200">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900 mb-2">Laporan Hasil Interview</h1>
            <div className="flex items-center gap-2 text-sm">
              <Briefcase className="w-4 h-4 text-gray-400" />
              <span className="text-gray-500 font-medium">{displayPosition}</span>
            </div>
          </div>
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 w-full md:w-auto mt-2 md:mt-0">
            <button 
              onClick={handleExportPDF}
              className="flex items-center gap-2 px-4 py-2 border border-gray-200 bg-white rounded-lg font-medium text-sm hover:bg-gray-50 transition-colors text-gray-700 shadow-sm"
            >
              <Download className="w-4 h-4" /> Export PDF
            </button>
            <Link 
              to="/"
              className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg font-medium text-sm hover:bg-gray-800 transition-colors shadow-sm"
            >
              <Home className="w-4 h-4" /> Beranda
            </Link>
          </div>
        </header>

        {/* Performance Overview - Consistent with Landing Page Bento */}
        <div className="grid grid-cols-1 md:grid-cols-2 border border-gray-200 divide-y md:divide-y-0 md:divide-x divide-gray-200 rounded-2xl overflow-hidden bg-white shadow-sm">
          
          {/* Left Side: Score Summary */}
          <div className="dot-grid bg-gray-50 p-6 sm:p-8 md:p-10 flex flex-col justify-center relative">
            <div className="glow-orb glow-orb-blue w-[300px] h-[300px] top-0 right-0 animate-float-slow"></div>
            <div className="relative z-10">
              <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-6">Skor AI</h2>
              
              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-6xl sm:text-7xl md:text-8xl font-black tracking-tight text-gray-900 leading-none">
                  {Math.round(score)}
                </span>
                <span className="text-2xl font-bold text-gray-300">/100</span>
              </div>
              
              <div className="mb-10">
                <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-semibold border ${
                    scoreInfo.color === 'text-emerald-600' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                    scoreInfo.color === 'text-blue-600' ? 'bg-blue-50 text-blue-600 border-blue-100' : 
                    scoreInfo.color === 'text-amber-600' ? 'bg-amber-50 text-amber-600 border-amber-100' : 
                    'bg-rose-50 text-rose-600 border-rose-100'
                }`}>
                  {scoreInfo.color === 'text-emerald-600' && <CheckCircle2 className="w-3.5 h-3.5" />}
                  {scoreInfo.color === 'text-amber-600' && <TrendingDown className="w-3.5 h-3.5" />}
                  {scoreInfo.color === 'text-rose-600' && <AlertTriangle className="w-3.5 h-3.5" />}
                  {scoreInfo.color === 'text-blue-600' && <TrendingUp className="w-3.5 h-3.5" />}
                  {scoreInfo.label}
                </span>
              </div>

              <button 
                onClick={handleStartNew}
                className="inline-flex items-center gap-2.5 bg-black text-white px-6 py-3 rounded-lg text-sm font-semibold hover:bg-gray-800 transition-colors w-fit"
              >
                Mulai Latihan Baru <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right Side: Metrics Grid */}
          <div className="grid grid-cols-2 divide-x divide-y divide-gray-200">
            <div className="p-8 bento-cell hover:bg-gray-50/50 flex flex-col justify-center">
              <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center mb-4 group-hover:bg-blue-100 transition-colors">
                <CheckCircle2 className="w-5 h-5 text-blue-600" />
              </div>
              <span className="text-3xl font-bold text-gray-900 mb-1">{detailedFeedbacks.length}</span>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest">Pertanyaan</p>
            </div>
            
            <div className="p-8 bento-cell hover:bg-gray-50/50 flex flex-col justify-center">
              <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center mb-4 group-hover:bg-emerald-100 transition-colors">
                <TrendingUp className="w-5 h-5 text-emerald-600" />
              </div>
              <span className="text-3xl font-bold text-gray-900 mb-1">{allStrengths.length}</span>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest">Kekuatan</p>
            </div>
            
            <div className="p-8 bento-cell hover:bg-gray-50/50 flex flex-col justify-center">
              <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center mb-4 group-hover:bg-amber-100 transition-colors">
                <TrendingDown className="w-5 h-5 text-amber-600" />
              </div>
              <span className="text-3xl font-bold text-gray-900 mb-1">{allImprovements.length}</span>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest">Peningkatan</p>
            </div>
            
            <div className="p-8 bento-cell hover:bg-gray-50/50 flex flex-col justify-center">
              <div className="w-10 h-10 rounded-lg bg-rose-50 flex items-center justify-center mb-4 group-hover:bg-rose-100 transition-colors">
                <AlertTriangle className="w-5 h-5 text-rose-600" />
              </div>
              <span className="text-3xl font-bold text-gray-900 mb-1">{allCorrections.length}</span>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest">Koreksi</p>
            </div>
          </div>
        </div>

        {/* Detailed Question-by-Question Feedback */}
        <div className="pt-12">
          <div className="mb-10 max-w-2xl">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 mb-3">Feedback Detail</h2>
            <p className="text-gray-500 leading-relaxed text-lg">
              Analisis mendalam untuk setiap jawaban wawancaramu, 
              dengan metrik yang dapat ditindaklanjuti.
            </p>
          </div>
          
          <div className="space-y-8">
          {detailedFeedbacks.map((item, index) => (
            <div key={index} className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:border-gray-300 transition-colors shadow-sm">
              
              {/* Question Header */}
              <div className="bg-gray-50 p-6 md:p-8 border-b border-gray-200">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="flex items-center gap-2 text-xs font-semibold text-gray-500 uppercase tracking-widest">
                        <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                        Pertanyaan {index + 1}
                      </span>
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-600 bg-white border border-gray-200 px-2.5 py-1 rounded-md shadow-sm">
                        Skor AI: <span className="text-blue-600 font-bold">{item.feedback?.score || 0}</span>
                      </span>
                    </div>
                    <p className="text-gray-900 font-bold text-lg md:text-xl leading-relaxed">"{item.question}"</p>
                  </div>
                </div>
              </div>

              {/* Answer & Feedback */}
              <div className="p-6 md:p-8 space-y-8">
                
                {/* User Answer */}
                <div>
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Jawaban Anda</h4>
                  <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                    <p className="text-gray-600 leading-relaxed text-sm">
                      {item.answer}
                    </p>
                  </div>
                </div>

                {/* AI Feedback */}
                {item.feedback?.feedback && (
                  <div>
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Feedback AI</h4>
                    <p className="text-gray-700 leading-relaxed text-sm">
                      {item.feedback.feedback}
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                  {/* Strengths */}
                  {item.feedback?.strengths && item.feedback.strengths.length > 0 && (
                    <div className="bg-emerald-50/50 rounded-xl p-5 border border-emerald-100/50">
                      <h4 className="text-xs font-bold text-emerald-700 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4" />
                        Kekuatan
                      </h4>
                      <ul className="space-y-3">
                        {item.feedback.strengths.map((strength, i) => (
                          <li key={i} className="flex gap-3 text-sm text-gray-700 leading-relaxed">
                            <span className="text-emerald-500 mt-0.5">•</span>
                            <span>{strength}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Improvements */}
                  {item.feedback?.improvements && item.feedback.improvements.length > 0 && (
                    <div className="bg-amber-50/50 rounded-xl p-5 border border-amber-100/50">
                      <h4 className="text-xs font-bold text-amber-700 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <TrendingUp className="w-4 h-4" />
                        Area Pengembangan
                      </h4>
                      <ul className="space-y-3">
                        {item.feedback.improvements.map((improvement, i) => (
                          <li key={i} className="flex gap-3 text-sm text-gray-700 leading-relaxed">
                            <span className="text-amber-500 mt-0.5">•</span>
                            <span>{improvement}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Corrections (Filler Words, Pauses) */}
                {item.feedback?.corrections && item.feedback.corrections.length > 0 && (
                  <div className="bg-rose-50/50 rounded-xl p-5 border border-rose-100/50 mt-6">
                    <h4 className="text-xs font-bold text-rose-700 uppercase tracking-widest mb-4 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4" />
                      Koreksi Verbal (Filler Words / Jeda)
                    </h4>
                    <ul className="space-y-3">
                      {item.feedback.corrections.map((correction, i) => (
                        <li key={i} className="flex gap-3 text-sm text-gray-700 leading-relaxed">
                          <span className="text-rose-500 font-bold mt-0.5">!</span>
                          <span>{correction}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

              </div>
            </div>
          ))}
        </div>
        </div>

      </div>
    </div>
  );
}
