import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { WeatherInfo } from "@features/WeatherInfo";
import type { WeatherForecast } from "@/types";

vi.mock("@lib/utils", () => ({
  getWeatherIconUrl: vi.fn((icon: string) => `/icons/${icon}.png`),
}));

vi.mock("@/features/WeatherInfo/components/LocationAccessDenied", () => ({
  LocationAccessDenied: () => <div>Location Denied</div>,
}));

vi.mock("@/features/WeatherInfo/components/ErrorScreen", () => ({
  ErrorScreen: (props: { error?: string; isApiKeyMissing?: boolean }) => (
    <div>Error: {props.error || ""}</div>
  ),
}));

vi.mock("@components/ui/skeleton", () => ({
  Skeleton: ({ className }: { className?: string }) => (
    <div className={className} data-testid="skeleton" />
  ),
}));

const defaultWeather: WeatherForecast = {
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
  coords: {
    lat: 1,
    lon: 1,
  },
};

describe("WeatherInfo", () => {
  beforeEach(() => {
    vi.stubEnv("VITE_OPENWEATHER_API_KEY", "dummy_key");
  });

  it("renders loading skeletons when loading", () => {
    render(
      <WeatherInfo
        weatherForecast={null}
        loading={true}
        error={null}
        geoAllowed={true}
      />,
    );

    // Should render at least some skeletons
    expect(screen.getAllByTestId("skeleton").length).toBeGreaterThan(0);
  });

  it("renders LocationAccessDenied if location is denied", () => {
    render(
      <WeatherInfo
        weatherForecast={null}
        loading={false}
        error={null}
        geoAllowed={false}
      />,
    );

    expect(screen.getByText("Location Denied")).toBeInTheDocument();
  });

  it("renders ErrorScreen if there is an error", () => {
    render(
      <WeatherInfo
        weatherForecast={null}
        loading={false}
        error="Some error"
        geoAllowed={true}
      />,
    );

    expect(screen.getByText("Error: Some error")).toBeInTheDocument();
  });

  it("renders ErrorScreen if API key is missing", () => {
    vi.stubEnv("VITE_OPENWEATHER_API_KEY", "");

    render(
      <WeatherInfo
        weatherForecast={null}
        loading={false}
        error={null}
        geoAllowed={true}
      />,
    );

    expect(screen.getByText(/^Error:/)).toBeInTheDocument();
  });

  it("renders weather info correctly", () => {
    render(
      <WeatherInfo
        weatherForecast={defaultWeather}
        loading={false}
        error={null}
        geoAllowed={true}
      />,
    );

    expect(screen.getByText("Kyiv, Ukraine")).toBeInTheDocument();
    expect(screen.getByText("Sunny")).toBeInTheDocument();
    expect(screen.getByText("20°")).toBeInTheDocument();

    const img = screen.getByRole("img") as HTMLImageElement;
    expect(img).toHaveAttribute("src", `/icons/${defaultWeather.icon}.png`);

    expect(screen.getByText("5 m/s")).toBeInTheDocument();
    expect(screen.getByText("50%")).toBeInTheDocument();
    expect(screen.getByText("1012 hPa")).toBeInTheDocument();
  });
});
