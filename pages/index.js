import { useState } from 'react';
import axios from 'axios';

export default function Home() {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [hourlyWeatherData, setHourlyWeatherData] = useState(null);
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

  async function fetchHourlyWeather() {
    try {
      const response = await axios.get(`http://localhost:8080/api/hourly_weather/${city}`);
      if (response.data.error) {
        setError(response.data.error);
        setHourlyWeatherData(null);
      } else {
        setError(null);
        setHourlyWeatherData(response.data.list);
      }
    } catch (error) {
      setError("Failed to fetch hourly weather data");
    }
  }

  function getJapaneseWeekday(date) {
    const weekdays = ['日', '月', '火', '水', '木', '金', '土'];
    return weekdays[date.getDay()];
  }

  function groupHourlyWeatherByDate(hourlyWeatherData) {
    return hourlyWeatherData.reduce((groups, forecast) => {
      const date = new Date(forecast.dt * 1000).toLocaleDateString();
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(forecast);
      return groups;
    }, {});
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
      <button onClick={fetchHourlyWeather}>Get Hourly Weather</button>
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
      {hourlyWeatherData && (
        <div>
          <h2>Hourly Weather Forecast</h2>
          {Object.entries(groupHourlyWeatherByDate(hourlyWeatherData)).map(([date, forecasts]) => (
            <div key={date}>
              <h3>
                {date} ({getJapaneseWeekday(new Date(date))})
              </h3>
              <ul>
                {forecasts.map((forecast, index) => (
                  <li key={index}>
                    {new Date(forecast.dt * 1000).toLocaleTimeString()} - {forecast.main.temp}°C - {forecast.weather[0].description}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
