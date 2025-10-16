import { Undo2 } from "lucide-react";
import { SearchHistoryEntry } from "./components/SearchHistoryEntry";
import { ClearAllConfirmation } from "./components/ClearAllConfirmation";

import type { HistoryItem, WeatherForecast } from "@/types";

interface SearchHistoryProps {
  history: HistoryItem[];
  currentForecast: WeatherForecast | null;
  canUndo: boolean;
  selectItem: (lat: number, lon: number) => void;
  removeItem: (id: string) => void;
  undoRemove: () => void;
  clear: () => void;
}

export const SearchHistory = ({
  history,
  currentForecast,
  canUndo,
  selectItem,
  removeItem,
  undoRemove,
  clear,
}: SearchHistoryProps) => {
  const handleSelect = (lat: number, lon: number) => {
    if (
      currentForecast?.coords?.lat === lat &&
      currentForecast?.coords?.lon === lon
    ) {
      return;
    }

    selectItem(lat, lon);
  };

  return (
    <section className="bg-stone-800/40 backdrop-blur-md rounded-md max-h-full overflow-hidden flex flex-col">
      <header className="flex items-center justify-between px-4 py-2">
        <h3 className="text-stone-200 font-semibold flex items-center gap-2">
          History
        </h3>

        <div className="flex items-center gap-3">
          {canUndo && (
            <button
              onClick={undoRemove}
              className="text-stone-300 cursor-pointer"
            >
              <Undo2 size={20} />
            </button>
          )}
          {history.length > 0 && <ClearAllConfirmation onConfirm={clear} />}
        </div>
      </header>

      {history.length === 0 ? (
        <div className="flex-1 flex items-center justify-center">
          <span className="text-sm text-stone-300 text-center px-2">
            Start searching for cities to see them here
          </span>
        </div>
      ) : (
        <ul className="max-h-76 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-stone-400/50 scrollbar-track-transparent">
          {history.map((item) => (
            <SearchHistoryEntry
              key={item.id}
              item={item}
              onSelect={handleSelect}
              onRemove={removeItem}
            />
          ))}
        </ul>
      )}
    </section>
  );
};
