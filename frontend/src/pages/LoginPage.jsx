import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate, Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const successMessage = location.state?.message

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await login(email, password)
      navigate('/dashboard')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass soft-shadow w-full max-w-md p-8 rounded-2xl"
      >
        <h1 className="text-3xl font-bold mb-6 text-center gradient-text">Masuk</h1>

        {error && (
          <div className="mb-4 p-4 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-100 rounded-lg">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="mb-4 p-4 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-100 rounded-lg">
            {successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-dark-700 bg-white dark:bg-dark-800 focus:ring-2 focus:ring-green-500 outline-none"
              placeholder="your@email.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-dark-700 bg-white dark:bg-dark-800 focus:ring-2 focus:ring-green-500 outline-none"
              placeholder="••••••••"
            />
          </div>

          <div className="text-right">
            <Link to="/forgot-password" className="text-sm text-brand-orange hover:text-brand-yellow font-medium smooth-transition">
              Lupa password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 disabled:bg-gray-400 smooth-transition"
          >
            {loading ? 'Memproses...' : 'Masuk'}
          </button>
        </form>

        <p className="mt-6 text-center text-gray-600 dark:text-gray-400">
          Belum punya akun?{' '}
          <Link to="/register" className="text-brand-orange hover:text-brand-yellow font-semibold smooth-transition">
            Daftar di sini
          </Link>
        </p>
      </motion.div>
    </div>
  )
}
