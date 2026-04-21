import './FactorsCard.css'

export default function FactorsCard({ forecast, crop, weather }) {
  const factors = []
  const rainDays = forecast.filter(f => f.weather[0].main.toLowerCase().includes('rain')).length
  const avgTemp = forecast.filter((_, i) => i % 8 === 0).reduce((a, b) => a + b.main.temp, 0) / 5
  
  if (crop.rainPreference === 'high' && rainDays < 2) {
    factors.push({ icon: '💧', text: 'Low rainfall expected - risky for water-intensive crops', bad: true })
  } else if (crop.rainPreference === 'low' && rainDays > 3) {
    factors.push({ icon: '🌧', text: 'High rainfall - risky for drought-tolerant crops', bad: true })
  } else if (rainDays >= 2) {
    factors.push({ icon: '✓', text: 'Adequate rainfall expected', bad: false })
  }
  
  if (avgTemp > crop.heatTolerance) {
    factors.push({ icon: '🔥', text: `High temperatures (${Math.round(avgTemp)}°C) may stress ${crop.name}`, bad: true })
  } else {
    factors.push({ icon: '✓', text: 'Temperature conditions favorable', bad: false })
  }
  
  if (weather.main.humidity < 40) {
    factors.push({ icon: '🏜', text: 'Low humidity may affect crop development', bad: true })
  }

  return (
    <div className="factors-card">
      <h3>Risk Factors</h3>
      <ul className="factors-list">
        {factors.map((f, i) => (
          <li key={i} className={f.bad ? 'negative' : 'positive'}>
            <span className="factor-icon">{f.icon}</span>
            <span>{f.text}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}