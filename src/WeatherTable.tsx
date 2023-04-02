import { useState, ChangeEvent, MouseEvent } from "react"
import axios, { AxiosResponse } from "axios"

interface WeatherData {
  name: string
  dt: number
  main: {
    temp: number
  }
  weather: [
    {
      description: string
    }
  ]
}

interface HourlyWeatherData {
  dt: number
  main: {
    temp: number
  }
  weather: [
    {
      description: string
    }
  ]
}

export default function WeatherTable() {
  const [city, setCity] = useState<string>("")
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null)
  const [hourlyWeatherData, setHourlyWeatherData] = useState<
    HourlyWeatherData[] | null
  >(null)
  const [error, setError] = useState<string | null>(null)

  async function fetchWeather() {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/weather/${city}`
      )
      if (response.data.error) {
        setError(response.data.error)
        setWeatherData(null)
      } else {
        setError(null)
        setWeatherData(response.data)
      }
    } catch (error) {
      setError("Failed to fetch weather data")
    }
  }

  // 時間
  async function fetchHourlyWeather() {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/hourly_weather/${city}`
      )
      if (response.data.error) {
        setError(response.data.error)
        setHourlyWeatherData(null)
      } else {
        setError(null)
        setHourlyWeatherData(response.data.list)
      }
    } catch (error) {
      setError("Failed to fetch hourly weather data")
    }
  }

  // 曜日
  function getJapaneseWeekday(date: Date): string {
    const weekdays = ["日", "月", "火", "水", "木", "金", "土"]
    return weekdays[date.getDay()]
  }
  // 日付
  function groupHourlyWeatherByDate(hourlyWeatherData: HourlyWeatherData[]) {
    return hourlyWeatherData.reduce((groups, forecast) => {
      const date = new Date(forecast.dt * 1000).toLocaleDateString()
      if (!groups[date]) {
        groups[date] = []
      }
      groups[date].push(forecast)
      return groups
    }, {})
  }

  // 現在
  function isTimeCloseToNow(time: Date, minutesThreshold = 30): boolean {
    const now = new Date()
    const timeDifference = Math.abs(now.getTime() - time.getTime())
    return timeDifference <= minutesThreshold * 60 * 1000
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
          <p>温度: {weatherData.main.temp}°C</p>
          <p>天気: {weatherData.weather[0].description}</p>
        </div>
      )}
      {hourlyWeatherData && (
        <div>
          <h2>Hourly Weather Forecast</h2>
          {Object.entries(groupHourlyWeatherByDate(hourlyWeatherData)).map(
            ([date, forecasts]) => (
              <div key={date}>
                <h3>
                  {date} ({getJapaneseWeekday(new Date(date))})
                </h3>
                <ul>
                  {forecasts.map((forecast, index) => (
                    <li
                      key={index}
                      style={{
                        color: isTimeCloseToNow(new Date(forecast.dt * 1000))
                          ? "red"
                          : "inherit",
                      }}
                    >
                      {new Date(forecast.dt * 1000).toLocaleTimeString()} -{" "}
                      {forecast.main.temp}°C - {forecast.weather[0].description}
                    </li>
                  ))}
                </ul>
              </div>
            )
          )}
        </div>
      )}
    </div>
  )
}
