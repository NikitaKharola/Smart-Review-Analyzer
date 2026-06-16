function Hero() {
  return (
<section className="bg-gradient-to-r from-blue-700 to-purple-700 text-white">
  
  <div className="max-w-7xl mx-auto px-6 py-20 flex flex-col md:flex-row items-center justify-between gap-10">

    {/* TEXT */}
    <div className="md:w-1/2">
      <h1 className="text-5xl font-bold mb-6">
        AI Powered Guest Review Analysis
      </h1>

      <p className="text-xl mb-8">
        Analyze guest reviews from Google, Booking.com, TripAdvisor and Instagram
        to uncover valuable insights.
      </p>

      <div className="flex gap-4">
        <button className="bg-white text-blue-700 px-6 py-3 rounded-xl font-semibold">
          Analyze Reviews
        </button>

        <button className="border px-6 py-3 rounded-xl">
          View Demo
        </button>
      </div>
    </div>

    {/* IMAGE */}
    <div className="md:w-1/2 flex justify-center md:justify-end">
      <img
        src="https://images.unsplash.com/photo-1566073771259-6a8506099945"
        alt="Hotel"
        className="w-full max-w-md md:max-w-lg h-[380px] object-cover rounded-2xl shadow-2xl"
      />
    </div>

  </div>
</section>
  );
}

export default Hero;