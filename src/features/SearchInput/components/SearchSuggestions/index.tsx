import { useCallback } from "react";
import { isEnter } from "@lib/utils";

import type { Suggestion } from "@/types";

interface SearchSuggestionsProps {
  suggestions: Suggestion[];
  loading: boolean;
  onSelect?: (lat: number, lon: number, state?: string) => void;
  clear: () => void;
}

interface SuggestionEntryProps
  extends Pick<SearchSuggestionsProps, "onSelect" | "clear"> {
  suggestion: Suggestion;
}

const SuggestionEntry = ({
  suggestion,
  onSelect,
  clear,
}: SuggestionEntryProps) => {
  const handleSelect = useCallback(() => {
    const { lat, lon } = suggestion;
    onSelect?.(lat, lon, suggestion.state);
    clear();
  }, [suggestion, onSelect, clear]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLLIElement>) => {
      if (isEnter(e.key)) {
        e.preventDefault();
        handleSelect();
      }
    },
    [handleSelect]
  );

  return (
    <li
      role="option"
      tabIndex={0}
      onClick={handleSelect}
      onKeyDown={handleKeyDown}
      className="px-3 py-2 cursor-pointer text-stone-700 text-sm flex gap-1 hover:bg-stone-200 focus:bg-stone-200 focus:outline-none"
    >
      <div>
        <span className="font-medium">{suggestion.name}</span>
        {suggestion.state && (
          <span className="text-stone-500">, {suggestion.state}</span>
        )}
        <span className="text-stone-400"> ({suggestion.country})</span>
      </div>
    </li>
  );
};

export const SearchSuggestions = ({
  suggestions,
  loading,
  onSelect,
  clear,
}: SearchSuggestionsProps) => {
  if (loading || suggestions.length === 0) return null;

  return (
    <div
      role="listbox"
      className="absolute top-full left-0 mt-1 w-full rounded-lg bg-white shadow-lg border border-stone-200 overflow-hidden z-10"
    >
      <ul className="max-h-60 overflow-y-auto">
        {suggestions.map((s, i) => (
          <SuggestionEntry
            key={`${s.name}-${s.state ?? ""}-${s.country}-${i}`}
            suggestion={s}
            onSelect={onSelect}
            clear={clear}
          />
        ))}
      </ul>
    </div>
  );
};
