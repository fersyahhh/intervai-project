import { Link } from 'react-router-dom';
import { Download, CheckCircle, AlertCircle } from 'lucide-react';

export default function ReportDashboardPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-1">Interview Report</h1>
          <p className="text-gray-500">Frontend Developer Role</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 bg-white rounded-md font-medium text-sm hover:bg-gray-50 transition-colors">
          <Download className="w-4 h-4" /> Export PDF
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border border-gray-200 divide-y md:divide-y-0 md:divide-x divide-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
        
        {/* Score Summary */}
        <div className="p-8 bg-gray-50 flex flex-col items-center justify-center text-center">
          <div className="relative w-32 h-32 flex items-center justify-center rounded-full border-8 border-blue-100 mb-4">
            <span className="text-4xl font-bold text-blue-600">85</span>
          </div>
          <h2 className="text-lg font-semibold mb-1">Overall Score</h2>
          <p className="text-sm text-gray-500">Great job! You demonstrated strong technical knowledge.</p>
        </div>

        {/* Detailed Feedback */}
        <div className="p-8 md:col-span-2 space-y-6 bg-white">
          <h3 className="text-lg font-semibold border-b border-gray-100 pb-2">Feedback Summary</h3>
          
          <div className="space-y-4">
            <div className="flex gap-3">
              <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-gray-800">Strong Technical Explanations</h4>
                <p className="text-sm text-gray-600 mt-1">Your explanation of React re-renders and memoization was clear and accurate.</p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-gray-800">Hesitation Detected</h4>
                <p className="text-sm text-gray-600 mt-1">We noticed some pauses when discussing performance profiling tools. Try to familiarize yourself more with Chrome DevTools.</p>
              </div>
            </div>
          </div>

          <div className="pt-6">
            <Link to="/setup" className="text-blue-600 font-medium hover:underline text-sm">
              Start Another Practice Session &rarr;
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
