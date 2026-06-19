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
        console.log('Hesitation detected! (+1)');
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
    recognition.interimResults = false; // We only process final results to append cleanly to the store
    recognition.lang = 'id-ID';

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let newTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          newTranscript += event.results[i][0].transcript + ' ';
        }
      }

      if (newTranscript.trim() !== '') {
        appendTranscript(newTranscript);
        // User spoke, so reset the silence timer
        resetSilenceTimer();
      }
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error('Speech recognition error', event.error);
      setError(`Terjadi kesalahan pada mikrofon: ${event.error}`);
      stopRecording();
    };

    recognition.onend = () => {
      // If it ends unexpectedly but we are still supposed to be recording, we might want to restart
      // But for MVP, we just handle graceful stops
      setIsRecording(false);
      clearSilenceTimer();
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
      clearSilenceTimer();
    };
  }, [appendTranscript, resetSilenceTimer, clearSilenceTimer]);

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
      recognitionRef.current.start();
      setIsRecording(true);
      setStatus('recording');
    } catch (err) {
      console.error('Failed to start recording:', err);
    }
  }, [isSupported, setStatus]);

  const stopRecording = useCallback(() => {
    if (!isSupported || !recognitionRef.current) return;

    try {
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
