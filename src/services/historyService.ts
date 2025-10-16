import { isSameCoords } from "@lib/utils";
import { config } from "@/config";

import type { Coordinates, HistoryItem } from "@/types";

class HistoryService {
  private storageKey = config.searchHistoryStorageKey;
  private sessionKey = config.searchHistoryStorageKey + "_undo";
  private limit = config.searchHistoryLimit;

  getAll(): HistoryItem[] {
    try {
      const saved = localStorage.getItem(this.storageKey);
      return saved ? JSON.parse(saved) : [];
    } catch {
      console.error("Failed to load search history");
      return [];
    }
  }

  saveAll(history: HistoryItem[]) {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(history));
    } catch (err) {
      console.error("Failed to save search history:", err);
    }
  }

  private pushRecentlyRemoved(item: HistoryItem) {
    try {
      const saved = sessionStorage.getItem(this.sessionKey);
      const removed: HistoryItem[] = saved ? JSON.parse(saved) : [];
      sessionStorage.setItem(
        this.sessionKey,
        JSON.stringify([item, ...removed])
      );
    } catch (err) {
      console.error("Failed to save removed item:", err);
    }
  }

  private popRecentlyRemoved(): HistoryItem | null {
    try {
      const saved = sessionStorage.getItem(this.sessionKey);
      if (!saved) return null;

      const removed: HistoryItem[] = JSON.parse(saved);
      const [last, ...rest] = removed;
      sessionStorage.setItem(this.sessionKey, JSON.stringify(rest));
      return last ?? null;
    } catch {
      return null;
    }
  }

  add(
    city: string,
    country: string,
    coords: Coordinates,
    state?: string
  ): HistoryItem[] {
    const trimmed = city.trim();
    if (!trimmed) return this.getAll();

    const prev = this.getAll();
    const filtered = prev.filter((item) => !isSameCoords(item.coords, coords));

    const newItem: HistoryItem = {
      id: crypto.randomUUID(),
      city: trimmed,
      state,
      country,
      coords,
      timestamp: Date.now(),
    };

    const updated = [newItem, ...filtered].slice(0, this.limit);
    this.saveAll(updated);
    return updated;
  }

  remove(id: string): HistoryItem[] {
    const prev = this.getAll();
    const item = prev.find((i) => i.id === id);
    if (!item) return prev;

    this.pushRecentlyRemoved(item);

    const newHistory = prev.filter((i) => i.id !== id);
    this.saveAll(newHistory);
    return newHistory;
  }

  canUndo(): boolean {
    try {
      const saved = sessionStorage.getItem(this.sessionKey);
      const removed: HistoryItem[] = saved ? JSON.parse(saved) : [];
      return removed.length > 0;
    } catch {
      return false;
    }
  }

  undoRemove(): HistoryItem[] {
    const lastRemoved = this.popRecentlyRemoved();
    if (!lastRemoved) return this.getAll();

    const prev = this.getAll();

    const updated = [...prev, lastRemoved]
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, this.limit);

    this.saveAll(updated);
    return updated;
  }

  clear(): void {
    localStorage.removeItem(this.storageKey);
    sessionStorage.removeItem(this.sessionKey);
  }
}

export const historyService = new HistoryService();
