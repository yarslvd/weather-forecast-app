export interface WeatherForecast {
  city: string;
  state?: string;
  country: string;
  temperature: number;
  description: string;
  tempMin: number;
  tempMax: number;
  windSpeed: number;
  humidity: number;
  pressure: number;
  icon: string;
  coords: Coordinates;
}

export interface OpenWeatherResponse {
  coord: {
    lon: number;
    lat: number;
  };
  weather: {
    id: number;
    main: string;
    description: string;
    icon: string;
  }[];
  base: string;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
    sea_level?: number;
    grnd_level?: number;
  };
  visibility: number;
  wind: {
    speed: number;
    deg: number;
    gust?: number;
  };
  rain?: {
    "1h"?: number;
  };
  clouds: {
    all: number;
  };
  dt: number;
  sys: {
    type?: number;
    id?: number;
    country: string;
    sunrise: number;
    sunset: number;
  };
  timezone: number;
  id: number;
  name: string;
  cod: number;
}

export interface GeoCodeResponse {
  name: string;
  local_names?: Record<string, string>;
  lat: number;
  lon: number;
  country: string;
  state?: string;
}

export interface Suggestion {
  name: string;
  country: string;
  state?: string;
  lat: number;
  lon: number;
}

export interface HistoryItem {
  id: string;
  city: string;
  state?: string;
  country?: string;
  timestamp: number;
  coords: Coordinates;
}

export interface Coordinates {
  lat: number;
  lon: number;
}
