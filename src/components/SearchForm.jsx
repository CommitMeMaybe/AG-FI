import { useState, useCallback, useMemo } from 'react'
import './SearchForm.css'

const CROPS = [
  { id: 'maize', name: 'Maize', rainPreference: 'moderate', heatTolerance: 35 },
  { id: 'rice', name: 'Rice', rainPreference: 'high', heatTolerance: 32 },
  { id: 'yam', name: 'Yam', rainPreference: 'high', heatTolerance: 30 },
  { id: 'cowpea', name: 'Cowpea', rainPreference: 'low', heatTolerance: 35 },
  { id: 'cassava', name: 'Cassava', rainPreference: 'moderate', heatTolerance: 37 },
  { id: 'sorghum', name: 'Sorghum', rainPreference: 'low', heatTolerance: 40 },
]

const NIGERIAN_CITIES = [
  'Kano', 'Ibadan', 'Lagos', 'Abuja', 'Benin City', 'Port Harcourt',
  'Kaduna', 'Jos', 'Ilorin', 'Abeokuta', 'Makurdi', 'Minna', 'Bauchi',
  'Owerri', 'Gombe', 'Yola', 'Maiduguri', 'Akure', 'Katsina', 'Ado Ekiti'
]

export { CROPS, NIGERIAN_CITIES }

export default function SearchForm({ city, setCity, selectedCrop, setSelectedCrop, loading, onSubmit }) {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState(-1)

  const filteredCities = useMemo(() => {
    if (!city.trim()) return []
    const query = city.toLowerCase()
    return NIGERIAN_CITIES.filter(c => 
      c.toLowerCase().includes(query)
    ).slice(0, 6)
  }, [city])

  const shouldShowDropdown = filteredCities.length > 0 && filteredCities[0] !== city

  const selectCity = useCallback((selectedCity) => {
    setCity(selectedCity)
    setDropdownOpen(false)
    setHighlightedIndex(-1)
  }, [setCity])

  const handleInputChange = useCallback((e) => {
    setCity(e.target.value)
    setDropdownOpen(true)
    setHighlightedIndex(-1)
  }, [setCity])

  const handleInputFocus = useCallback(() => {
    if (filteredCities.length > 0) {
      setDropdownOpen(true)
    }
  }, [filteredCities.length])

  const handleKeyDown = useCallback((e) => {
    if (!dropdownOpen && e.key !== 'Escape') return
    
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setHighlightedIndex(prev => 
        prev < filteredCities.length - 1 ? prev + 1 : prev
      )
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setHighlightedIndex(prev => prev > 0 ? prev - 1 : -1)
    } else if (e.key === 'Enter' && highlightedIndex >= 0) {
      e.preventDefault()
      selectCity(filteredCities[highlightedIndex])
    } else if (e.key === 'Escape') {
      setDropdownOpen(false)
    }
  }, [dropdownOpen, filteredCities, highlightedIndex, selectCity])

  const handleItemClick = useCallback((c) => {
    selectCity(c)
  }, [selectCity])

  const handleSubmit = useCallback((e) => {
    e.preventDefault()
    if (city.trim()) {
      onSubmit(e)
    }
  }, [city, onSubmit])

  return (
    <form onSubmit={handleSubmit} className="search-form">
      <div className="input-group">
        <label className="input-label">Select Location</label>
        <div className="dropdown-container">
          <div className="input-wrapper">
            <input
              type="text"
              value={city}
              onChange={handleInputChange}
              onFocus={handleInputFocus}
              onKeyDown={handleKeyDown}
              placeholder="Search city..."
              disabled={loading}
              maxLength={50}
              autoComplete="off"
              className={`dropdown-input ${dropdownOpen && shouldShowDropdown ? 'dropdown-open' : ''}`}
            />
            <span className="dropdown-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M7 10L12 15L17 10H7Z" fill="currentColor"/>
              </svg>
            </span>
          </div>
          
          {dropdownOpen && shouldShowDropdown && (
            <ul className="dropdown-menu" role="listbox">
              {filteredCities.map((c, index) => (
                <li
                  key={c}
                  role="option"
                  aria-selected={index === highlightedIndex}
                  className={`dropdown-item ${index === highlightedIndex ? 'highlighted' : ''}`}
                  onClick={() => handleItemClick(c)}
                  onMouseEnter={() => setHighlightedIndex(index)}
                >
                  <span className="city-name">{c}</span>
                  <span className="city-country">Nigeria</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="input-group">
        <label className="input-label">Crop Type</label>
        <div className="chip-grid">
          {CROPS.map(crop => (
            <button
              key={crop.id}
              type="button"
              role="option"
              aria-selected={selectedCrop.id === crop.id}
              className={`chip ${selectedCrop.id === crop.id ? 'chip-selected' : ''}`}
              onClick={() => setSelectedCrop(crop)}
              disabled={loading}
            >
              {crop.name}
            </button>
          ))}
        </div>
      </div>

      <div className="submit-container">
        <button 
          type="submit" 
          className="submit-button"
          disabled={loading || !city.trim()}
        >
          {loading && (
            <span className="button-spinner"></span>
          )}
          <span>{loading ? 'Analyzing...' : 'Analyze Risk'}</span>
        </button>
      </div>
    </form>
  )
}
