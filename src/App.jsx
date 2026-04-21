import { useState, useCallback } from 'react'
import Header from './components/Header'
import SearchForm, { CROPS, NIGERIAN_CITIES } from './components/SearchForm'
import RiskCard from './components/RiskCard'
import WeatherCards from './components/WeatherCards'
import FactorsCard from './components/FactorsCard'
import LoadingState from './components/LoadingState'
import ErrorCard from './components/ErrorCard'
import EmptyState from './components/EmptyState'
import Footer from './components/Footer'
import { calculateRisk, getRiskLevel } from './utils/riskCalculations'
import { validateCity, sanitizeErrorMessage, encodeURIComponentSafe } from './utils/validation'
import { apiRateLimiter } from './utils/rateLimiter'
import './App.css'

const API_KEY = '4d8fb5b93d4af21d66a2948710284366'

function App() {
  const [city, setCity] = useState('')
  const [selectedCrop, setSelectedCrop] = useState(CROPS[0])
  const [weather, setWeather] = useState(null)
  const [forecast, setForecast] = useState([])
  const [riskScore, setRiskScore] = useState(null)
  const [risk, setRisk] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchWeatherData = useCallback(async (cityValue, cropValue) => {
    console.log('=== FETCH START ===')
    console.log('cityValue:', cityValue)
    
    const rateCheck = apiRateLimiter.isAllowed()
    console.log('rateCheck:', rateCheck)
    if (!rateCheck.allowed) {
      setError('Too many requests. Please wait a moment before trying again.')
      setLoading(false)
      return
    }

    const validation = validateCity(cityValue)
    console.log('validation:', validation)
    if (!validation.valid) {
      setError(validation.error)
      setLoading(false)
      return
    }

    console.log('API_KEY:', API_KEY ? 'present' : 'MISSING!')
    if (!API_KEY) {
      setError('Service temporarily unavailable. Please try again later.')
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)
    setWeather(null)
    setForecast([])
    setRiskScore(null)
    setRisk(null)

    const encodedCity = encodeURIComponentSafe(validation.city)

    try {
      const [r1, r2] = await Promise.all([
        fetch(`https://api.openweathermap.org/data/2.5/weather?q=${encodedCity},NG&appid=${API_KEY}&units=metric`),
        fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${encodedCity},NG&appid=${API_KEY}&units=metric`)
      ])

      if (!r1.ok) {
        const errText = await r1.text()
        throw new Error(`Weather API error (${r1.status}): ${errText.slice(0, 100)}`)
      }
      if (!r2.ok) {
        const errText = await r2.text()
        throw new Error(`Forecast API error (${r2.status}): ${errText.slice(0, 100)}`)
      }

      const [current, forecastData] = await Promise.all([r1.json(), r2.json()])

      console.log('current.cod:', current.cod, typeof current.cod)
      
      if (current.cod === 404) throw new Error('City not found. Please check the spelling or select from the list.')
      if (current.cod === 401 || current.cod === 429) throw new Error('Service temporarily unavailable. Please try again later.')
      if (current.cod !== 200) throw new Error(`Unable to retrieve weather data. Got cod: ${current.cod}`)
      
      const calculatedRiskScore = calculateRisk(current, forecastData.list, cropValue)
      const riskLevel = getRiskLevel(calculatedRiskScore)
      
      setWeather(current)
      setForecast(forecastData.list)
      setRiskScore(calculatedRiskScore)
      setRisk(riskLevel)
    } catch (err) {
      setError(sanitizeErrorMessage(err.message))
    } finally {
      setLoading(false)
    }
  }, [])

  const handleSubmit = useCallback((e) => {
    e.preventDefault()
    if (city.trim()) {
      fetchWeatherData(city, selectedCrop)
    }
  }, [city, selectedCrop, fetchWeatherData])

  return (
    <div className="app">
      <Header />

      <main className="main">
        <SearchForm 
          city={city} 
          setCity={setCity}
          selectedCrop={selectedCrop}
          setSelectedCrop={setSelectedCrop}
          loading={loading}
          onSubmit={handleSubmit}
        />

        {error && <ErrorCard error={error} />}
        {loading && <LoadingState />}
        
        {weather && !loading && (
          <div className="results">
            <RiskCard weather={weather} crop={selectedCrop} riskScore={riskScore} risk={risk} />
            <WeatherCards weather={weather} forecast={forecast} />
            <FactorsCard forecast={forecast} crop={selectedCrop} weather={weather} />
          </div>
        )}

        {!weather && !loading && !error && <EmptyState />}
      </main>

      <Footer />
    </div>
  )
}

export default App