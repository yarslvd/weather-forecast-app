interface ErrorScreenProps {
  error: string | null;
  isApiKeyMissing?: boolean;
}

export const ErrorScreen = ({ error, isApiKeyMissing }: ErrorScreenProps) => {
  if (isApiKeyMissing) {
    return (
      <section className="flex flex-col items-center justify-center text-red-400/80 h-full min-h-60 text-center p-4">
        <h2 className="text-lg font-semibold mb-2">
          OpenWeather API Key Missing
        </h2>
        <p>
          Please set <code>VITE_OPENWEATHER_API_KEY</code> in your{" "}
          <code>.env</code> file.
        </p>
      </section>
    );
  }

  return (
    <section className="flex flex-col items-center justify-center text-stone-200 h-full min-h-60 text-center">
      <p className="text-lg font-semibold mb-2">Something went wrong</p>
      {error && <p className="text-stone-400 text-sm max-w-xs">{error}</p>}
      <p className="text-stone-500 text-xs mt-2">
        Try searching again or checking your connection.
      </p>
    </section>
  );
};
