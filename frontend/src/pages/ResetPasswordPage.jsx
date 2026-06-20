import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { supabase } from '../utils/supabaseClient'
import { toast } from 'react-hot-toast'

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (password.length < 6) {
      toast.error('Password minimal 6 karakter.')
      return
    }
    if (password !== confirmPassword) {
      toast.error('Konfirmasi password tidak cocok!')
      return
    }

    setLoading(true)
    try {
      const { error } = await supabase.auth.updateUser({ password })
      if (error) throw error

      toast.success('Password berhasil diperbarui! Silakan masuk dengan password baru Anda.', { duration: 5000 })
      navigate('/login')
    } catch (err) {
      toast.error(err.message || 'Gagal memperbarui password.')
    } finally {
      setLoading(false)
    }
  }

  const strength = () => {
    if (!password) return { label: '', color: '', width: '0%' }
    if (password.length < 6) return { label: 'Lemah', color: 'bg-red-500', width: '33%' }
    if (password.length < 10) return { label: 'Sedang', color: 'bg-yellow-500', width: '66%' }
    return { label: 'Kuat', color: 'bg-green-500', width: '100%' }
  }

  const pwStrength = strength()

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass soft-shadow w-full max-w-md p-8 rounded-2xl"
      >
        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-brand-green/10 dark:bg-brand-green/20 rounded-2xl flex items-center justify-center text-4xl">
            🔒
          </div>
        </div>

        <h1 className="text-3xl font-bold mb-2 text-center text-gray-800 dark:text-white">Buat Password Baru</h1>
        <p className="text-center text-gray-500 dark:text-gray-400 text-sm mb-6">
          Masukkan password baru Anda di bawah ini.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Password Baru */}
          <div>
            <label className="block text-sm font-semibold mb-1.5 text-gray-700 dark:text-gray-300">
              Password Baru
            </label>
            <div className="relative">
              <input
                id="new-password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 pr-12 rounded-xl border border-gray-200 dark:border-dark-600 bg-gray-50 dark:bg-dark-700 focus:ring-2 focus:ring-brand-orange outline-none smooth-transition text-gray-800 dark:text-white"
                placeholder="Minimal 6 karakter"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 smooth-transition text-lg"
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>

            {/* Password Strength Bar */}
            {password && (
              <div className="mt-2">
                <div className="h-1.5 w-full bg-gray-200 dark:bg-dark-600 rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full rounded-full ${pwStrength.color}`}
                    initial={{ width: '0%' }}
                    animate={{ width: pwStrength.width }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
                <p className="text-xs mt-1 text-gray-500">
                  Kekuatan: <span className="font-semibold">{pwStrength.label}</span>
                </p>
              </div>
            )}
          </div>

          {/* Konfirmasi Password */}
          <div>
            <label className="block text-sm font-semibold mb-1.5 text-gray-700 dark:text-gray-300">
              Konfirmasi Password Baru
            </label>
            <input
              id="confirm-password"
              type={showPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className={`w-full px-4 py-3 rounded-xl border bg-gray-50 dark:bg-dark-700 focus:ring-2 focus:ring-brand-orange outline-none smooth-transition text-gray-800 dark:text-white ${
                confirmPassword && confirmPassword !== password
                  ? 'border-red-400 focus:ring-red-400'
                  : 'border-gray-200 dark:border-dark-600'
              }`}
              placeholder="Ulangi password baru"
            />
            {confirmPassword && confirmPassword !== password && (
              <p className="text-xs text-red-500 mt-1">Password tidak cocok</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || !password || !confirmPassword}
            className="w-full py-3 bg-brand-orange text-white rounded-xl font-bold text-lg hover:bg-brand-yellow disabled:bg-gray-400 smooth-transition shadow-lg flex items-center justify-center gap-2 mt-2"
          >
            {loading ? (
              <><span className="animate-spin">⏳</span> Menyimpan...</>
            ) : (
              '🔑 Simpan Password Baru'
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-gray-500 dark:text-gray-400 text-sm">
          <Link to="/login" className="text-brand-orange hover:text-brand-yellow font-semibold smooth-transition">
            ← Kembali ke Login
          </Link>
        </p>
      </motion.div>
    </div>
  )
}
