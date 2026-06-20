import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../utils/supabaseClient'

export default function AdoptionHistoryPage() {
  const { user } = useAuth()
  const [adoptions, setAdoptions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAdoptions = async () => {
      if (!user) return
      setLoading(true)
      try {
        const { data } = await supabase
          .from('adoptions')
          .select(`
            id, status, created_at, notes,
            animals(id, name, breed, shelters(name), animal_images(image_url, is_primary))
          `)
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })

        if (data) {
          const formatted = data.map(a => {
            let image = 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
            const images = a.animals?.animal_images || []
            if (images.length > 0) {
              const primary = images.find(img => img.is_primary)
              image = primary ? primary.image_url : images[0].image_url
            }
            
            let note = 'Pengajuan sedang ditinjau oleh pihak shelter.'
            if (a.status === 'approved') note = 'Selamat! Pengajuan Anda telah disetujui. Silakan hubungi shelter.'
            if (a.status === 'rejected') note = 'Maaf, pengajuan tidak dapat diproses.'

            return {
              id: a.id,
              animal: {
                id: a.animals?.id,
                name: a.animals?.name || 'Hewan dihapus',
                breed: a.animals?.breed || '',
                shelter_name: a.animals?.shelters?.name || 'Shelter',
                image
              },
              status: a.status,
              date: new Date(a.created_at).toLocaleDateString('id-ID'),
              note: a.notes || note
            }
          })
          setAdoptions(formatted)
        }
      } catch (err) {
        console.error("Error fetching adoptions:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchAdoptions()
  }, [user])

  const statusConfig = {
    pending: { label: '⏳ Menunggu', bg: 'bg-yellow-100 dark:bg-yellow-900/30', text: 'text-yellow-700 dark:text-yellow-400', border: 'border-yellow-300 dark:border-yellow-800' },
    approved: { label: '✅ Disetujui', bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-700 dark:text-green-400', border: 'border-green-300 dark:border-green-800' },
    rejected: { label: '❌ Ditolak', bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-700 dark:text-red-400', border: 'border-red-300 dark:border-red-800' },
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="relative py-12 vibrant-hero overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h1 className="text-4xl font-bold mb-2 drop-shadow-md">📋 Riwayat Adopsi</h1>
          <p className="text-lg opacity-90">Pantau status pengajuan adopsi Anda</p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 w-full overflow-hidden leading-none">
          <svg className="relative block w-full h-10" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C59.71,118.08,130.83,110.15,189.36,93.41c62.3-17.81,121.4-44.41,180.22-63.53Z" className="fill-current text-white dark:text-dark-900"></path>
          </svg>
        </div>
      </section>

      {/* Summary Cards */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-20">
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white dark:bg-dark-800 rounded-2xl p-4 text-center shadow-lg border border-gray-100 dark:border-dark-700">
            <div className="text-2xl font-bold text-yellow-500">{adoptions.filter(a => a.status === 'pending').length}</div>
            <div className="text-xs text-gray-500 font-medium">Menunggu</div>
          </div>
          <div className="bg-white dark:bg-dark-800 rounded-2xl p-4 text-center shadow-lg border border-gray-100 dark:border-dark-700">
            <div className="text-2xl font-bold text-green-500">{adoptions.filter(a => a.status === 'approved').length}</div>
            <div className="text-xs text-gray-500 font-medium">Disetujui</div>
          </div>
          <div className="bg-white dark:bg-dark-800 rounded-2xl p-4 text-center shadow-lg border border-gray-100 dark:border-dark-700">
            <div className="text-2xl font-bold text-red-500">{adoptions.filter(a => a.status === 'rejected').length}</div>
            <div className="text-xs text-gray-500 font-medium">Ditolak</div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="relative">
          {/* Vertical Line */}
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-dark-700 hidden sm:block"></div>

          <div className="space-y-6">
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-orange"></div>
              </div>
            ) : adoptions.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                Belum ada riwayat pengajuan adopsi.
              </div>
            ) : adoptions.map((adoption, i) => {
              const status = statusConfig[adoption.status] || statusConfig.pending
              return (
                <motion.div
                  key={adoption.id}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.15 }}
                  className={`relative pl-0 sm:pl-16 ${status.border}`}
                >
                  {/* Timeline Dot */}
                  <div className={`hidden sm:flex absolute left-3 w-7 h-7 rounded-full ${status.bg} items-center justify-center text-xs z-10`}>
                    {adoption.status === 'pending' ? '⏳' : adoption.status === 'approved' ? '✅' : '❌'}
                  </div>

                  <div className={`bg-white dark:bg-dark-800 rounded-2xl p-6 shadow-lg border ${status.border} flex flex-col sm:flex-row items-start gap-5`}>
                    <Link to={adoption.animal.id ? `/hewan/${adoption.animal.id}` : '#'} className="shrink-0">
                      <img src={adoption.animal.image} alt={adoption.animal.name} className="w-20 h-20 rounded-xl object-cover shadow-md hover:scale-105 smooth-transition" />
                    </Link>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          {adoption.animal.id ? (
                            <Link to={`/hewan/${adoption.animal.id}`} className="font-bold text-lg text-gray-800 dark:text-white hover:text-brand-orange smooth-transition">
                              {adoption.animal.name}
                            </Link>
                          ) : (
                            <span className="font-bold text-lg text-gray-800 dark:text-white">{adoption.animal.name}</span>
                          )}
                          <p className="text-sm text-gray-500">{adoption.animal.breed} · {adoption.animal.shelter_name}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${status.bg} ${status.text}`}>
                          {status.label}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{adoption.note}</p>
                      <p className="text-xs text-gray-400">📅 Diajukan: {adoption.date}</p>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>
    </div>
  )
}
