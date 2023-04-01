import { useState, useEffect } from 'react';
import axios from 'axios';

export default function WeatherTable() {
  const [weatherData, setWeatherData] = useState([]);

  // useEffect(() => {
  //   axios.get('http://localhost:5000/api/weather')
  //     .then((response) => setWeatherData([response.data]));
  // }, []);

  async function fetchWeather() {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
    const response = await axios.get(`${apiUrl}/api/weather/${city}`);
    setWeatherData(response.data);
  }


  return (
    <table>
      <thead>
        <tr>
          <th>City</th>
          <th>Weather</th>
          <th>Temp</th>
          <th>Humidity</th>
        </tr>
      </thead>
      <tbody>
        {weatherData.map((data) => (
          <tr key={data.city}>
            <td>{data.city}</td>
            <td>{data.weather}</td>
            <td>{data.temp}</td>
            <td>{data.humidity}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
