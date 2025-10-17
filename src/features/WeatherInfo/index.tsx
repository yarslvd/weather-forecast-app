import { Droplets, Gauge, Wind } from "lucide-react";
import { WeatherDetail } from "@features/WeatherInfo/components/WeatherDetail";
import { Skeleton } from "@components/ui/skeleton";
import { LocationAccessDenied } from "./components/LocationAccessDenied";
import { ErrorScreen } from "./components/ErrorScreen";
import { getWeatherIconUrl } from "@lib/utils";

import type { WeatherForecast } from "@/types";

interface WeatherInfoProps {
  weatherForecast: WeatherForecast | null;
  loading: boolean;
  error: string | null;
  geoAllowed: boolean | null;
}

export const WeatherInfo = ({
  weatherForecast,
  loading,
  error,
  geoAllowed,
}: WeatherInfoProps) => {
  const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;
  const isApiKeyMissing = !apiKey || apiKey.trim() === "";
  const isLoading = loading && !weatherForecast && !error;
  const isLocationAccessDenied =
    !loading && !weatherForecast && geoAllowed !== null && !geoAllowed;

  const renderText = (
    text: React.ReactNode,
    skeletonWidth: string,
    skeletonHeight = "h-4"
  ) =>
    isLoading ? (
      <Skeleton className={`${skeletonHeight} ${skeletonWidth}`} />
    ) : (
      text
    );

  const temp = weatherForecast && Math.round(weatherForecast.temperature);
  const min = weatherForecast && Math.round(weatherForecast.tempMin);
  const max = weatherForecast && Math.round(weatherForecast.tempMax);

  if (isLocationAccessDenied) return <LocationAccessDenied />;
  if (error || isApiKeyMissing)
    return <ErrorScreen error={error} isApiKeyMissing={isApiKeyMissing} />;

  return (
    <section className="flex flex-col overflow-hidden">
      {/* Location + description */}
      <header className="flex justify-between items-center">
        <div className="flex flex-col gap-1 flex-1 min-w-0">
          {renderText(
            <h2 className="text-3xl text-stone-200 font-bold truncate">
              {weatherForecast?.city}, {weatherForecast?.country}{" "}
            </h2>,
            "w-48",
            "h-10"
          )}

          {renderText(
            <p className="text-stone-200/70 capitalize">
              {weatherForecast?.description}
            </p>,
            "w-32",
            "h-5"
          )}
        </div>
      </header>

      {/* Temperature + icon */}
      <div className="flex items-center gap-2 text-stone-200">
        <div className="flex flex-col gap-1">
          {renderText(
            <div className="text-6xl font-bold">{temp}&#176;</div>,
            "w-28",
            "h-12"
          )}

          {renderText(
            <div
              className="text-sm text-stone-200/70"
              aria-label={`Temperature range: minimum ${min}\u00B0C, maximum ${max}\u00B0C`}
              title={`Min: ${min}\u00B0C | Max: ${max}\u00B0C`}
            >
              <span className="font-medium">&#x2193;</span> {min}&#176;C {" | "}
              <span className="font-medium">&#x2191;</span> {max}&#176;C
            </div>,
            "w-36"
          )}
        </div>

        {isLoading ? (
          <div className="w-42 h-42" />
        ) : weatherForecast ? (
          <>
            <link
              rel="preload"
              as="image"
              fetchPriority="high"
              href={getWeatherIconUrl(weatherForecast.icon)}
            />
            <img
              rel="preload"
              src={getWeatherIconUrl(weatherForecast.icon)}
              alt={weatherForecast.description}
              className="w-42 h-42"
              loading="eager"
              decoding="async"
              fetchPriority="high"
            />
          </>
        ) : null}
      </div>

      {/* Weather details */}
      <div className="grid sm:grid-cols-3 gap-1 text-stone-200">
        <WeatherDetail
          icon={<Wind aria-label="Wind speed" />}
          label="Wind"
          value={`${weatherForecast?.windSpeed ?? "--"} m/s`}
          loading={isLoading}
        />
        <WeatherDetail
          icon={<Droplets aria-label="Humidity" />}
          label="Humidity"
          value={`${weatherForecast?.humidity ?? "--"}%`}
          loading={isLoading}
        />
        <WeatherDetail
          icon={<Gauge aria-label="Pressure" />}
          label="Pressure"
          value={`${weatherForecast?.pressure ?? "--"} hPa`}
          loading={isLoading}
        />
      </div>
    </section>
  );
};
