import { Trash2 } from "lucide-react";
import { formatHistoryTimestamp, formatLocation } from "@lib/utils";

import type { HistoryItem } from "@/types";

interface SearchHistoryEntryProps {
  item: HistoryItem;
  onSelect: (lat: number, lon: number) => void;
  onRemove: (id: string) => void;
}

export const SearchHistoryEntry = ({
  item,
  onSelect,
  onRemove,
}: SearchHistoryEntryProps) => {
  return (
    <li
      className="flex items-center justify-between m-1 pl-4 py-2 text-sm rounded-md text-stone-200 hover:bg-stone-800/70 transition-colors cursor-pointer"
      onClick={() => onSelect(item.coords.lat, item.coords.lon)}
    >
      <div className="flex flex-col flex-1 min-w-0">
        <span className="font-medium truncate">{item.city}</span>
        <span className="text-xs text-stone-400 truncate">
          {formatLocation(item.state, item.country)}
        </span>
      </div>

      <div className="flex items-center gap-3">
        <span className="text-[10px] text-stone-400 ml-2 whitespace-nowrap">
          {formatHistoryTimestamp(item.timestamp)}
        </span>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove(item.id);
          }}
          className="mr-3 text-stone-400 hover:text-red-500 cursor-pointer"
        >
          <Trash2 className="size-4" />
        </button>
      </div>
    </li>
  );
};
