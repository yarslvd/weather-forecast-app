import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { weatherForecastService } from "@/services/WeatherForecastService";
import { getCurrentLocation } from "@lib/utils";
import { ErrorsTexts } from "@constants/errors";
import { config } from "@/config";

import type { Coordinates, WeatherForecast } from "@/types";

export const useWeatherForecast = () => {
  const [weather, setWeather] = useState<WeatherForecast | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [geoAllowed, setGeoAllowed] = useState<boolean | null>(null);

  const latestCoordsRef = useRef<Coordinates | null>(null);
  const latestCityRef = useRef<string | null>(null);

  const fetchForecastByCity = useCallback(
    async (city: string): Promise<WeatherForecast | undefined> => {
      if (!city.trim()) return;

      setLoading(true);
      setError(null);
      latestCityRef.current = city;
      latestCoordsRef.current = null;

      try {
        const data = await weatherForecastService.getWeatherByCity(city);

        setWeather(data);
        return data;
      } catch (err: unknown) {
        handleError(err);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const fetchForecastByCoords = useCallback(
    async (lat: number, lon: number): Promise<WeatherForecast | undefined> => {
      if (!lat || !lon) return;

      setLoading(true);
      setError(null);
      latestCoordsRef.current = { lat, lon };
      latestCityRef.current = null;

      try {
        const data = await weatherForecastService.getWeatherByCoords({
          lat,
          lon,
        });

        setWeather(data);
        return data;
      } catch (err: unknown) {
        handleError(err);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const fetchCurrentLocationForecast = async () => {
    try {
      setLoading(true);
      setError(null);

      const position = await getCurrentLocation();
      latestCoordsRef.current = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
      };
      setGeoAllowed(true);

      const data = await weatherForecastService.getWeatherByCoords({
        lat: position.coords.latitude,
        lon: position.coords.longitude,
      });

      setWeather(data);
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleError = (err: unknown) => {
    if (err instanceof Error) {
      setError(err.message);
      if (err.message.includes("denied")) setGeoAllowed(false);
    } else {
      const msg = ErrorsTexts.UNKNOWN_ERROR;
      setError(msg);
      toast.error(msg);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const fetchLatest = async () => {
        if (latestCityRef.current) {
          await fetchForecastByCity(latestCityRef.current);
        } else if (latestCoordsRef.current) {
          const { lat, lon } = latestCoordsRef.current;
          await fetchForecastByCoords(lat, lon);
        }
      };

      fetchLatest();
    }, config.weatherRefetchInterval);

    return () => clearInterval(interval);
  }, [fetchForecastByCity, fetchForecastByCoords]);

  useEffect(() => {
    fetchCurrentLocationForecast();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    weather,
    loading,
    error,
    geoAllowed,
    fetchForecastByCity,
    fetchForecastByCoords,
    fetchCurrentLocationForecast,
  };
};
