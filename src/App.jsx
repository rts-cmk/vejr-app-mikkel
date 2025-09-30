import { useState, useEffect } from "react";
import { getWeather } from "./utils/getWeather";
import { formatTime } from "./utils/utils";
import useLocation from "./utils/useLocation";

export default function App() {
  const location = useLocation();
  const [params, setParams] = useState({
    city: "Copenhagen",
    lang: "da",
    units: "metric"
  });

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

  // Debug logging
  console.log('Location:', location);
  console.log('Params:', params);
  console.log('Weather:', weather);
  console.log('Weather Loading:', weatherLoading);
  console.log('Weather Error:', weatherError);

  if (location.loading) {
    return <div className="loading">Getting your location...</div>;
  }

  if (weatherLoading) {
    return <div className="loading">Getting your weather...</div>;
  }

  // If location error (like user denied), we continue with default city
  // No need to show error, just use Copenhagen as fallback

  return (
    <div className="min-h-screen bg-slate-950 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.12)_0%,_transparent_55%)] text-slate-100">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-6 py-12">
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
                Search city
              </label>
              <input
                id="search-city"
                className="h-11 w-full rounded-full border border-slate-800 bg-slate-900/80 px-5 text-sm text-slate-200 placeholder:text-slate-500 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-400/40"
                placeholder="Search cities and moods"
                type="search"
              />
              <button
                type="button"
                className="h-11 rounded-full border border-indigo-500/40 bg-indigo-500/20 px-6 text-sm font-medium text-indigo-200 transition hover:border-indigo-400 hover:text-indigo-100 focus-visible:outline-offset-2 focus-visible:outline-indigo-400"
                aria-label="Trigger search"
              >
                Explore
              </button>
            </form>
          </div>
        </header>

        <main className="grid gap-10 lg:grid-cols-[minmax(0,2fr)_minmax(260px,1fr)]">
          <section className="space-y-8">
            <article className="rounded-3xl border border-slate-800 bg-slate-900/85 px-8 py-10 shadow-[0_40px_120px_-60px_rgba(15,23,42,0.9)]">
              <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
                <div className="space-y-6">
                  <div className="flex items-baseline gap-3">
                    <span className="text-7xl font-semibold tracking-tight text-slate-100 lg:text-8xl">
                      {weather.main.temp.toFixed(1)}°C
                    </span>
                    <span className="text-sm uppercase tracking-[0.25em] text-slate-500">
                      {weather.weather[0].description.charAt(0).toUpperCase() + weather.weather[0].description.slice(1)}
                    </span>
                  </div>
                  <div className="space-y-3">
                    <p className="text-base text-slate-300">Feels like {weather.main.feels_like.toFixed(1)}°C</p>
                    <p className="text-sm text-slate-400">{weather.main.temp_min} - {weather.main.temp_max}</p>
                    <div className="flex flex-wrap gap-3 text-sm text-slate-400">
                      <span>Humidity {weather.main.humidity}%</span>
                      <span>Wind {weather.wind.speed} m/s</span>
                      <span>Sunrise {formatTime(new Date(weather.sys.sunrise * 1000))}</span>
                      <span>Sunset {formatTime(new Date(weather.sys.sunset * 1000))}</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-center rounded-2xl border border-slate-800 bg-slate-950/80 px-10 py-8 text-6xl">
                    <img
                      src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}.png`} alt={weather.weather[0].description} />
                  </div>
                  <ul className="grid gap-4 text-sm text-slate-400">
                    <li className="flex items-center rounded-2xl border border-slate-800/80 bg-slate-900/90 px-8 py-3">
                      <span className="mr-12">Feels like</span>
                      <span className="ml-auto text-slate-200">{weather.main.feels_like}°C</span>
                    </li>
                    <li className="flex items-center rounded-2xl border border-slate-800/80 bg-slate-900/90 px-8 py-3">
                      <span className="mr-12">Pressure</span>
                      <span className="ml-auto text-slate-200">{weather.main.pressure} hPa</span>
                    </li>
                    <li className="flex items-center rounded-2xl border border-slate-800/80 bg-slate-900/90 px-8 py-3">
                      <span className="mr-12">Visibility</span>
                      <span className="ml-auto text-slate-200">{(weather.visibility / 1000).toFixed(1)} km</span>
                    </li>
                  </ul>
                </div>
              </div>
            </article>

            <section aria-label="Hourly forecast" className="space-y-4">
              <header className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-100">Hourly pulse</h2>
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Next 8 hours</p>
              </header>
            </section>

            <section aria-label="Weekly overview" className="space-y-4">
              <header className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-100">Seven-day rhythm</h2>
                <button
                  type="button"
                  className="text-xs font-medium text-indigo-200 transition hover:text-indigo-100 focus-visible:outline-offset-2 focus-visible:outline-indigo-300"
                  aria-label="Open full forecast"
                >
                  View all
                </button>
              </header>
            </section>
          </section>
        </main>
      </div>
    </div>
  );
}