import { useState, useEffect, useRef, useCallback } from 'react';
import { useInterviewStore } from '../store/useInterviewStore';

// Type declarations for Web Speech API
interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: any;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message: string;
}

interface SpeechRecognitionInstance extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  abort(): void;
  onerror: ((this: SpeechRecognitionInstance, ev: SpeechRecognitionErrorEvent) => any) | null;
  onend: ((this: SpeechRecognitionInstance, ev: Event) => any) | null;
  onresult: ((this: SpeechRecognitionInstance, ev: SpeechRecognitionEvent) => any) | null;
  onstart: ((this: SpeechRecognitionInstance, ev: Event) => any) | null;
}

declare global {
  interface Window {
    SpeechRecognition: { new (): SpeechRecognitionInstance };
    webkitSpeechRecognition: { new (): SpeechRecognitionInstance };
  }
}

export function useSpeechToText() {
  const [isSupported, setIsSupported] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const silenceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const shouldBeRecordingRef = useRef(false);
  const isInitializedRef = useRef(false);

  // Hesitation detection (silence > 4 seconds)
  const SILENCE_THRESHOLD_MS = 4000;

  // Use refs for store actions so they never cause re-renders or re-initialization
  const storeActionsRef = useRef({
    appendTranscript: useInterviewStore.getState().appendTranscript,
    incrementHesitation: useInterviewStore.getState().incrementHesitation,
    setStatus: useInterviewStore.getState().setStatus,
  });

  // Keep refs in sync (Zustand actions are stable, but just in case)
  useEffect(() => {
    storeActionsRef.current = {
      appendTranscript: useInterviewStore.getState().appendTranscript,
      incrementHesitation: useInterviewStore.getState().incrementHesitation,
      setStatus: useInterviewStore.getState().setStatus,
    };
  });

  const clearSilenceTimer = useCallback(() => {
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
  }, []);

  const startSilenceTimer = useCallback(() => {
    clearSilenceTimer();
    silenceTimerRef.current = setTimeout(function tick() {
      storeActionsRef.current.incrementHesitation();
      console.log('⚠️ [SpeechToText] Hesitation detected! (+1)');
      silenceTimerRef.current = setTimeout(tick, SILENCE_THRESHOLD_MS);
    }, SILENCE_THRESHOLD_MS);
  }, [clearSilenceTimer]);

  // Initialize SpeechRecognition ONCE on mount (empty dependency array)
  useEffect(() => {
    // Prevent double initialization in React StrictMode
    if (isInitializedRef.current) return;

    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognitionAPI) {
      setIsSupported(false);
      setError('Browser Anda tidak mendukung Web Speech API. Silakan gunakan Google Chrome.');
      return;
    }

    isInitializedRef.current = true;

    const recognition = new SpeechRecognitionAPI();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'id-ID';

    recognition.onstart = () => {
      console.log('🎙️ [SpeechToText] Microphone activated, listening started.');
      setIsRecording(true);
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let finalText = '';
      let interimText = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalText += event.results[i][0].transcript + ' ';
        } else {
          interimText += event.results[i][0].transcript;
        }
      }

      if (interimText.trim()) {
        console.log('🗣️ [SpeechToText] Sedang mendengarkan (Interim):', interimText);
      }

      if (finalText.trim()) {
        console.log('✅ [SpeechToText] Teks Final:', finalText);
        storeActionsRef.current.appendTranscript(finalText);
      }
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      // These errors are normal and expected — just ignore them
      if (event.error === 'no-speech' || event.error === 'aborted') {
        console.log(`ℹ️ [SpeechToText] Ignored error: ${event.error}`);
        return;
      }

      console.error('❌ [SpeechToText] Error:', event.error);
      setError(`Terjadi kesalahan pada mikrofon: ${event.error}`);
      shouldBeRecordingRef.current = false;
      setIsRecording(false);
      storeActionsRef.current.setStatus('idle');
    };

    recognition.onend = () => {
      console.log('🎙️ [SpeechToText] Sesi berhenti.');

      if (shouldBeRecordingRef.current) {
        console.log('🔄 [SpeechToText] Auto-restart...');
        setTimeout(() => {
          if (shouldBeRecordingRef.current && recognitionRef.current) {
            try {
              recognitionRef.current.start();
            } catch (e) {
              console.error('❌ [SpeechToText] Gagal restart:', e);
            }
          }
        }, 300);
      } else {
        setIsRecording(false);
      }
    };

    recognitionRef.current = recognition;

    // Cleanup: only abort on true unmount, not on StrictMode re-run
    return () => {
      // Don't cleanup in StrictMode double-invoke
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const startRecording = useCallback(() => {
    setError(null);
    if (!isSupported || !recognitionRef.current) return;

    try {
      shouldBeRecordingRef.current = true;
      recognitionRef.current.start();
      storeActionsRef.current.setStatus('recording');
      startSilenceTimer();
      console.log('▶️ [SpeechToText] User pressed START');
    } catch (err) {
      console.error('Failed to start recording:', err);
    }
  }, [isSupported, startSilenceTimer]);

  const stopRecording = useCallback(() => {
    if (!recognitionRef.current) return;

    try {
      shouldBeRecordingRef.current = false;
      recognitionRef.current.stop();
      setIsRecording(false);
      storeActionsRef.current.setStatus('processing');
      clearSilenceTimer();
      console.log('⏹️ [SpeechToText] User pressed STOP');
    } catch (err) {
      console.error('Failed to stop recording:', err);
    }
  }, [clearSilenceTimer]);

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
