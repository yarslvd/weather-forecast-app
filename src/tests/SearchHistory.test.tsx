import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { SearchHistory } from "@features/SearchHistory";
import type { HistoryItem, WeatherForecast } from "@/types";

vi.mock("@/features/SearchHistory/components/SearchHistoryEntry", () => ({
  SearchHistoryEntry: ({
    item,
    onSelect,
    onRemove,
  }: {
    item: HistoryItem;
    onSelect: (lat: number, lon: number) => void;
    onRemove: (id: string) => void;
  }) => (
    <div data-testid={`history-entry-${item.id}`}>
      <span>{item.city}</span>
      <button onClick={() => onSelect(item.coords.lat, item.coords.lon)}>
        Select
      </button>
      <button onClick={() => onRemove(item.id)}>Remove</button>
    </div>
  ),
}));

vi.mock("@/features/SearchHistory/components/ClearAllConfirmation", () => ({
  ClearAllConfirmation: ({ onConfirm }: { onConfirm: () => void }) => (
    <button data-testid="clear-all" onClick={onConfirm}>
      Clear All
    </button>
  ),
}));

const sampleHistory: HistoryItem[] = [
  {
    id: "1",
    city: "Kyiv",
    country: "Ukraine",
    state: "SomeState",
    coords: { lat: 50, lon: 30 },
    timestamp: Date.now(),
  },
  {
    id: "2",
    city: "London",
    country: "UK",
    state: "SomeState",
    coords: { lat: 51, lon: -0.1 },
    timestamp: Date.now(),
  },
];

const currentForecast: WeatherForecast = {
  city: "Kyiv",
  country: "Ukraine",
  state: "SomeState",
  temperature: 20,
  tempMin: 15,
  tempMax: 25,
  windSpeed: 5,
  humidity: 50,
  pressure: 1012,
  icon: "01d",
  description: "Sunny",
  coords: { lat: 50, lon: 30 },
};

describe("SearchHistory", () => {
  let selectItem: ReturnType<typeof vi.fn>;
  let removeItem: ReturnType<typeof vi.fn>;
  let undoRemove: ReturnType<typeof vi.fn>;
  let clear: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    selectItem = vi.fn();
    removeItem = vi.fn();
    undoRemove = vi.fn();
    clear = vi.fn();
  });

  it("renders empty state when no history", () => {
    render(
      <SearchHistory
        history={[]}
        currentForecast={null}
        canUndo={false}
        selectItem={selectItem}
        removeItem={removeItem}
        undoRemove={undoRemove}
        clear={clear}
      />,
    );

    expect(
      screen.getByText("Start searching for cities to see them here"),
    ).toBeInTheDocument();
  });

  it("renders history items and ClearAllConfirmation", () => {
    render(
      <SearchHistory
        history={sampleHistory}
        currentForecast={null}
        canUndo={true}
        selectItem={selectItem}
        removeItem={removeItem}
        undoRemove={undoRemove}
        clear={clear}
      />,
    );

    const entries = sampleHistory.map((item) =>
      screen.getByTestId(`history-entry-${item.id}`),
    );
    expect(entries).toHaveLength(2);

    expect(screen.getByTestId("clear-all")).toBeInTheDocument();
  });

  it("calls undoRemove when undo button clicked", () => {
    render(
      <SearchHistory
        history={sampleHistory}
        currentForecast={null}
        canUndo={true}
        selectItem={selectItem}
        removeItem={removeItem}
        undoRemove={undoRemove}
        clear={clear}
      />,
    );

    fireEvent.click(screen.getAllByRole("button")[0]);
    expect(undoRemove).toHaveBeenCalled();
  });

  it("calls clear when ClearAllConfirmation clicked", () => {
    render(
      <SearchHistory
        history={sampleHistory}
        currentForecast={null}
        canUndo={false}
        selectItem={selectItem}
        removeItem={removeItem}
        undoRemove={undoRemove}
        clear={clear}
      />,
    );

    fireEvent.click(screen.getByTestId("clear-all"));
    expect(clear).toHaveBeenCalled();
  });

  it("selectItem is called only for different coordinates", () => {
    render(
      <SearchHistory
        history={sampleHistory}
        currentForecast={currentForecast}
        canUndo={false}
        selectItem={selectItem}
        removeItem={removeItem}
        undoRemove={undoRemove}
        clear={clear}
      />,
    );

    const selectButtons = screen.getAllByText("Select");
    fireEvent.click(selectButtons[0]); // same coords, should not call
    fireEvent.click(selectButtons[1]); // different coords, should call

    expect(selectItem).toHaveBeenCalledTimes(1);
    expect(selectItem).toHaveBeenCalledWith(
      sampleHistory[1].coords.lat,
      sampleHistory[1].coords.lon,
    );
  });

  it("calls removeItem when Remove button clicked", () => {
    render(
      <SearchHistory
        history={sampleHistory}
        currentForecast={null}
        canUndo={false}
        selectItem={selectItem}
        removeItem={removeItem}
        undoRemove={undoRemove}
        clear={clear}
      />,
    );

    const removeButtons = screen.getAllByText("Remove");
    fireEvent.click(removeButtons[0]);
    expect(removeItem).toHaveBeenCalledWith(sampleHistory[0].id);
  });
});
