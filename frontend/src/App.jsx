import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'
import ThemeProvider from './context/ThemeContext'
import AuthProvider from './context/AuthContext'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'

// Pages
import HomePage from './pages/HomePage'
import AnimalListPage from './pages/AnimalListPage'
import AnimalDetailPage from './pages/AnimalDetailPage'
import ShelterPage from './pages/ShelterPage'
import ShelterDetailPage from './pages/ShelterDetailPage'
import ArticlePage from './pages/ArticlePage'
import ArticleDetailPage from './pages/ArticleDetailPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import UserDashboardPage from './pages/UserDashboardPage'
import AdminDashboardPage from './pages/AdminDashboardPage'
import SuperAdminDashboardPage from './pages/SuperAdminDashboardPage'
import FavoritesPage from './pages/FavoritesPage'
import AdoptionHistoryPage from './pages/AdoptionHistoryPage'
import ChatPage from './pages/ChatPage'
import NotFoundPage from './pages/NotFoundPage'

export default function App() {
  useEffect(() => {
    // Cek tema dari localStorage saat pertama kali load
    const theme = localStorage.getItem('theme') || 'light'
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [])

  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/hewan" element={<AnimalListPage />} />
              <Route path="/hewan/:id" element={<AnimalDetailPage />} />
              <Route path="/shelter" element={<ShelterPage />} />
              <Route path="/shelter/:id" element={<ShelterDetailPage />} />
              <Route path="/artikel" element={<ArticlePage />} />
              <Route path="/artikel/:id" element={<ArticleDetailPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              
              {/* Protected Routes */}
              <Route path="/dashboard" element={<ProtectedRoute><UserDashboardPage /></ProtectedRoute>} />
              <Route path="/favorit" element={<ProtectedRoute><FavoritesPage /></ProtectedRoute>} />
              <Route path="/riwayat-adopsi" element={<ProtectedRoute><AdoptionHistoryPage /></ProtectedRoute>} />
              <Route path="/chat" element={<ProtectedRoute><ChatPage /></ProtectedRoute>} />
              
              {/* Admin Routes */}
              <Route path="/admin" element={<ProtectedRoute requiredRole="admin"><AdminDashboardPage /></ProtectedRoute>} />
              
              {/* Super Admin Routes */}
              <Route path="/superadmin" element={<ProtectedRoute requiredRole="superadmin"><SuperAdminDashboardPage /></ProtectedRoute>} />
              
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  )
}
