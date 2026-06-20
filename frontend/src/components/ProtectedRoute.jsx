import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ children, requiredRole }) {
  const { user, loading, role } = useAuth()

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  if (!user) {
    return <Navigate to="/login" />
  }

  if (requiredRole) {
    if (Array.isArray(requiredRole)) {
      if (!requiredRole.includes(role)) return <Navigate to="/" />
    } else {
      if (role !== requiredRole) return <Navigate to="/" />
    }
  }

  return children
}
