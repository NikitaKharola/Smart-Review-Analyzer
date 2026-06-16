function VoiceAssistant() {
  return (
    <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6 rounded-2xl shadow-lg">

      <h2 className="text-2xl font-bold mb-3">
        🎤 Voice Review Assistant
      </h2>

      <p className="mb-4">
        Speak a guest review instead of typing.
      </p>

      <button className="bg-white text-blue-600 px-5 py-2 rounded-xl font-semibold">
        Start Listening
      </button>

    </div>
  );
}

export default VoiceAssistant;