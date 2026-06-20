import { useState } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../utils/supabaseClient'

export default function AdoptionModal({ animal, onClose }) {
  const { user } = useAuth()
  const [formData, setFormData] = useState({
    name: user?.user_metadata?.name || '',
    email: user?.email || '',
    phone: '',
    address: '',
    reason: '',
    experience: '',
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setErrorMsg('')
    
    try {
      const { error } = await supabase.from('adoptions').insert([{
        user_id: user.id,
        animal_id: animal.id,
        shelter_id: animal.shelter_id || null,
        adoption_reason: formData.reason,
        pet_experience: formData.experience,
        status: 'pending',
        notes: `Phone: ${formData.phone}, Address: ${formData.address}`
      }])
      
      if (error) throw error
      setSuccess(true)
    } catch (err) {
      console.error("Error submitting adoption:", err)
      setErrorMsg(err.message || 'Terjadi kesalahan saat mengirim pengajuan.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative bg-white dark:bg-dark-800 rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-8 z-10"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 dark:bg-dark-700 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-dark-600 smooth-transition"
        >
          ✕
        </button>

        {success ? (
          <div className="text-center py-8">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Pengajuan Berhasil!</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Pengajuan adopsi untuk <strong>{animal.name}</strong> telah dikirim. Tim shelter akan meninjau pengajuan Anda.
            </p>
            <div className="inline-block bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 px-4 py-2 rounded-full text-sm font-bold mb-6">
              ⏳ Status: Menunggu Review
            </div>
            <br />
            <button
              onClick={onClose}
              className="mt-4 px-8 py-3 bg-brand-orange text-white rounded-xl font-bold hover:bg-brand-yellow smooth-transition"
            >
              Tutup
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-4 mb-6">
              <img src={animal.images?.[0] || animal.image} alt={animal.name} className="w-16 h-16 rounded-2xl object-cover" />
              <div>
                <h2 className="text-xl font-bold text-gray-800 dark:text-white">Ajukan Adopsi</h2>
                <p className="text-gray-500 dark:text-gray-400 text-sm">{animal.name} · {animal.breed}</p>
              </div>
            </div>

            {errorMsg && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-1.5 text-gray-700 dark:text-gray-300">Nama Lengkap</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-dark-600 bg-gray-50 dark:bg-dark-700 focus:ring-2 focus:ring-brand-orange outline-none smooth-transition"
                  placeholder="Nama lengkap Anda"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1.5 text-gray-700 dark:text-gray-300">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-dark-600 bg-gray-50 dark:bg-dark-700 focus:ring-2 focus:ring-brand-orange outline-none smooth-transition"
                  placeholder="email@anda.com"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1.5 text-gray-700 dark:text-gray-300">Nomor Telepon</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-dark-600 bg-gray-50 dark:bg-dark-700 focus:ring-2 focus:ring-brand-orange outline-none smooth-transition"
                  placeholder="08xxxxxxxxxx"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1.5 text-gray-700 dark:text-gray-300">Alamat</label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  rows={2}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-dark-600 bg-gray-50 dark:bg-dark-700 focus:ring-2 focus:ring-brand-orange outline-none smooth-transition resize-none"
                  placeholder="Alamat lengkap Anda"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1.5 text-gray-700 dark:text-gray-300">Alasan Mengadopsi</label>
                <textarea
                  name="reason"
                  value={formData.reason}
                  onChange={handleChange}
                  required
                  rows={3}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-dark-600 bg-gray-50 dark:bg-dark-700 focus:ring-2 focus:ring-brand-orange outline-none smooth-transition resize-none"
                  placeholder="Ceritakan alasan Anda ingin mengadopsi hewan ini"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1.5 text-gray-700 dark:text-gray-300">Pengalaman Memelihara Hewan</label>
                <textarea
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  rows={2}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-dark-600 bg-gray-50 dark:bg-dark-700 focus:ring-2 focus:ring-brand-orange outline-none smooth-transition resize-none"
                  placeholder="Apakah Anda pernah memelihara hewan sebelumnya?"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-brand-orange text-white rounded-xl font-bold text-lg hover:bg-brand-yellow disabled:bg-gray-400 smooth-transition shadow-lg"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="animate-spin">⏳</span> Mengirim...
                  </span>
                ) : (
                  '💝 Kirim Pengajuan'
                )}
              </button>
            </form>
          </>
        )}
      </motion.div>
    </div>
  )
}
