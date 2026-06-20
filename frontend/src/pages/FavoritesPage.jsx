import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../utils/supabaseClient'

export default function FavoritesPage() {
  const { user } = useAuth()
  const [favorites, setFavorites] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!user) return
      setLoading(true)
      try {
        const { data } = await supabase
          .from('favorites')
          .select(`
            id, animal_id,
            animals(id, name, breed, age, shelters(city), animal_images(image_url, is_primary))
          `)
          .eq('user_id', user.id)

        if (data) {
          const formattedFavs = data.map(f => {
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
              age: f.animals?.age || 0,
              location: f.animals?.shelters?.city || 'Lokasi tidak diketahui',
              image
            }
          }).filter(f => f.id)
          setFavorites(formattedFavs)
        }
      } catch (err) {
        console.error("Error fetching favorites:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchFavorites()
  }, [user])

  const removeFavorite = async (animalId) => {
    try {
      await supabase
        .from('favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('animal_id', animalId)
      
      setFavorites(prev => prev.filter(f => f.id !== animalId))
    } catch (err) {
      console.error("Error removing favorite:", err)
    }
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="relative py-12 vibrant-hero overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h1 className="text-4xl font-bold mb-2 drop-shadow-md">❤️ Hewan Favorit</h1>
          <p className="text-lg opacity-90">Daftar hewan yang Anda simpan</p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 w-full overflow-hidden leading-none">
          <svg className="relative block w-full h-10" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C59.71,118.08,130.83,110.15,189.36,93.41c62.3-17.81,121.4-44.41,180.22-63.53Z" className="fill-current text-white dark:text-dark-900"></path>
          </svg>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-orange"></div>
          </div>
        ) : favorites.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">💔</div>
            <h3 className="text-2xl font-bold text-gray-600 dark:text-gray-400 mb-2">Belum ada favorit</h3>
            <p className="text-gray-500 mb-6">Jelajahi daftar hewan dan simpan yang Anda sukai!</p>
            <Link to="/hewan" className="px-8 py-3 bg-brand-orange text-white rounded-full font-bold hover:bg-brand-yellow smooth-transition shadow-lg">
              Lihat Daftar Hewan
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {favorites.map((animal, index) => (
              <motion.div
                key={animal.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-dark-800 rounded-2xl overflow-hidden shadow-lg border border-gray-100 dark:border-dark-700 group"
              >
                <Link to={`/hewan/${animal.id}`}>
                  <div className="h-56 overflow-hidden">
                    <img src={animal.image} alt={animal.name} className="w-full h-full object-cover group-hover:scale-110 smooth-transition duration-500" />
                  </div>
                </Link>
                <div className="p-5">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-lg font-bold text-gray-800 dark:text-white">{animal.name}</h3>
                      <p className="text-sm text-gray-500">{animal.breed} · {animal.age} tahun</p>
                    </div>
                    <button
                      onClick={() => removeFavorite(animal.id)}
                      className="p-2 rounded-full bg-red-50 dark:bg-red-900/20 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/40 smooth-transition z-10 relative"
                      title="Hapus dari favorit"
                    >
                      🗑️
                    </button>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <span>📍 {animal.location}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
