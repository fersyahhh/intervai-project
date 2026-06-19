import { useState, useEffect, useRef, useCallback } from 'react';
import { useInterviewStore } from '../store/useInterviewStore';

// Type declarations for Web Speech API
interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: any; // SpeechRecognitionResultList
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message: string;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  abort(): void;
  onerror: ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => any) | null;
  onend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
  onsoundstart: ((this: SpeechRecognition, ev: Event) => any) | null;
  onsoundend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onstart: ((this: SpeechRecognition, ev: Event) => any) | null;
}

declare global {
  interface Window {
    SpeechRecognition: { new (): SpeechRecognition };
    webkitSpeechRecognition: { new (): SpeechRecognition };
  }
}

export function useSpeechToText() {
  const [isSupported, setIsSupported] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const silenceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  
  // Track if we intentionally want to keep recording
  // This helps auto-restart the API if it stops due to silence
  const shouldBeRecordingRef = useRef(false);

  // Connect to Zustand store
  const appendTranscript = useInterviewStore((state) => state.appendTranscript);
  const incrementHesitation = useInterviewStore((state) => state.incrementHesitation);
  const setStatus = useInterviewStore((state) => state.setStatus);

  // Hesitation detection (silence > 4 seconds)
  const SILENCE_THRESHOLD_MS = 4000;

  const clearSilenceTimer = useCallback(() => {
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
  }, []);

  const resetSilenceTimer = useCallback(() => {
    clearSilenceTimer();
    if (isRecording) {
      silenceTimerRef.current = setTimeout(() => {
        incrementHesitation();
        console.log('⚠️ [SpeechToText] Hesitation detected! (+1)');
        // Restart timer after detecting hesitation
        resetSilenceTimer();
      }, SILENCE_THRESHOLD_MS);
    }
  }, [isRecording, incrementHesitation, clearSilenceTimer]);

  useEffect(() => {
    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognitionAPI) {
      setIsSupported(false);
      setError('Browser Anda tidak mendukung Web Speech API. Silakan gunakan Google Chrome.');
      return;
    }

    const recognition = new SpeechRecognitionAPI();
    recognition.continuous = true;
    recognition.interimResults = true; // Enable interim results to show in console
    recognition.lang = 'id-ID';

    // Add logging for start event
    recognition.onstart = () => {
      console.log('🎙️ [SpeechToText] Microphone activated, listening started.');
      setIsRecording(true);
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let newTranscript = '';
      let interimTranscript = '';
      
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          newTranscript += event.results[i][0].transcript + ' ';
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }

      // Log for debugging
      if (interimTranscript.trim() !== '') {
        console.log('🗣️ [SpeechToText] Sedang mendengarkan (Interim):', interimTranscript);
      }

      if (newTranscript.trim() !== '') {
        console.log('✅ [SpeechToText] Teks Final (Final):', newTranscript);
        appendTranscript(newTranscript);
        // User spoke, so reset the silence timer
        resetSilenceTimer();
      }
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error('❌ [SpeechToText] Error mendeteksi suara:', event.error);
      
      // 'no-speech' happens when user is silent for a while. We can safely ignore it.
      // The onend event will fire right after this and we will auto-restart.
      if (event.error === 'no-speech') {
        return;
      }
      
      setError(`Terjadi kesalahan pada mikrofon: ${event.error}`);
      shouldBeRecordingRef.current = false;
      setIsRecording(false);
      setStatus('processing');
      clearSilenceTimer();
    };

    recognition.onend = () => {
      console.log('🎙️ [SpeechToText] Sesi mendengarkan berhenti.');
      
      // Auto-restart if we didn't explicitly stop it
      if (shouldBeRecordingRef.current) {
        console.log('🔄 [SpeechToText] Auto-restart Web Speech API (menjaga tetap mendengarkan)...');
        try {
          recognition.start();
        } catch (e) {
          console.error('❌ [SpeechToText] Gagal merestart otomatis:', e);
          shouldBeRecordingRef.current = false;
          setIsRecording(false);
          setStatus('processing');
          clearSilenceTimer();
        }
      } else {
        setIsRecording(false);
        clearSilenceTimer();
      }
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        shouldBeRecordingRef.current = false;
        recognitionRef.current.abort();
      }
      clearSilenceTimer();
    };
  }, [appendTranscript, resetSilenceTimer, clearSilenceTimer, setStatus]);

  // Effect to manage the silence timer based on recording state
  useEffect(() => {
    if (isRecording) {
      resetSilenceTimer();
    } else {
      clearSilenceTimer();
    }
  }, [isRecording, resetSilenceTimer, clearSilenceTimer]);

  const startRecording = useCallback(() => {
    setError(null);
    if (!isSupported || !recognitionRef.current) return;

    try {
      shouldBeRecordingRef.current = true;
      recognitionRef.current.start();
      setStatus('recording');
    } catch (err) {
      console.error('Failed to start recording:', err);
    }
  }, [isSupported, setStatus]);

  const stopRecording = useCallback(() => {
    if (!isSupported || !recognitionRef.current) return;

    try {
      shouldBeRecordingRef.current = false;
      recognitionRef.current.stop();
      setIsRecording(false);
      setStatus('processing');
      clearSilenceTimer();
    } catch (err) {
      console.error('Failed to stop recording:', err);
    }
  }, [isSupported, setStatus, clearSilenceTimer]);

  const toggleRecording = useCallback(() => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  }, [isRecording, startRecording, stopRecording]);

  return {
    isSupported,
    isRecording,
    error,
    startRecording,
    stopRecording,
    toggleRecording,
  };
}
