import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useTheme } from '../context/ThemeContext'
import { useAuth } from '../context/AuthContext'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'

export default function Navbar() {
  const { isDark, toggleTheme } = useTheme()
  const { user, logout, isAdmin, isSuperAdmin } = useAuth()
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)

  const handleLogout = async () => {
    try {
      await logout()
      navigate('/')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const menuItems = [
    { label: t('nav.home'), href: '/' },
    { label: t('nav.animals'), href: '/hewan' },
    { label: t('nav.shelters'), href: '/shelter' },
    { label: t('nav.articles'), href: '/artikel' },
  ]

  return (
    <nav className="sticky top-0 z-50 glass soft-shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">🐾</span>
            </div>
            <span className="text-xl font-bold gradient-text">AdopsiHewan</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className="text-gray-600 dark:text-gray-300 hover:text-green-500 dark:hover:text-green-400 smooth-transition"
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Right Side */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-gray-100 dark:bg-dark-800 hover:bg-gray-200 dark:hover:bg-dark-700 smooth-transition"
            >
              {isDark ? '☀️' : '🌙'}
            </button>

            {/* Auth Buttons */}
            {!user ? (
              <>
                <Link
                  to="/login"
                  className="hidden sm:inline-block px-4 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-800 smooth-transition"
                >
                  {t('auth.login')}
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 rounded-lg bg-green-500 text-white hover:bg-green-600 smooth-transition"
                >
                  {t('auth.register')}
                </Link>
              </>
            ) : (
              <div className="relative group">
                <button className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gray-100 dark:bg-dark-800 hover:bg-gray-200 dark:hover:bg-dark-700 smooth-transition">
                  <span className="text-sm">{user.email}</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                <div className="absolute right-0 mt-0 w-48 bg-white dark:bg-dark-800 rounded-lg shadow-lg hidden group-hover:block">
                  <Link to="/dashboard" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-dark-700">
                    {t('dashboard.title')}
                  </Link>
                  <Link to="/favorit" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-dark-700">
                    {t('favorites.title')}
                  </Link>
                  {isAdmin && (
                    <Link to="/admin" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-dark-700">
                      Admin Dashboard
                    </Link>
                  )}
                  {isSuperAdmin && (
                    <Link to="/superadmin" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-dark-700">
                      Super Admin Dashboard
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-dark-700 text-red-500"
                  >
                    {t('auth.logout')}
                  </button>
                </div>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 rounded-lg bg-gray-100 dark:bg-dark-800"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'} />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden pb-4 space-y-2"
          >
            {menuItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className="block px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-800 smooth-transition"
              >
                {item.label}
              </Link>
            ))}
          </motion.div>
        )}
      </div>
    </nav>
  )
}
