import './WeatherCards.css'

export default function WeatherCards({ weather, forecast }) {
  return (
    <div className="weather-cards">
      <div className="weather-card current">
        <h3>Current Weather</h3>
        <div className="weather-main">
          <span className="temp">{Math.round(weather.main.temp)}°C</span>
          <span className="desc">{weather.weather[0].description}</span>
        </div>
        <div className="weather-details">
          <div><span>💧</span> {weather.main.humidity}%</div>
          <div><span>🌬</span> {Math.round(weather.wind.speed)} m/s</div>
        </div>
      </div>

      <div className="weather-card forecast">
        <h3>7-Day Outlook</h3>
        <div className="forecast-grid">
          {forecast.filter((_, i) => i % 8 === 0).slice(0, 5).map((day, i) => (
            <div key={i} className="forecast-day">
              <span className="day-name">{new Date(day.dt * 1000).toLocaleDateString('en-GB', { weekday: 'short' })}</span>
              <span className="day-temp">{Math.round(day.main.temp)}°</span>
              <span className="day-desc">{day.weather[0].main}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}