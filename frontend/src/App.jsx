import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'
import { Toaster } from 'react-hot-toast'
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
import ShelterAdminDashboardPage from './pages/ShelterAdminDashboardPage'
import FavoritesPage from './pages/FavoritesPage'
import AdoptionHistoryPage from './pages/AdoptionHistoryPage'
import ChatPage from './pages/ChatPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import ResetPasswordPage from './pages/ResetPasswordPage'
import DonasiPage from './pages/DonasiPage'
import AboutPage from './pages/AboutPage'
import ContactPage from './pages/ContactPage'
import FAQPage from './pages/FAQPage'
import PrivacyPolicyPage from './pages/PrivacyPolicyPage'
import NotFoundPage from './pages/NotFoundPage'

export default function App() {
  useEffect(() => {
    // Cek tema dari localStorage saat pertama kali load
    const theme = localStorage.getItem('theme') || 'light'
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [])

  return (
    <ThemeProvider>
      <Toaster position="top-right" />
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
              <Route path="/donasi" element={<DonasiPage />} />
              <Route path="/tentang-kami" element={<AboutPage />} />
              <Route path="/hubungi-kami" element={<ContactPage />} />
              <Route path="/faq" element={<FAQPage />} />
              <Route path="/kebijakan-privasi" element={<PrivacyPolicyPage />} />
              
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/reset-password" element={<ResetPasswordPage />} />
              
              {/* Protected Routes */}
              <Route path="/dashboard" element={<ProtectedRoute><UserDashboardPage /></ProtectedRoute>} />
              <Route path="/favorit" element={<ProtectedRoute><FavoritesPage /></ProtectedRoute>} />
              <Route path="/riwayat-adopsi" element={<ProtectedRoute><AdoptionHistoryPage /></ProtectedRoute>} />
              <Route path="/chat" element={<ProtectedRoute><ChatPage /></ProtectedRoute>} />
              
              {/* Shelter Admin Routes */}
              <Route path="/mitra-dashboard" element={<ProtectedRoute requiredRole="admin_shelter"><ShelterAdminDashboardPage /></ProtectedRoute>} />

              {/* Super Admin Routes */}
              <Route path="/admin" element={<ProtectedRoute requiredRole="superadmin"><AdminDashboardPage /></ProtectedRoute>} />
              <Route path="/superadmin" element={<ProtectedRoute requiredRole="superadmin"><SuperAdminDashboardPage /></ProtectedRoute>} />
              
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  )
}
