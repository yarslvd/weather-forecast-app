import { describe, it, expect, beforeEach, vi } from "vitest";
import { historyService } from "@/services/historyService";
import type { HistoryItem } from "@/types";

vi.mock("@lib/utils", () => ({
  isSameCoords: vi.fn((a, b) => a.lat === b.lat && a.lon === b.lon),
}));

describe("SearchHistoryService", () => {
  const coords = { lat: 10, lon: 20 };

  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    vi.clearAllMocks();
  });

  describe("retrieving search history", () => {
    it("returns empty array if there are no search history items", () => {
      expect(historyService.getAll()).toEqual([]);
    });
  });

  describe("adding a new search", () => {
    it("adds a new search to history", () => {
      const result = historyService.add("Kyiv", "Ukraine", coords);
      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject({
        city: "Kyiv",
        country: "Ukraine",
        coords,
      });

      const stored = JSON.parse(
        localStorage.getItem(historyService["storageKey"])!,
      );
      expect(stored).toHaveLength(1);
    });

    it("trims city name and ignores empty strings", () => {
      const result1 = historyService.add("  ", "Country", coords);
      expect(result1).toEqual([]);

      const result2 = historyService.add("  London  ", "UK", coords);
      expect(result2[0].city).toBe("London");
    });

    it("replaces previous search with same coordinates", () => {
      historyService.add("OldCity", "OC", coords);
      const result = historyService.add("NewCity", "NC", coords);

      expect(result).toHaveLength(1);
      expect(result[0].city).toBe("NewCity");
    });

    it("respects the maximum number of search history items", () => {
      historyService["limit"] = 2;
      const coords1 = { lat: 1, lon: 1 };
      const coords2 = { lat: 2, lon: 2 };
      const coords3 = { lat: 3, lon: 3 };

      historyService.add("City1", "C1", coords1);
      historyService.add("City2", "C2", coords2);
      const result: HistoryItem[] = historyService.add("City3", "C3", coords3);

      expect(result).toHaveLength(2);
      expect(result.map((i) => i.city)).toEqual(["City3", "City2"]);
    });
  });

  describe("removing a search", () => {
    it("removes a search from history and allows undo", () => {
      const added = historyService.add("Paris", "France", coords);
      const id = added[0].id;

      const afterRemove = historyService.remove(id);
      expect(afterRemove).toHaveLength(0);

      const removed = JSON.parse(
        sessionStorage.getItem(historyService["sessionKey"])!,
      );
      expect(removed).toHaveLength(1);
      expect(removed[0].id).toBe(id);

      expect(historyService.canUndo()).toBe(true);
    });

    it("restores the last removed search with undo", () => {
      const added = historyService.add("Berlin", "Germany", coords);
      const id = added[0].id;
      historyService.remove(id);

      const restored = historyService.undoRemove();
      expect(restored).toHaveLength(1);
      expect(restored[0].id).toBe(id);

      expect(
        JSON.parse(sessionStorage.getItem(historyService["sessionKey"])!),
      ).toHaveLength(0);
    });
  });

  describe("clearing search history", () => {
    it("clears all searches and undo history", () => {
      historyService.add("Madrid", "Spain", coords);
      historyService.remove("non-existent");
      historyService.clear();

      expect(localStorage.getItem(historyService["storageKey"])).toBeNull();
      expect(sessionStorage.getItem(historyService["sessionKey"])).toBeNull();
    });
  });
});
