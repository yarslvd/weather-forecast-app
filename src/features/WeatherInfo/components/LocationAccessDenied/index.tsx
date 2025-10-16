export const LocationAccessDenied = () => {
  return (
    <section className="flex flex-col items-center justify-center text-stone-200 h-full min-h-60">
      <p className="text-lg mb-1">No weather data yet.</p>
      <p className="text-stone-400 text-sm">
        Allow location access or search for a city to see the forecast.
      </p>
    </section>
  );
};
