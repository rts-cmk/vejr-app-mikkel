import { useState, useEffect } from "react";
import { getWeather } from "./utils/getWeather";
import useLocation from "./utils/useLocation";
import { formatDate } from "./utils/utils";

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

  // If location error (like user denied), we continue with default city
  // No need to show error, just use Copenhagen as fallback

  return (
    <main className="container">
      <div className="weather-card">
        {weatherLoading ? (
          <div className="loading">Loading weather...</div>
        ) : weatherError ? (
          <div className="error">
            Failed to load weather data: {weatherError}
            <br />
            <small>Please check your API key configuration</small>
          </div>
        ) : !weather ? (
          <div className="loading">No weather data available</div>
        ) : weather.cod && weather.cod !== 200 ? (
          <div className="error">
            Failed to load weather data: {weather.message || 'Unknown error'}
            <br />
            <small>Please check your API key configuration</small>
          </div>
        ) : (
        <>
        <header className="weather-header">
          <h1 className="weather-city">
            {weather.name}
          </h1>
        </header>

        <section className="weather-temperature">
          {Math.round(weather.main.temp)}°
        </section>

        <div className="weather-icon-container">
          <img
            className="weather-icon"
            src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
            alt={`Weather icon: ${weather.weather[0].description}`}
            tabIndex={0}
          />
        </div>

        <div className="weather-description">
          <span className="weather-description-title">
            {weather.weather[0].main}
          </span>
          <span className="weather-description-temperature">
            H: {Math.round(weather.main.temp_max)}°  L: {Math.round(weather.main.temp_min)}°
          </span>
        </div>
        </>
        )}

      </div>
    </>
  );
}