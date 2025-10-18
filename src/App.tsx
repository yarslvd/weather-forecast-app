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
      className="min-h-[100dvh] bg-cover bg-center flex items-center justify-center relative"
      style={{
        backgroundImage: `url('${config.backgroundImage}')`,
      }}
    >
      <div
        className="
          flex flex-col md:grid md:grid-cols-[3fr_2fr] w-full 
          max-w-4xl mx-auto md:mx-2 p-4 bg-slate-600/20 backdrop-blur-md
          h-[100dvh] md:h-auto sm:min-h-[408px] overflow-hidden
          md:rounded-2xl gap-2
        "
      >
        <div className="flex flex-col gap-4 md:max-w-[500px] overflow-hidden">
          <SearchInput
            addHistoryItem={addHistoryItem}
            geoAllowed={geoAllowed}
            fetchForecastByCity={fetchForecastByCity}
            fetchForecastByCoords={fetchForecastByCoords}
            fetchCurrentLocationForecast={fetchCurrentLocationForecast}
          />

          <div className="flex-1 min-h-0 overflow-auto">
            <WeatherInfo
              weatherForecast={weather}
              loading={loading}
              error={error}
              geoAllowed={geoAllowed}
            />
          </div>
        </div>

        <div className="flex flex-col flex-1 min-h-0 overflow-hidden">
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
      </div>
      <Toaster visibleToasts={1} position="top-center" richColors={true} />
    </main>
  );
}

export default App;
