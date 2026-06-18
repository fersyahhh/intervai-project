import { Link } from 'react-router-dom';
import { UploadCloud, FileText } from 'lucide-react';

export default function SetupPage() {
  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Interview Setup</h1>
        <p className="text-gray-500">Provide details about the job you are applying for to personalize the interview.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border border-gray-200 divide-y md:divide-y-0 md:divide-x divide-gray-200 rounded-xl overflow-hidden bg-white">
        
        {/* Job Details Cell */}
        <div className="p-8 space-y-6 bg-gray-50">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            Job Details
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Position Title</label>
              <input type="text" className="w-full border border-gray-300 rounded-md p-2" placeholder="e.g. Frontend Developer" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Job Description</label>
              <textarea className="w-full border border-gray-300 rounded-md p-2 h-32" placeholder="Paste the job requirements here..."></textarea>
            </div>
          </div>
        </div>

        {/* CV Upload Cell */}
        <div className="p-8 space-y-6 bg-white flex flex-col justify-between">
          <div>
            <h2 className="text-xl font-semibold flex items-center gap-2 mb-6">
              <UploadCloud className="w-5 h-5 text-blue-600" />
              Upload Resume (CV)
            </h2>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:bg-gray-50 transition-colors cursor-pointer">
              <UploadCloud className="w-10 h-10 text-gray-400 mx-auto mb-4" />
              <p className="text-sm font-medium text-gray-700">Click to upload or drag and drop</p>
              <p className="text-xs text-gray-500 mt-1">PDF (MAX. 5MB)</p>
            </div>
          </div>
          
          <div className="pt-8">
            <Link to="/interview" className="w-full flex justify-center py-3 bg-black text-white rounded-md font-medium hover:bg-gray-800 transition-colors">
              Start Interview
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
