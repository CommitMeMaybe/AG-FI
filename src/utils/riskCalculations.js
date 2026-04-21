export function calculateRisk(current, forecastData, crop) {
  const temps = forecastData.filter((_, i) => i % 8 === 0).map(f => f.main.temp)
  const avgTemp = temps.length ? temps.reduce((a, b) => a + b, 0) / temps.length : current.main.temp
  const humidity = current.main.humidity
  const rainDays = forecastData.filter(f => f.weather[0].main.toLowerCase().includes('rain')).length
  const maxTemp = Math.max(...temps, current.main.temp)
  
  let score = 50
  
  const rainPref = crop.rainPreference
  if (rainPref === 'high') {
    score += rainDays * 8
    if (rainDays < 2) score -= 15
  } else if (rainPref === 'moderate') {
    score += rainDays * 5
    if (rainDays < 1) score -= 10
  } else {
    score -= rainDays * 10
    if (rainDays > 3) score -= 10
  }
  
  if (avgTemp > crop.heatTolerance) score -= (avgTemp - crop.heatTolerance) * 5
  if (avgTemp < 20) score -= 5
  
  if (humidity < 40) score -= 10
  if (humidity > 85) score -= 5
  
  if (maxTemp > 42) score -= 15
  
  return Math.max(0, Math.min(100, Math.round(score)))
}

export function getRiskLevel(score) {
  if (score >= 70) {
    return { 
      level: 'Low Risk', 
      scoreType: 'low',
      color: '#166534', 
      bg: '#dcfce7', 
      text: 'Safe to lend' 
    }
  }
  if (score >= 45) {
    return { 
      level: 'Moderate Risk', 
      scoreType: 'moderate',
      color: '#a16207', 
      bg: '#fef9c3', 
      text: 'Consider reducing loan amount' 
    }
  }
  return { 
    level: 'High Risk', 
    scoreType: 'high',
    color: '#dc2626', 
    bg: '#fee2e2', 
    text: 'Defer loan decision' 
  }
}