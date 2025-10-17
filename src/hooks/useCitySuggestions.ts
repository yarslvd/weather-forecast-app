import { useCallback, useRef, useState } from "react";
import { toast } from "sonner";
import { weatherForecastService } from "@services/weatherForecastService";
import { ErrorsTexts } from "@constants/errors";

import type { Suggestion } from "@/types";

export const useCitySuggestions = (delay = 400) => {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(false);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const activeRequestId = useRef<number>(0);

  const fetchSuggestions = useCallback(
    (query: string) => {
      if (debounceRef.current) clearTimeout(debounceRef.current);

      const trimmed = query.trim();

      if (!trimmed) {
        setSuggestions([]);
        setLoading(false);
        return;
      }

      const requestId = ++activeRequestId.current;

      debounceRef.current = setTimeout(async () => {
        setLoading(true);

        try {
          const cities = await weatherForecastService.searchCities(trimmed);
          setSuggestions(cities);
        } catch (err) {
          console.error(ErrorsTexts.CITY_SEARCH_FAILED, err);
          toast.error(ErrorsTexts.CITY_SEARCH_FAILED);
          setSuggestions([]);
        } finally {
          if (requestId === activeRequestId.current) setLoading(false);
        }
      }, delay);
    },
    [delay],
  );

  const clearSuggestions = useCallback(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    activeRequestId.current++;
    setSuggestions([]);
    setLoading(false);
  }, []);

  return {
    suggestions,
    suggestionsLoading: loading,
    fetchSuggestions,
    clearSuggestions,
  };
};
