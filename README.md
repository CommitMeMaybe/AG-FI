# AG-FI: Agricultural Finance Risk Assessment

A fintech web application that helps lenders evaluate agricultural loan risks based on weather conditions and crop suitability in Nigeria.

## Overview

AG-FI (Agricultural Finance) provides instant risk assessments for agricultural lending decisions. By analyzing weather forecasts and matching them against crop requirements, lenders can make informed decisions about loan approvals, amounts, and timing.

## Features

- **Location-based Analysis**: Select from 20 major Nigerian cities
- **Crop-Specific Risk Assessment**: Supports Maize, Rice, Yam, Cowpea, Cassava, and Sorghum
- **Weather Integration**: Real-time weather data and 7-day forecasts via OpenWeatherMap API
- **Risk Scoring**: Calculates risk scores based on:
  - Rainfall patterns and crop water requirements
  - Temperature stress indicators
  - Humidity levels
  - Heat tolerance thresholds
- **Instant Results**: Get risk assessments in seconds

## Risk Levels

| Score | Risk Level | Recommendation |
|-------|------------|----------------|
| 70-100 | Low Risk | Safe to lend |
| 45-69 | Moderate Risk | Consider reducing loan amount |
| 0-44 | High Risk | Defer loan decision |

## Tech Stack

- **Frontend**: React 19 + Vite
- **Styling**: Material Design 3 (Google Design System)
- **API**: OpenWeatherMap
- **Security**: Input validation, rate limiting, CSP headers

## Getting Started

### Prerequisites

- Node.js 18+
- OpenWeatherMap API key (free tier available)

### Installation

```bash
# Clone the repository
cd ag-fi

# Install dependencies
npm install

# Create environment file
cp .env.example .env
```

### Configuration

Add your OpenWeatherMap API key to `.env`:

```env
VITE_API_KEY=your_api_key_here
```

Get a free API key at: https://openweathermap.org/api

### Development

```bash
npm run dev
```

### Production Build

```bash
npm run build
npm run preview
```

## Security

This application implements several security best practices:

- **Environment Variables**: API keys stored in environment variables, not in source code
- **Input Validation**: All user input is validated against an allowlist
- **Rate Limiting**: Client-side rate limiting (10 requests/minute)
- **Content Security Policy**: Strict CSP headers configured
- **Security Headers**: X-Frame-Options, X-Content-Type-Options, Referrer-Policy

## Project Structure

```
src/
├── components/
│   ├── SearchForm.jsx      # Location & crop selection
│   ├── RiskCard.jsx       # Risk score display
│   ├── WeatherCards.jsx   # Weather information
│   └── FactorsCard.jsx    # Risk factors breakdown
├── utils/
│   ├── riskCalculations.js # Risk scoring algorithms
│   ├── validation.js       # Input sanitization
│   └── rateLimiter.js      # Rate limiting
├── App.jsx                 # Main application
└── main.jsx               # Entry point
```

## Risk Calculation Methodology

The risk score starts at 50 and is adjusted based on:

1. **Rainfall Assessment**
   - High-rainfall crops (Rice, Yam): +8 points per rainy day, -15 if < 2 rainy days
   - Moderate-rainfall crops (Maize, Cassava): +5 points per rainy day
   - Low-rainfall crops (Cowpea, Sorghum): -10 points per rainy day, -10 if > 3 rainy days

2. **Temperature Factors**
   - -5 points per degree above crop's heat tolerance
   - -5 points if average temperature < 20°C
   - -15 points if maximum temperature > 42°C

3. **Humidity Factors**
   - -10 points if humidity < 40%
   - -5 points if humidity > 85%

## License

MIT

## Disclaimer

This tool is for demonstration purposes only. Real agricultural lending decisions should incorporate additional factors including soil analysis, farmer credit history, market prices, and regional agricultural expertise.
