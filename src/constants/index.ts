export const WeatherUnits = {
  STANDARD: "standard", // Kelvin
  METRIC: "metric", // Celsius
  IMPERIAL: "imperial", // Fahrenheit
} as const;

export const WeatherLang = {
  UA: "ua", // Ukrainian
  EN: "en", // English
  ES: "es", // Spanish
  FR: "fr", // French
  DE: "de", // German
} as const;

export type WeatherUnits = (typeof WeatherUnits)[keyof typeof WeatherUnits];
export type WeatherLang = (typeof WeatherLang)[keyof typeof WeatherLang];
