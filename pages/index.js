import { useState } from 'react';
import axios from 'axios';

export default function Home() {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState(null);

  async function fetchWeather() {
    try {
      const response = await axios.get(`http://localhost:8080/api/weather/${city}`);
      if (response.data.error) {
        setError(response.data.error);
        setWeatherData(null);
      } else {
        setError(null);
        setWeatherData(response.data);
      }
    } catch (error) {
      setError("Failed to fetch weather data");
    }
  }

  return (
    <div>
      <h1>Weather App</h1>
      <input
        type="text"
        placeholder="Enter city name"
        value={city}
        onChange={(e) => setCity(e.target.value)}
      />
      <button onClick={fetchWeather}>Get Weather</button>
      {error && (
        <div>
          <p>Error: {error}</p>
        </div>
      )}
      {weatherData && (
        <div>
          <h2>{weatherData.name}</h2>
          <p>Temperature: {weatherData.main.temp}°C</p>
          <p>Weather: {weatherData.weather[0].description}</p>
        </div>
      )}
    </div>
  );
}
