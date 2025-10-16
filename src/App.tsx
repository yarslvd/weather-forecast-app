import { Toaster } from "sonner";
import { WeatherInfo } from "@features/WeatherInfo";
import { SearchInput } from "@features/SearchInput";
import { SearchHistory } from "@features/SearchHistory";
import { useWeatherForecast } from "@hooks/useWeatherForecast";
import { useSearchHistory } from "@hooks/useSearchHistory";
import { config } from "@/config";

function App() {
  const {
    weather,
    error,
    loading,
    geoAllowed,
    fetchForecastByCity,
    fetchForecastByCoords,
    fetchCurrentLocationForecast,
  } = useWeatherForecast();

  const {
    history,
    canUndo,
    addHistoryItem,
    removeHistoryItem,
    undoRemove,
    clearHistory,
  } = useSearchHistory();

  return (
    <main
      className="min-h-screen bg-cover bg-center flex items-center justify-center"
      style={{
        backgroundImage: `url('${config.backgroundImage}')`,
      }}
    >
      <div
        className="
          w-full max-w-4xl m-2 p-6 rounded-2xl bg-slate-600/20 backdrop-blur-md 
          min-h-[408px] flex flex-col gap-4 md:grid md:grid-cols-[3fr_2fr]
        "
      >
        <div className="flex flex-col gap-8 h-full justify-between sm:max-w-[500px]">
          <SearchInput
            addHistoryItem={addHistoryItem}
            geoAllowed={geoAllowed}
            fetchForecastByCity={fetchForecastByCity}
            fetchForecastByCoords={fetchForecastByCoords}
            fetchCurrentLocationForecast={fetchCurrentLocationForecast}
          />
          <WeatherInfo
            weatherForecast={weather}
            loading={loading}
            error={error}
            geoAllowed={geoAllowed}
          />
        </div>

        <SearchHistory
          history={history}
          currentForecast={weather}
          canUndo={canUndo}
          selectItem={fetchForecastByCoords}
          removeItem={removeHistoryItem}
          undoRemove={undoRemove}
          clear={clearHistory}
        />
      </div>
      <Toaster visibleToasts={1} position="top-center" richColors={true} />
    </main>
  );
}

export default App;
