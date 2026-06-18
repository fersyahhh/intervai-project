import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mic, Square, Loader2 } from 'lucide-react';

export default function InterviewRoomPage() {
  const [recording, setRecording] = useState(false);
  const [processing, setProcessing] = useState(false);

  // Dummy toggler for UI demo
  const toggleRecording = () => {
    if (recording) {
      setRecording(false);
      setProcessing(true);
      setTimeout(() => setProcessing(false), 2000);
    } else {
      setRecording(true);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Interview Session</h1>
          <p className="text-gray-500">Frontend Developer Role</p>
        </div>
        <div className="text-sm px-3 py-1 bg-gray-100 text-gray-600 rounded-full font-medium">
          Question 1 of 5
        </div>
      </div>

      {/* Main Bento Grid */}
      <div className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
        
        {/* AI Question Section */}
        <div className="p-8 border-b border-gray-200 bg-gray-50">
          <p className="text-lg font-medium text-gray-800">
            "Can you describe a time when you had to optimize a slow React application? What steps did you take?"
          </p>
        </div>

        {/* User Answer / STT Section */}
        <div className="p-8 min-h-[300px] flex flex-col justify-between">
          <div className="flex-grow">
            {recording ? (
              <p className="text-gray-700 italic">Listening... I noticed that my components were re-rendering unnecessarily...</p>
            ) : processing ? (
              <div className="flex items-center justify-center h-full space-x-2 text-gray-500">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Processing answer...</span>
              </div>
            ) : (
              <p className="text-gray-400">Click the microphone to start answering.</p>
            )}
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-100">
            <div className="text-sm text-gray-500">
              {recording && <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span> Recording</span>}
            </div>
            
            <button 
              onClick={toggleRecording}
              disabled={processing}
              className={`flex items-center justify-center w-14 h-14 rounded-full transition-all ${
                recording 
                  ? 'bg-red-100 text-red-600 hover:bg-red-200' 
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              } ${processing ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {recording ? <Square className="w-5 h-5" fill="currentColor" /> : <Mic className="w-6 h-6" />}
            </button>

            <div>
              <Link to="/report" className="text-sm font-medium text-blue-600 hover:underline">
                Finish Interview
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
