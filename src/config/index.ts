import { WeatherLang, WeatherUnits } from "@/constants";

/**
 * Configuration for the Weather App
 */
export const config = {
  /**
   * Request timeout in milliseconds.
   * Determines how long the client will wait for a response before aborting.
   */
  timeout: 5000,

  /**
   * Units of measurement for temperature and other metrics.
   * Docs: https://openweathermap.org/current#data
   */
  units: WeatherUnits.METRIC,

  /**
   * Language for response descriptions.
   * Docs: https://openweathermap.org/current#multi
   */
  lang: WeatherLang.EN,

  /**
   * Maximum number of city suggestions to display in the autocomplete dropdown.
   */
  suggestionsLimit: 5,

  /**
   * Maximum number of items to keep in the search history.
   * Older entries are removed when this limit is exceeded.
   */
  searchHistoryLimit: 10,

  /**
   * Key used in localStorage to save the user's search history
   * so it persists across sessions.
   */
  searchHistoryStorageKey: "weather_search_history",

  /**
   * Interval in milliseconds to automatically refetch weather data.
   * 60000ms = 1 minute.
   */
  weatherRefetchInterval: 60000,

  backgroundImage:
    "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05",
};
