"use client";

import React, { useState, useEffect } from 'react';
import styles from './Page.module.css'; // Make sure the path is correct

export default function Weather() {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [city, setCity] = useState('islamabad'); // Default city

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const apiKey = '4824d5536e6ca6a45fad0a3aaf0c13c9';
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setWeatherData({
          temp: data.main.temp,
          conditions: data.weather[0].description,
        });
        setLoading(false);
      } catch (error) {
        console.error('Error fetching weather data:', error);
        // setError('Failed to fetch weather data');
        setLoading(false);
      }
    };

    fetchWeather();
  }, [city]); // Fetch weather when city changes

  const handleSubmit = (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    fetchWeather();
  };

  if (loading) {
    return <p>Loading weather data...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className={styles.weatherContainer}>
      <h1>Weather API</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Enter city"
          className={styles.inputField} // Apply CSS class
        />
        <button type="submit" className={styles.submitButton}>Get Weather</button> {/* Apply CSS class */}
      </form>

      {weatherData && (
        <div>
          <p className={styles.weatherText}>Temperature: {weatherData.temp}°C</p> {/* Apply CSS class */}
          <p className={styles.weatherText}>Conditions: {weatherData.conditions}</p> {/* Apply CSS class */}
        </div>
      )}
    </div>
  );
}
