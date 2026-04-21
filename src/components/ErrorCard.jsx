import './ErrorCard.css'

export default function ErrorCard({ error }) {
  return (
    <div className="error-card">
      <span className="error-icon">⚠</span>
      <p>{error}</p>
    </div>
  )
}