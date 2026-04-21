import './RiskCard.css'

export default function RiskCard({ weather, crop, riskScore, risk }) {
  return (
    <div className="risk-card">
      <div className="risk-header">
        <span className="location-badge">{weather.name}, Nigeria</span>
        <span className="crop-badge">{crop.name}</span>
      </div>
      <div 
        className="risk-score-display"
        style={{ '--risk-bg': risk.bg, '--risk-color': risk.color }}
      >
        <div className="score-circle">
          <span className="score-number">{riskScore}</span>
          <span className="score-label">Risk Score</span>
        </div>
        <div className="risk-info">
          <h2 className={`risk-level risk-level--${risk.scoreType}`}>{risk.level}</h2>
          <p>{risk.text}</p>
        </div>
      </div>
    </div>
  )
}