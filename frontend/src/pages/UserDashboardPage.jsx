import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../utils/supabaseClient'
import { toast } from 'react-hot-toast'

export default function UserDashboardPage() {
  const { user, role } = useAuth()
  const [activeTab, setActiveTab] = useState('profile')
  const [avatar, setAvatar] = useState(user?.user_metadata?.avatar_url || null)
  
  const [adoptions, setAdoptions] = useState([])
  const [favorites, setFavorites] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return
      setLoading(true)
      try {
        // Fetch Adoptions
        const { data: adoptionsData } = await supabase
          .from('adoptions')
          .select(`
            id, status, created_at,
            animals(id, name, breed, animal_images(image_url, is_primary))
          `)
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })

        if (adoptionsData) {
          const formattedAdoptions = adoptionsData.map(a => {
            let image = 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
            const images = a.animals?.animal_images || []
            if (images.length > 0) {
              const primary = images.find(img => img.is_primary)
              image = primary ? primary.image_url : images[0].image_url
            }
            return {
              id: a.id,
              animal: {
                id: a.animals?.id,
                name: a.animals?.name || 'Hewan dihapus',
                breed: a.animals?.breed || '',
                image
              },
              status: a.status,
              date: new Date(a.created_at).toLocaleDateString('id-ID')
            }
          })
          setAdoptions(formattedAdoptions)
        }

        // Fetch Favorites
        const { data: favData } = await supabase
          .from('favorites')
          .select(`
            id,
            animals(id, name, breed, animal_images(image_url, is_primary))
          `)
          .eq('user_id', user.id)

        if (favData) {
          const formattedFavs = favData.map(f => {
            let image = 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
            const images = f.animals?.animal_images || []
            if (images.length > 0) {
              const primary = images.find(img => img.is_primary)
              image = primary ? primary.image_url : images[0].image_url
            }
            return {
              id: f.animals?.id,
              name: f.animals?.name || 'Hewan dihapus',
              breed: f.animals?.breed || '',
              image
            }
          }).filter(f => f.id) // hapus jika animal sudah tidak ada
          setFavorites(formattedFavs)
        }
      } catch (err) {
        console.error("Error fetching dashboard data:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [user])

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0]
    if (file) {
      const toastId = toast.loading('Mengunggah foto profil...')
      try {
        const fileExt = file.name.split('.').pop()
        const fileName = `avatar_${user.id}_${Math.random().toString(36).substring(2)}.${fileExt}`
        
        const { error: uploadError } = await supabase.storage
          .from('animal-images') // Gunakan bucket yang ada
          .upload(fileName, file)

        if (uploadError) throw uploadError

        const { data: { publicUrl } } = supabase.storage
          .from('animal-images')
          .getPublicUrl(fileName)

        const { error: updateError } = await supabase
          .from('users')
          .update({ avatar_url: publicUrl })
          .eq('id', user.id)

        if (updateError) throw updateError

        setAvatar(publicUrl)
        toast.success('Foto profil berhasil diperbarui!', { id: toastId })
      } catch (err) {
        console.error(err)
        toast.error('Gagal mengunggah foto profil.', { id: toastId })
      }
    }
  }

  const tabs = [
    { id: 'profile', label: 'Profil', icon: '👤' },
    { id: 'adoptions', label: 'Riwayat Adopsi', icon: '📋' },
    { id: 'favorites', label: 'Favorit', icon: '❤️' },
  ]

  const statusBadge = (status) => {
    const styles = {
      pending: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400',
      approved: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
      rejected: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
    }
    const labels = { pending: '⏳ Menunggu', approved: '✅ Disetujui', rejected: '❌ Ditolak' }
    return <span className={`px-3 py-1 rounded-full text-xs font-bold ${styles[status] || styles.pending}`}>{labels[status] || 'Menunggu'}</span>
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="relative py-12 vibrant-hero overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex items-center gap-6">
            <div className="relative group cursor-pointer">
              <input type="file" accept="image/*" onChange={handleAvatarChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" title="Ganti Foto Profil" />
              <div className="w-24 h-24 rounded-full bg-white/20 backdrop-blur-sm border-4 border-white/50 flex items-center justify-center text-5xl shadow-xl overflow-hidden group-hover:border-white smooth-transition">
                {avatar ? <img src={avatar} alt="Profile" className="w-full h-full object-cover" /> : '👤'}
              </div>
              <div className="absolute bottom-0 right-0 bg-brand-orange text-white p-1.5 rounded-full border-2 border-white shadow-lg z-10 group-hover:scale-110 smooth-transition">
                📷
              </div>
            </div>
            <div>
              <h1 className="text-3xl font-bold drop-shadow-md">{user?.user_metadata?.name || user?.email || 'User'}</h1>
              <p className="opacity-90">{user?.email}</p>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 w-full overflow-hidden leading-none">
          <svg className="relative block w-full h-10" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C59.71,118.08,130.83,110.15,189.36,93.41c62.3-17.81,121.4-44.41,180.22-63.53Z" className="fill-current text-white dark:text-dark-900"></path>
          </svg>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="flex gap-2 mb-8 bg-gray-100 dark:bg-dark-800 rounded-2xl p-1.5">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-3 px-4 rounded-xl font-semibold text-sm smooth-transition flex items-center justify-center gap-2 ${
                activeTab === tab.id
                  ? 'bg-white dark:bg-dark-700 text-brand-orange shadow-md'
                  : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              <span>{tab.icon}</span> {tab.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center p-12">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-orange"></div>
          </div>
        ) : (
          <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            {activeTab === 'profile' && (
              <div className="bg-white dark:bg-dark-800 rounded-2xl p-8 shadow-lg border border-gray-100 dark:border-dark-700">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Informasi Profil</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-500 dark:text-gray-400 mb-1">Email</label>
                    <p className="text-lg text-gray-800 dark:text-white">{user?.email || '-'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-500 dark:text-gray-400 mb-1">Role</label>
                    <p className="text-lg text-gray-800 dark:text-white capitalize">{role || 'User'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-500 dark:text-gray-400 mb-1">Total Adopsi</label>
                    <p className="text-lg text-gray-800 dark:text-white">{adoptions.length}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-500 dark:text-gray-400 mb-1">Total Favorit</label>
                    <p className="text-lg text-gray-800 dark:text-white">{favorites.length}</p>
                  </div>
                </div>

                <div className="mt-8 flex gap-4">
                  <Link to="/favorit" className="px-6 py-3 bg-brand-orange text-white rounded-xl font-bold hover:bg-brand-yellow smooth-transition shadow-lg">
                    Lihat Favorit
                  </Link>
                  <Link to="/riwayat-adopsi" className="px-6 py-3 bg-gray-100 dark:bg-dark-700 text-gray-700 dark:text-gray-300 rounded-xl font-bold hover:bg-gray-200 dark:hover:bg-dark-600 smooth-transition">
                    Riwayat Adopsi
                  </Link>
                </div>
              </div>
            )}

            {activeTab === 'adoptions' && (
              <div className="space-y-4">
                {adoptions.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">Belum ada riwayat adopsi.</div>
                ) : adoptions.map((adoption, i) => (
                  <motion.div
                    key={adoption.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-white dark:bg-dark-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-dark-700 flex items-center gap-6"
                  >
                    <img src={adoption.animal.image} alt={adoption.animal.name} className="w-20 h-20 rounded-xl object-cover" />
                    <div className="flex-1">
                      <Link to={`/hewan/${adoption.animal.id}`} className="font-bold text-gray-800 dark:text-white text-lg hover:text-brand-orange smooth-transition">
                        {adoption.animal.name}
                      </Link>
                      <p className="text-sm text-gray-500">{adoption.animal.breed} · Diajukan {adoption.date}</p>
                    </div>
                    {statusBadge(adoption.status)}
                  </motion.div>
                ))}
              </div>
            )}

            {activeTab === 'favorites' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {favorites.length === 0 ? (
                  <div className="col-span-full text-center py-12 text-gray-500">Belum ada hewan favorit.</div>
                ) : favorites.map(animal => (
                  <Link
                    key={animal.id}
                    to={`/hewan/${animal.id}`}
                    className="bg-white dark:bg-dark-800 rounded-2xl overflow-hidden shadow-lg border border-gray-100 dark:border-dark-700 group hover:-translate-y-2 smooth-transition"
                  >
                    <div className="h-40 overflow-hidden">
                      <img src={animal.image} alt={animal.name} className="w-full h-full object-cover group-hover:scale-110 smooth-transition duration-500" />
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-gray-800 dark:text-white">{animal.name}</h3>
                      <p className="text-xs text-gray-500">{animal.breed}</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  )
}
