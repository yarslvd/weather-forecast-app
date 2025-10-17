import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { historyService } from "@services/HistoryService";
import { ErrorsTexts } from "@constants/errors";

import type { Coordinates, HistoryItem } from "@/types";

export const useSearchHistory = () => {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [canUndo, setCanUndo] = useState(false);

  useEffect(() => {
    try {
      setHistory(historyService.getAll());
      setCanUndo(historyService.canUndo());
    } catch (err) {
      console.error(ErrorsTexts.HISTORY_LOAD_FAILED, err);
      toast.error(ErrorsTexts.HISTORY_LOAD_FAILED);
    }
  }, []);

  const addHistoryItem = useCallback(
    (city: string, country: string, coords: Coordinates, state?: string) => {
      try {
        const updated = historyService.add(city, country, coords, state);
        setHistory(updated);
        setCanUndo(historyService.canUndo());
      } catch (err) {
        console.error(ErrorsTexts.HISTORY_ADD_FAILED, err);
        toast.error(ErrorsTexts.HISTORY_ADD_FAILED);
      }
    },
    []
  );

  const removeHistoryItem = useCallback((id: string) => {
    try {
      const updated = historyService.remove(id);
      setHistory(updated);
      setCanUndo(historyService.canUndo());
    } catch (err) {
      console.error(ErrorsTexts.HISTORY_REMOVE_FAILED, err);
      toast.error(ErrorsTexts.HISTORY_REMOVE_FAILED);
    }
  }, []);

  const undoRemove = useCallback(() => {
    try {
      const updated = historyService.undoRemove();
      setHistory(updated);
      setCanUndo(historyService.canUndo());
    } catch (err) {
      console.error(ErrorsTexts.HISTORY_UNDO_FAILED, err);
      toast.error(ErrorsTexts.HISTORY_UNDO_FAILED);
    }
  }, []);

  const clearHistory = useCallback(() => {
    try {
      historyService.clear();
      setHistory([]);
      setCanUndo(false);
    } catch (err) {
      console.error(ErrorsTexts.HISTORY_CLEAR_FAILED, err);
      toast.error(ErrorsTexts.HISTORY_CLEAR_FAILED);
    }
  }, []);

  return {
    history,
    canUndo,
    addHistoryItem,
    removeHistoryItem,
    undoRemove,
    clearHistory,
  };
};
