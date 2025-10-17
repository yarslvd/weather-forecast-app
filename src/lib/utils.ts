import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { ErrorsTexts } from "@constants/errors";

import type {
  Coordinates,
  OpenWeatherResponse,
  WeatherForecast,
} from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getWeatherIconUrl(iconCode: string): string {
  return `https://openweathermap.org/img/wn/${iconCode}@4x.png`;
}

export const formatWeatherData = (
  data: OpenWeatherResponse,
  coords: Coordinates,
  state?: string,
): WeatherForecast => {
  const { name, sys, main, weather, wind } = data;

  return {
    city: name,
    country: sys.country,
    state,
    coords,
    temperature: Math.round(main.temp),
    description: weather[0]?.description || "",
    tempMin: Math.round(main.temp_min),
    tempMax: Math.round(main.temp_max),
    windSpeed: wind.speed,
    humidity: main.humidity,
    pressure: main.pressure,
    icon: weather[0]?.icon,
  };
};

export const getCurrentLocation = async (): Promise<GeolocationPosition> => {
  if (!("geolocation" in navigator)) {
    throw new Error(ErrorsTexts.LOCATION_NOT_SUPPORTED);
  }

  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, (error) => {
      switch (error.code) {
        case error.PERMISSION_DENIED:
          reject(new Error(ErrorsTexts.LOCATION_DENIED));
          break;
        case error.POSITION_UNAVAILABLE:
          reject(new Error(ErrorsTexts.LOCATION_UNAVAILABLE));
          break;
        case error.TIMEOUT:
          reject(new Error(ErrorsTexts.LOCATION_TIMEOUT));
          break;
        default:
          reject(new Error(ErrorsTexts.LOCATION_UNKNOWN_ERROR));
          break;
      }
    });
  });
};

export const isSameCoords = (
  a: Coordinates,
  b: Coordinates,
  tolerance = 0.0001,
): boolean => {
  return (
    Math.abs(a.lat - b.lat) < tolerance && Math.abs(a.lon - b.lon) < tolerance
  );
};

export const formatLocation = (state?: string, country?: string): string => {
  return [state, country].filter(Boolean).join(", ");
};

export const formatHistoryTimestamp = (timestamp: number) => {
  const date = new Date(timestamp);

  return date.toLocaleTimeString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
};

export const isEnter = (key: string) => key === "Enter";
