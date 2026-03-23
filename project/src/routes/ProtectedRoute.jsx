import { Navigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

function ProtectedRoute({ children }) {
  const { isAuthenticated, checkingAuth } = useAuth()

  if (checkingAuth) {
    return <div className="min-h-screen flex items-center justify-center">Checking access...</div>
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />
  }
return children

}

export default ProtectedRoute
