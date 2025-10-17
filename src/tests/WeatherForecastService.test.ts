import { describe, it, expect, beforeEach, vi } from "vitest";
import { weatherForecastService } from "@/services/weatherForecastService";
import { apiClient } from "@api/apiClient";
import { formatWeatherData } from "@lib/utils";
import { toast } from "sonner";
import { ErrorsTexts } from "@constants/errors";
import { config } from "@/config";
import type { GeoCodeResponse, WeatherForecast } from "@/types";

vi.mock("@api/apiClient", () => ({
  apiClient: {
    get: vi.fn(),
  },
}));

vi.mock("@lib/utils", () => ({
  formatWeatherData: vi.fn((data, coords, state) => ({
    temp: data.main.temp,
    lat: coords.lat,
    lon: coords.lon,
    state,
  })),
}));

vi.mock("sonner", () => ({
  toast: {
    error: vi.fn(),
  },
}));

describe("WeatherForecastService", () => {
  const city = "Kyiv";
  const coords = { lat: 50, lon: 30 };
  const state = "SomeState";

  const geoData: GeoCodeResponse[] = [
    {
      lat: coords.lat,
      lon: coords.lon,
      state,
      name: "Kyiv",
      country: "Ukraine",
    },
  ];

  const weatherData: WeatherForecast = {
    city: "Kyiv",
    country: "Ukraine",
    temperature: 25,
    description: "Sunny",
    icon: "01d",
    coords: {
      lat: coords.lat,
      lon: coords.lon,
    },
    state,
    humidity: 50,
    windSpeed: 5,
    tempMax: 25,
    tempMin: 24,
    pressure: 1000,
  };

  const mockGet = vi.spyOn(apiClient, "get");

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("searchCities", () => {
    it("returns city data from API", async () => {
      const mockData = [{ lat: coords.lat, lon: coords.lon, state }];
      mockGet.mockResolvedValue({ data: mockData });

      const result = await weatherForecastService.searchCities(city);
      expect(result).toEqual(mockData);
      expect(apiClient.get).toHaveBeenCalledWith("/geo/1.0/direct", {
        params: { q: city, limit: config.suggestionsLimit },
      });
    });

    it("handles API error and shows toast", async () => {
      const error = new Error("Network error");
      mockGet.mockRejectedValue(error);

      await expect(weatherForecastService.searchCities(city)).rejects.toThrow(
        error.message,
      );
      expect(toast.error).toHaveBeenCalledWith(error.message);
    });
  });

  describe("getWeatherByCoords", () => {
    it("returns formatted weather data from API", async () => {
      const apiResponse = { main: { temp: 20 } };
      mockGet.mockResolvedValue({ data: apiResponse });

      const result = await weatherForecastService.getWeatherByCoords({
        lat: coords.lat,
        lon: coords.lon,
        state,
      });

      expect(formatWeatherData).toHaveBeenCalledWith(
        apiResponse,
        { lat: coords.lat, lon: coords.lon },
        state,
      );
      expect(result).toEqual({
        temp: 20,
        lat: coords.lat,
        lon: coords.lon,
        state,
      });
    });

    it("handles API error and shows toast", async () => {
      const error = new Error("API failure");
      mockGet.mockRejectedValue(error);

      await expect(
        weatherForecastService.getWeatherByCoords(coords),
      ).rejects.toThrow(error.message);
      expect(toast.error).toHaveBeenCalledWith(error.message);
    });
  });

  describe("getWeatherByCity", () => {
    it("fetches weather by city", async () => {
      vi.spyOn(weatherForecastService, "searchCities").mockResolvedValue(
        geoData,
      );

      vi.spyOn(weatherForecastService, "getWeatherByCoords").mockResolvedValue(
        weatherData,
      );

      const result = await weatherForecastService.getWeatherByCity(city);
      expect(result).toEqual(weatherData);
    });

    it("throws error if city not found", async () => {
      vi.spyOn(weatherForecastService, "searchCities").mockResolvedValue([]);
      await expect(
        weatherForecastService.getWeatherByCity(city),
      ).rejects.toThrow(ErrorsTexts.CITY_NOT_FOUND(city));
      expect(toast.error).toHaveBeenCalledWith(
        ErrorsTexts.CITY_NOT_FOUND(city),
      );
    });

    it("handles getWeatherByCoords error", async () => {
      vi.spyOn(weatherForecastService, "searchCities").mockResolvedValue(
        geoData,
      );

      const apiError = new Error("Weather API failed");
      vi.spyOn(weatherForecastService, "getWeatherByCoords").mockRejectedValue(
        apiError,
      );

      await expect(
        weatherForecastService.getWeatherByCity(city),
      ).rejects.toThrow(apiError.message);
      expect(toast.error).toHaveBeenCalledWith(apiError.message);
    });
  });
});
