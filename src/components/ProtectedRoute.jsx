import { Navigate } from 'react-router-dom'
import { useAuth } from "/src/context/AuthContext"

export default function ProtectedRoute({ children, adminOnly = false }) {
  const { currentUser, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'var(--font-mono)',
        color: 'var(--accent)',
        letterSpacing: '0.1em',
        fontSize: '0.9rem',
      }}>
        <span>INITIALIZING STOCKMIND</span>
        <span style={{ animation: 'blink 1s infinite', marginLeft: '4px' }}>_</span>
      </div>
    )
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />
  }

  if (adminOnly && currentUser.role !== 'Admin') {
    return <Navigate to="/dashboard" replace />
  }

  return children
}
