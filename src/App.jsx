import { Routes, Route } from 'react-router-dom'
import PortfolioPage from './pages/PortfolioPage'
import AdminPage from './pages/AdminPage'
import ProjectDetailsPage from './pages/ProjectDetailsPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<PortfolioPage />} />
      <Route path="/projects/:slug" element={<ProjectDetailsPage />} />
      <Route path="/admin" element={<AdminPage />} />
    </Routes>
  )
}

export default App
