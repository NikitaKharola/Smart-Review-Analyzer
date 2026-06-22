function VoiceAssistant() {
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

      <button
        className="
        bg-white
        text-blue-600
        dark:bg-slate-200
        dark:text-slate-900
        px-5
        py-2
        rounded-xl
        font-semibold
        "
      >
        Start Listening
      </button>
    </div>
  );
}

export default VoiceAssistant;