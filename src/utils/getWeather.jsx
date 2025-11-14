import { useEffect, useState } from "react";

const BASE_URL = "https://api.openweathermap.org/data/2.5";
const API_KEY = import.meta.env.VITE_API_KEY;

/**
 * @typedef {Object} WeatherOptions - Configuration object for weather request
 * 
 * @param {string} [options.city] - City name to get weather for (alternative to coordinates)
 * @param {number} [options.longitude] - Longitude coordinate (used with latitude instead of city)
 * @param {number} [options.latitude] - Latitude coordinate (used with longitude instead of city)
 * @param {string} [options.lang="da"] - Language code for weather descriptions (default: Danish)
 * @param {string} [options.units="metric"] - Units for temperature and other measurements (metric, imperial, kelvin)
 */

/**
 * Custom React hook to fetch weather data from OpenWeatherMap API
 * 
 * @param {WeatherOptions} options - Configuration object for weather request
 * 
 * @returns {Object|null} Weather data object from the API, or null while loading
 * 
 * @example
 * // Using city name
 * const weather = getWeather({ city: "Copenhagen" });
 * 
 * @example
 * // Using coordinates with custom language and units
 * const weather = getWeather({ 
 *   longitude: 12.5683, 
 *   latitude: 55.6761, 
 *   lang: "en", 
 *   units: "imperial" 
 * });
 */
export function getWeather({ city, longitude, latitude, lang = "da", units = "metric" }) {
    const [weather, setWeather] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let url;
        
        setLoading(true);
        setError(null);
        
        // Use coordinates if both longitude and latitude are provided, otherwise use city
        if (longitude !== undefined && latitude !== undefined) {
            url = `${BASE_URL}/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=${units}&lang=${lang}`;
        } else if (city) {
            url = `${BASE_URL}/weather?q=${city}&appid=${API_KEY}&units=${units}&lang=${lang}`;
        } else {
            console.error("Either city or both longitude and latitude must be provided");
            setError("No location provided");
            setLoading(false);
            return;
        }

        console.log('Fetching weather from:', url);

        fetch(url)
        .then(response => response.json())
        .then(data => {
            console.log('Weather data:', data);
            if (data.cod === 200) {
                setWeather(data);
                setError(null);
            } else {
                setError(data.message || 'Failed to fetch weather data');
                setWeather(data); // Still set the data so we can show the error message
            }
            setLoading(false);
        })
        .catch(error => {
            console.error("Error fetching weather data:", error);
            setError(error.message);
            setWeather(null);
            setLoading(false);
        });
    }, [city, longitude, latitude, lang, units]);

    return { weather, loading, error };
}

/**
 * 
 * Custom React hook to fetch forecast data from OpenWeatherMap API
 * 
 * @param {WeatherOptions} options - Configuration object for forecast request
 * 
 * @returns {Object|null} Forecast data object from the API, or null while loading
 * 
 * @example
 * // Using city name
 * const forecast = getForecast({ city: "Copenhagen" });
 * 
 * @example
 * // Using coordinates with custom language and units
 * const forecast = getForecast({ 
 *   longitude: 12.5683, 
 *   latitude: 55.6761, 
 *   lang: "en", 
 *   units: "imperial" 
 * });
 */
export function getForecast({ city, longitude, latitude, units = "metric", lang = "da" }) {
    const [forecast, setForecast] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let url;

        setLoading(true);
        setError(null);

        if (longitude !== undefined && latitude !== undefined) {
            url = `${BASE_URL}/forecast?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=${units}&lang=${lang}`;
        } else if (city) {
            url = `${BASE_URL}/forecast?q=${city}&appid=${API_KEY}&units=${units}&lang=${lang}`;
        } else {
            console.error("Either city or both longitude and latitude must be provided for forecast");
            setError("No location provided");
            setLoading(false);
            return;
        }
        
        console.log('Fetching forecast from:', url);

        fetch(url)
        .then(response => response.json())
        .then(data => {
            console.log('Forecast data:', data);
            if (data.cod === "200" || data.cod === 200) {
                setForecast(data);
                setError(null);

                console.log('Forecast data:', data);
            } else {
                setError(data.message || 'Failed to fetch forecast data');
                setForecast(null);
            }
            setLoading(false);
        })
        .catch(error => {
            console.error("Error fetching forecast data:", error);
            setError(error.message);
            setForecast(null);
            setLoading(false);
        });
    }, [city, longitude, latitude, lang, units]);

    return { forecast, loading, error };
}