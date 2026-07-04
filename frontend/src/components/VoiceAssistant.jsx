import { useState, useRef, useEffect } from "react";

/**
 * Uses the browser's built-in Web Speech API (SpeechRecognition).
 * No API key, no backend call needed for the speech-to-text part itself.
 * Works in Chrome/Edge. Safari/Firefox support is limited or absent,
 * so we detect that and show a friendly message instead of breaking.
 */
function VoiceAssistant({ onTranscript }) {
  const [supported, setSupported] = useState(true);
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [error, setError] = useState("");
  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setSupported(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event) => {
      let text = "";
      for (let i = 0; i < event.results.length; i++) {
        text += event.results[i][0].transcript;
      }
      setTranscript(text);
    };

    recognition.onerror = (event) => {
      setError(
        event.error === "not-allowed"
          ? "Microphone access was blocked. Please allow mic access and try again."
          : `Voice recognition error: ${event.error}`
      );
      setListening(false);
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognitionRef.current = recognition;
  }, []);

  const startListening = () => {
    if (!recognitionRef.current) return;
    setError("");
    setTranscript("");
    setListening(true);
    recognitionRef.current.start();
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
    setListening(false);
  };

  const useThisReview = () => {
    if (transcript.trim() && onTranscript) {
      onTranscript(transcript.trim());
    }
  };

  return (
    <div
      className="
      bg-gradient-to-r
      from-purple-600
      to-blue-600
      dark:from-slate-800
      dark:to-slate-900
      text-white
      p-6
      rounded-2xl
      shadow-lg
      transition-colors
      duration-300
      "
    >
      <h2 className="text-2xl font-bold mb-3">
        🎤 Voice Review Assistant
      </h2>

      <p className="mb-4 text-slate-100 dark:text-slate-300">
        Speak a guest review instead of typing.
      </p>

      {!supported && (
        <p className="text-yellow-200 text-sm mb-3">
          Voice input isn't supported in this browser. Try Chrome or Edge on desktop.
        </p>
      )}

      {supported && (
        <>
          <button
            onClick={listening ? stopListening : startListening}
            className={`
              px-5 py-2 rounded-xl font-semibold transition
              ${listening
                ? "bg-red-500 text-white animate-pulse"
                : "bg-white text-blue-600 dark:bg-slate-200 dark:text-slate-900"}
            `}
          >
            {listening ? "⏹ Stop Listening" : "🎙 Start Listening"}
          </button>

          {error && (
            <p className="mt-3 text-sm text-red-200">{error}</p>
          )}

          {transcript && (
            <div className="mt-4 bg-white/10 rounded-xl p-4">
              <p className="text-sm text-slate-100 mb-3">"{transcript}"</p>
              <button
                onClick={useThisReview}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition"
              >
                Use this in the review box ↓
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default VoiceAssistant;