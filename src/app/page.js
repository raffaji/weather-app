"use client";

import React, { useState, useEffect } from 'react';
import styles from './Page.module.css'; // Ensure this path is correct

export default function Weather() {
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null); // For 7-day forecast
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [city, setCity] = useState('islamabad'); // Default city

  const fetchWeather = async () => {
    try {
      const apiKey = process.env.NEXT_PUBLIC_WEATHER_API_KEY; 
      
      // Fetch current weather to get coordinates (lat, lon)
      const weatherResponse = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`);
      
      if (weatherResponse.status === 404) {
        throw new Error('City not found');
      }
      if (!weatherResponse.ok) {
        throw new Error('Network response was not ok');
      }
      
      const weatherData = await weatherResponse.json();
      
      setWeatherData({
        temp: weatherData.main.temp,
        conditions: weatherData.weather[0].description,
      });

      // Fetch 7-day forecast using One Call API
      const { lat, lon } = weatherData.coord; // Extract lat, lon from current weather data

      const forecastResponse = await fetch(`https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=hourly,minutely&units=metric&appid=${apiKey}`);
      if (!forecastResponse.ok) {
        throw new Error('Network response for forecast was not ok');
      }
      
      const forecastData = await forecastResponse.json();
      setForecastData(forecastData.daily.slice(0, 7)); // Get next 7 days forecast
      
      setLoading(false);
    } 
    
    catch (error) {
      console.error('Error fetching weather data:', error);
      setError(error.message);
      setLoading(false);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (city.trim() === '') {
      setError('City name cannot be empty');
      return;
    }
    setLoading(true);
    setError(null);
    fetchWeather(); // Call fetchWeather to update data on form submission
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

      {forecastData && (
        <div>
          <h2>7-Day Forecast:</h2>
          <div className={styles.forecastContainer}>
            {forecastData.map((day, index) => (
              <div key={index} className={styles.forecastCard}>
                <p>Date: {new Date(day.dt * 1000).toLocaleDateString()}</p>
                <p>Temperature: {day.temp.day}°C</p>
                <p>Conditions: {day.weather[0].description}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}



