import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    password: '',
    confirmPassword: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (formData.password !== formData.confirmPassword) {
      setError('Password tidak cocok')
      return
    }

    setLoading(true)

    try {
      await register(formData.email, formData.password, {
        name: formData.name,
        phone: formData.phone,
        address: formData.address,
      })
      navigate('/login', { state: { message: 'Akun berhasil dibuat. Silakan masuk secara manual.' } })
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
        <h1 className="text-3xl font-bold mb-6 text-center gradient-text">Daftar</h1>

        {error && (
          <div className="mb-4 p-4 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-100 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Nama</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-dark-700 bg-white dark:bg-dark-800 focus:ring-2 focus:ring-green-500 outline-none"
              placeholder="Nama Lengkap"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-dark-700 bg-white dark:bg-dark-800 focus:ring-2 focus:ring-green-500 outline-none"
              placeholder="your@email.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">No. Telepon</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-dark-700 bg-white dark:bg-dark-800 focus:ring-2 focus:ring-green-500 outline-none"
              placeholder="08xxxxxxxxxx"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Alamat</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-dark-700 bg-white dark:bg-dark-800 focus:ring-2 focus:ring-green-500 outline-none"
              placeholder="Alamat Lengkap"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-dark-700 bg-white dark:bg-dark-800 focus:ring-2 focus:ring-green-500 outline-none"
              placeholder="••••••••"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Konfirmasi Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-dark-700 bg-white dark:bg-dark-800 focus:ring-2 focus:ring-green-500 outline-none"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 disabled:bg-gray-400 smooth-transition"
          >
            {loading ? 'Memproses...' : 'Daftar'}
          </button>
        </form>

        <p className="mt-6 text-center text-gray-600 dark:text-gray-400">
          Sudah punya akun?{' '}
          <Link to="/login" className="text-green-500 hover:text-green-600 font-semibold">
            Masuk di sini
          </Link>
        </p>
      </motion.div>
    </div>
  )
}
