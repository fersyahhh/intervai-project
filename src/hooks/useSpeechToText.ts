import { useState, useEffect, useRef, useCallback } from 'react';
import { useInterviewStore } from '../store/useInterviewStore';
import toast from 'react-hot-toast';

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

  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const silenceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const shouldBeRecordingRef = useRef(false);
  const isInitializedRef = useRef(false);
  const previousSessionsTextRef = useRef('');

  // Hesitation detection (silence > 4 seconds)
  const SILENCE_THRESHOLD_MS = 4000;

  // Use refs for store actions so they never cause re-renders or re-initialization
  const storeActionsRef = useRef({
    setTranscript: useInterviewStore.getState().setTranscript,
    incrementHesitation: useInterviewStore.getState().incrementHesitation,
    setStatus: useInterviewStore.getState().setStatus,
  });

  // Keep refs in sync (Zustand actions are stable, but just in case)
  useEffect(() => {
    storeActionsRef.current = {
      setTranscript: useInterviewStore.getState().setTranscript,
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
      toast.error('Browser Anda tidak mendukung Web Speech API. Silakan gunakan Google Chrome.');
      return;
    }

    isInitializedRef.current = true;

    const recognition = new SpeechRecognitionAPI();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'id-ID';

    recognition.onstart = () => {
      setIsRecording(true);
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let currentFinal = '';

      // Always iterate from 0 to capture the full state of the current continuous session.
      // This prevents bugs on mobile where resultIndex might behave unexpectedly.
      for (let i = 0; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          currentFinal += event.results[i][0].transcript + ' ';
        }
      }

      // Combine previous sessions (if auto-restarted) with current final text
      const fullTranscript = (previousSessionsTextRef.current + ' ' + currentFinal).trim();
      
      if (fullTranscript) {
        storeActionsRef.current.setTranscript(fullTranscript);
      }
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      // These errors are normal and expected — just ignore them
      if (event.error === 'no-speech' || event.error === 'aborted') {
        return;
      }

      toast.error(`Terjadi kesalahan pada mikrofon: ${event.error}`);
      shouldBeRecordingRef.current = false;
      setIsRecording(false);
      storeActionsRef.current.setStatus('idle');
    };

    recognition.onend = () => {
      // Save current transcript state before auto-restart clears the event.results
      const currentFullText = useInterviewStore.getState().transcript;
      if (currentFullText) {
        previousSessionsTextRef.current = currentFullText;
      }

      if (shouldBeRecordingRef.current) {
        setTimeout(() => {
          if (shouldBeRecordingRef.current && recognitionRef.current) {
            try {
              recognitionRef.current.start();
            } catch (e) {
              // ignore
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
    if (!isSupported || !recognitionRef.current) return;

    try {
      // Reset previous session text when starting a completely new recording explicitly
      const currentFullText = useInterviewStore.getState().transcript;
      previousSessionsTextRef.current = currentFullText;
      
      shouldBeRecordingRef.current = true;
      recognitionRef.current.start();
      storeActionsRef.current.setStatus('recording');
      startSilenceTimer();
    } catch (err) {
      // ignore
    }
  }, [isSupported, startSilenceTimer]);

  const stopRecording = useCallback(() => {
    if (!recognitionRef.current) return;

    try {
      shouldBeRecordingRef.current = false;
      recognitionRef.current.stop();
      setIsRecording(false);
      storeActionsRef.current.setStatus('idle');
      clearSilenceTimer();
    } catch (err) {
      // ignore
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
    startRecording,
    stopRecording,
    toggleRecording,
  };
}
