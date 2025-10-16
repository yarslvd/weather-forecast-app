import { AxiosError } from "axios";
import { apiClient } from "@api/apiClient";
import { ErrorsTexts } from "@constants/errors";
import { formatWeatherData } from "@lib/utils";
import { config } from "@/config";

import type {
  GeoCodeResponse,
  OpenWeatherResponse,
  WeatherForecast,
} from "@/types";
import { toast } from "sonner";

class WeatherForecastService {
  async getWeatherByCity(city: string): Promise<WeatherForecast> {
    try {
      const geoData = await this.searchCities(city);

      if (!geoData || geoData.length === 0) {
        throw new Error(ErrorsTexts.CITY_NOT_FOUND(city));
      }

      const { lat, lon, state } = geoData[0];

      const weather = await this.getWeatherByCoords({ lat, lon, state });
      return { ...weather, state };
    } catch (error: unknown) {
      this.handleError(error, city);
    }
  }

  async getWeatherByCoords(params: {
    lat: number;
    lon: number;
    state?: string;
  }): Promise<WeatherForecast> {
    try {
      const { lat, lon, state } = params;

      const weatherRes = await apiClient.get<OpenWeatherResponse>(
        "/data/2.5/weather",
        {
          params: { lat, lon, units: config.units, lang: config.lang },
        }
      );

      return formatWeatherData(weatherRes.data, { lat, lon }, state);
    } catch (error: unknown) {
      this.handleError(error);
    }
  }

  async searchCities(query: string): Promise<GeoCodeResponse[]> {
    try {
      const res = await apiClient.get<GeoCodeResponse[]>("/geo/1.0/direct", {
        params: {
          q: query,
          limit: config.suggestionsLimit,
        },
      });

      return res.data;
    } catch (error: unknown) {
      this.handleError(error, query);
    }
  }

  private handleError(error: unknown, city?: string): never {
    let message: string = ErrorsTexts.GENERIC;

    if (error instanceof AxiosError) {
      if (error.response) {
        const { status, data } = error.response;

        if (status === 404 && city) {
          message = ErrorsTexts.CITY_NOT_FOUND(city);
        } else {
          message = ErrorsTexts.API_ERROR(status, data?.message);
        }
      } else if (error.request) {
        message = ErrorsTexts.NO_RESPONSE;
      } else {
        message = error.message || ErrorsTexts.GENERIC;
      }
    } else if (error instanceof Error) {
      message = error.message || ErrorsTexts.GENERIC;
    }

    toast.error(message);
    throw new Error(message);
  }
}

export const weatherForecastService = new WeatherForecastService();
