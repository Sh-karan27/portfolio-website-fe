import { useState } from 'react'
import AdminLogin from '../components/admin/AdminLogin'
import AdminDashboard from '../components/admin/AdminDashboard'

function AdminPage() {
  const [admin, setAdmin] = useState(null)
  const [sessionExpired, setSessionExpired] = useState(false)

  const handleLoginSuccess = (loggedInAdmin) => {
    setSessionExpired(false)
    setAdmin(loggedInAdmin)
  }

  const handleAuthExpired = () => {
    setAdmin(null)
    setSessionExpired(true)
  }

  const handleLogout = () => {
    setSessionExpired(false)
    setAdmin(null)
  }

  if (!admin) {
    return <AdminLogin onLoginSuccess={handleLoginSuccess} sessionExpired={sessionExpired} />
  }

  return <AdminDashboard admin={admin} onLogout={handleLogout} onAuthExpired={handleAuthExpired} />
}

export default AdminPage
