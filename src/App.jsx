import { useState, useEffect } from "react";
import { getForecast, getWeather } from "./utils/getWeather";
import { formatTime } from "./utils/utils";
import useLocation from "./utils/useLocation";

export default function App() {
  const location = useLocation();
  const [params, setParams] = useState({
    city: "Copenhagen",
    lang: "da",
    units: "metric"
  });

  const [search, setSearch] = useState("");

  const handleSearch = () => {
    // check if search is empty
    if (search.trim() === "") {
      return;
    }

    // hvorfor fuck virker enter ik?
    // shi jeg dum. glemte e.preventDefault() ved enter
    console.log("search", search);

    setParams({
      city: search,
      lang: "da",
      units: "metric"
    });

    setSearch("");
  };

  // Update params when location is available, keep default city if location fails
  useEffect(() => {
    if (!location.loading && !location.error && location.location.latitude && location.location.longitude) {
      // User allowed location access and we got coordinates
      setParams({
        longitude: location.location.longitude,
        latitude: location.location.latitude,
        lang: "da",
        units: "metric"
      });
    } else if (!location.loading && location.error) {
      // User denied location or error occurred, ensure we're using default city
      setParams({
        city: "Copenhagen",
        lang: "da",
        units: "metric"
      });
    }
  }, [location.loading, location.error, location.location.latitude, location.location.longitude]);

  // Use getWeather hook with current params
  const { weather, loading: weatherLoading, error: weatherError } = getWeather(params);
  const { forecast, loading: forecastLoading, error: forecastError } = getForecast(params);

  // Debug logging
  console.log('Location:', location);
  console.log('Params:', params);
  console.log('Weather:', weather);
  console.log('Weather Loading:', weatherLoading);
  console.log('Weather Error:', weatherError);
  console.log('Forecast:', forecast);
  console.log('Forecast Loading:', forecastLoading);
  console.log('Forecast Error:', forecastError);

  if (location.loading || location.error || weatherLoading || weatherError || forecastLoading || forecastError) {
    return (
      <div className="flex flex-col gap-4 min-h-screen items-center justify-center bg-slate-950 text-slate-300">
        <p>Vi prøver at hente vejret for dig. Vent venligst...</p>
        <span className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-400 border-t-transparent" aria-label="Indlæser lokation" />

        <button
          onClick={() => {
            setParams({
              city: "Copenhagen",
              lang: "da",
              units: "metric"
            });
          }}
          className="p-2 rounded-full border border-indigo-500/40 bg-indigo-500/20 px-6 text-sm font-medium text-indigo-200 transition hover:border-indigo-400 hover:text-indigo-100 focus-visible:outline-offset-2 focus-visible:outline-indigo-400"
        >
          Gå tilbage
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.12)_0%,_transparent_55%)] text-slate-100">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
        <header className="flex flex-col gap-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Vejret i {weather.name}</p>
              <h1 className="text-4xl font-semibold text-slate-100 md:text-5xl">
                {weather.name}, {weather.sys.country}
              </h1>
              <p className="text-sm text-slate-400">
                {weather.weather[0].description.charAt(0).toUpperCase() + weather.weather[0].description.slice(1)}
              </p>
            </div>
            <form aria-label="Search city" className="flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
              <label className="sr-only" htmlFor="search-city">
                Søg efter en by.
              </label>
              <input
                id="search-city"
                className="h-11 w-full rounded-full border border-slate-800 bg-slate-900/80 px-5 text-sm text-slate-200 placeholder:text-slate-500 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-400/40"
                placeholder="Søg efter en by."
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleSearch();
                  }
                }}
              />
              <button
                type="button"
                className="h-11 rounded-full border border-indigo-500/40 bg-indigo-500/20 px-6 text-sm font-medium text-indigo-200 transition hover:border-indigo-400 hover:text-indigo-100 focus-visible:outline-offset-2 focus-visible:outline-indigo-400"
                aria-label="Søg efter en by."
                onClick={handleSearch}
              >
                Søg
              </button>
            </form>
          </div>
        </header>

        <main className="grid gap-10 lg:grid-cols-[minmax(0,2fr)_minmax(260px,1fr)]">
          <section className="space-y-8">
            <article className="rounded-3xl border border-slate-800 bg-slate-900/85 px-6 py-8 shadow-[0_40px_120px_-60px_rgba(15,23,42,0.9)] sm:px-8 sm:py-10">
              <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
                <div className="space-y-6">
                  <div className="flex flex-wrap items-baseline gap-3">
                    <span className="text-5xl font-semibold tracking-tight text-slate-100 sm:text-6xl md:text-7xl lg:text-8xl">
                      {weather.main.temp.toFixed(1)}°C
                    </span>
                    <span className="text-xs uppercase tracking-[0.25em] text-slate-500 sm:text-sm">
                      {weather.weather[0].description.charAt(0).toUpperCase() + weather.weather[0].description.slice(1)}
                    </span>
                  </div>
                  <div className="space-y-3">
                    <p className="text-base text-slate-300">Føles som {weather.main.feels_like.toFixed(1)}°C</p>
                    <p className="text-sm text-slate-400">{weather.main.temp_min} - {weather.main.temp_max}</p>
                    <div className="flex flex-wrap gap-3 text-sm text-slate-400">
                      <span>Luftfugtighed {weather.main.humidity}%</span>
                      <span>Vind {weather.wind.speed} m/s</span>
                      {/* we times 1000 to get the timestamp in milliseconds */}
                      <span>Solopgang {formatTime(new Date(weather.sys.sunrise * 1000))}</span>
                      <span>Solnedgang {formatTime(new Date(weather.sys.sunset * 1000))}</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-center rounded-2xl border border-slate-800 bg-slate-950/80 px-6 py-6 text-6xl sm:px-10 sm:py-8">
                    <img
                      alt={weather.weather[0].description}
                      className="h-20 w-20 object-contain sm:h-24 sm:w-24"
                      src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}.png`}
                    />
                  </div>
                  <ul className="flex flex-col gap-3 text-sm text-slate-400 sm:gap-4">
                    <li className="flex w-full items-center rounded-2xl border border-slate-800/80 bg-slate-900/90 py-3 px-4">
                      <span className="flex-1 text-left">Føles som</span>
                      <span className="text-slate-200 text-right">{weather.main.feels_like}°C</span>
                    </li>
                    <li className="flex w-full items-center rounded-2xl border border-slate-800/80 bg-slate-900/90 py-3 px-4">
                      <span className="flex-1 text-left">Tryk</span>
                      <span className="text-slate-200 text-right">{weather.main.pressure} hPa</span>
                    </li>
                    <li className="flex w-full items-center rounded-2xl border border-slate-800/80 bg-slate-900/90 py-3  px-4">
                      <span className="flex-1 text-left">Synlighed</span>
                      <span className="text-slate-200 text-right">{(weather.visibility / 1000).toFixed(1)} km</span>
                    </li>
                  </ul>
                </div>
              </div>
            </article>

            <section aria-label="Hourly forecast" className="space-y-4">
              <header className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-100">Time for time</h2>
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Næste 8 timer.</p>
              </header>

              <div className="grid gap-3 sm:grid-cols-2">
                {forecast.list.slice(0, 8).map((item) => (
                  <div key={item.dt} className="flex flex-col items-center rounded-xl border border-slate-800 bg-slate-900/80 p-3">
                    <p className="text-xs text-slate-400">{formatTime(new Date(item.dt * 1000))}</p>
                    <img
                      src={`https://openweathermap.org/img/wn/${item.weather[0].icon}.png`}
                      alt={item.weather[0].description}
                      className="h-10 w-10 my-1"
                    />
                    <p className="text-base text-slate-200">{item.main.temp.toFixed(1)}°C</p>
                  </div>
                ))}
              </div>
            </section>

            <section aria-label="Weekly overview" className="space-y-4">
              <header className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-100">Ugentlig oversigt</h2>
                <button
                  type="button"
                  className="text-xs font-medium text-indigo-200 transition hover:text-indigo-100 focus-visible:outline-offset-2 focus-visible:outline-indigo-300"
                  aria-label="Åbn fuld forudsigelse"
                >
                  Se alle
                </button>
              </header>
            </section>
          </section>
        </main>
      </div>
    </div>
  );
}