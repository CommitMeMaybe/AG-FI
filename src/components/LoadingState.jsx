import './LoadingState.css'

export default function LoadingState() {
  return (
    <div className="loading-grid">
      <div className="skeleton-card"></div>
      <div className="skeleton-card"></div>
      <div className="skeleton-card wide"></div>
    </div>
  )
}