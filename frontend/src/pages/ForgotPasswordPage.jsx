import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const { resetPassword } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await resetPassword(email)
      setSent(true)
    } catch (err) {
      setError(err.message || 'Terjadi kesalahan. Coba lagi.')
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
        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-brand-orange/10 dark:bg-brand-orange/20 rounded-2xl flex items-center justify-center text-4xl">
            🔑
          </div>
        </div>

        <h1 className="text-3xl font-bold mb-2 text-center text-gray-800 dark:text-white">Lupa Password</h1>
        <p className="text-center text-gray-500 dark:text-gray-400 text-sm mb-6">
          Masukkan email Anda dan kami akan mengirimkan link untuk mengatur ulang password.
        </p>

        {sent ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-4"
          >
            <div className="text-5xl mb-4">📬</div>
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Email Terkirim!</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
              Kami telah mengirimkan link reset password ke <strong>{email}</strong>. Silakan cek kotak masuk email Anda.
            </p>
            <Link
              to="/login"
              className="inline-block px-6 py-3 bg-brand-orange text-white rounded-xl font-bold hover:bg-brand-yellow smooth-transition shadow-lg"
            >
              ← Kembali ke Login
            </Link>
          </motion.div>
        ) : (
          <>
            {error && (
              <div className="mb-4 p-4 bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 rounded-xl text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-1.5 text-gray-700 dark:text-gray-300">
                  Alamat Email
                </label>
                <input
                  id="forgot-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-dark-600 bg-gray-50 dark:bg-dark-700 focus:ring-2 focus:ring-brand-orange outline-none smooth-transition text-gray-800 dark:text-white"
                  placeholder="email@anda.com"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-brand-orange text-white rounded-xl font-bold text-lg hover:bg-brand-yellow disabled:bg-gray-400 smooth-transition shadow-lg flex items-center justify-center gap-2"
              >
                {loading ? (
                  <><span className="animate-spin">⏳</span> Mengirim...</>
                ) : (
                  '📧 Kirim Link Reset'
                )}
              </button>
            </form>

            <p className="mt-6 text-center text-gray-600 dark:text-gray-400 text-sm">
              Ingat password Anda?{' '}
              <Link to="/login" className="text-brand-orange hover:text-brand-yellow font-semibold smooth-transition">
                Masuk di sini
              </Link>
            </p>
          </>
        )}
      </motion.div>
    </div>
  )
}
