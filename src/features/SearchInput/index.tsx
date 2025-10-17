import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@components/Input";
import { SearchSuggestions } from "./components/SearchSuggestions";
import { CurrentLocationButton } from "./components/CurrentLocationButton";
import { useCitySuggestions } from "@hooks/useCitySuggestions";
import { isEnter } from "@lib/utils";

import type { Coordinates, WeatherForecast } from "@/types";

type SearchInputProps = {
  placeholder?: string;
  geoAllowed: boolean | null;
  addHistoryItem: (
    city: string,
    country: string,
    coords: Coordinates,
    state?: string,
  ) => void;
  fetchForecastByCity: (query: string) => Promise<WeatherForecast | undefined>;
  fetchForecastByCoords: (
    lat: number,
    lon: number,
  ) => Promise<WeatherForecast | undefined>;
  fetchCurrentLocationForecast: () => Promise<void>;
};

export const SearchInput = ({
  placeholder = "Search city...",
  geoAllowed,
  addHistoryItem,
  fetchForecastByCity,
  fetchForecastByCoords,
  fetchCurrentLocationForecast,
}: SearchInputProps) => {
  const [value, setValue] = useState("");

  const {
    suggestions,
    suggestionsLoading,
    fetchSuggestions,
    clearSuggestions,
  } = useCitySuggestions();

  const handleSearchByName = async () => {
    const trimmed = value.trim();
    if (!trimmed) return;

    const data = await fetchForecastByCity(trimmed);

    if (data) {
      addHistoryItem(data.city, data.country, data.coords, data.state);
    }

    setValue("");
    clearSuggestions();
  };

  const handleSearchByCoords = async (
    lat: number,
    lon: number,
    state?: string,
  ) => {
    if (!lat || !lon) return;

    const data = await fetchForecastByCoords(lat, lon);

    if (data) {
      addHistoryItem(data.city, data.country, data.coords, state);
    }

    setValue("");
    clearSuggestions();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (isEnter(e.key)) handleSearchByName();
  };

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setValue(query);
    fetchSuggestions(e.target.value);
  };

  return (
    <div className="w-full relative">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Input
            value={value}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            maxLength={50}
          />
          <button
            onClick={handleSearchByName}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-700/50 hover:text-stone-700/30 cursor-pointer"
            aria-label="Search"
          >
            <Search />
          </button>

          <SearchSuggestions
            suggestions={suggestions}
            loading={suggestionsLoading}
            clear={clearSuggestions}
            onSelect={handleSearchByCoords}
          />
        </div>

        <CurrentLocationButton
          geoAllowed={geoAllowed}
          onClick={fetchCurrentLocationForecast}
        />
      </div>
    </div>
  );
};
