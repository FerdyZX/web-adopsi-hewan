import { useState, useMemo, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { supabase } from '../utils/supabaseClient'

export default function AnimalListPage() {
  const [searchParams] = useSearchParams()
  const initialCategory = searchParams.get('category') || 'Semua'
  const [selectedCategory, setSelectedCategory] = useState(initialCategory)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const [animals, setAnimals] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  // Fetch Data from Supabase
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      
      try {
        // Fetch Categories
        const { data: catData } = await supabase.from('categories').select('*')
        if (catData) setCategories(catData)

        // Fetch Animals
        const { data: animalData } = await supabase
          .from('animals')
          .select(`
            id, name, breed, age, status, favorites_count,
            categories(name),
            shelters(city),
            animal_images(image_url, is_primary)
          `)
          .order('created_at', { ascending: false })

        if (animalData) {
          const formattedAnimals = animalData.map(animal => {
            let imageUrl = 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
            if (animal.animal_images && animal.animal_images.length > 0) {
              const primaryImage = animal.animal_images.find(img => img.is_primary)
              imageUrl = primaryImage ? primaryImage.image_url : animal.animal_images[0].image_url
            }
            return {
              id: animal.id,
              name: animal.name,
              breed: animal.breed || 'Unknown',
              age: animal.age || 0,
              status: animal.status,
              category: animal.categories?.name || 'Lainnya',
              location: animal.shelters?.city || 'Lokasi tidak diketahui',
              favorites_count: animal.favorites_count || 0,
              image: imageUrl
            }
          })
          setAnimals(formattedAnimals)
        }
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Filter Data
  const filteredAnimals = useMemo(() => {
    return animals.filter(animal => {
      const matchCategory = selectedCategory === 'Semua' || animal.category === selectedCategory
      const matchSearch = animal.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        animal.breed.toLowerCase().includes(searchQuery.toLowerCase())
      const matchStatus = statusFilter === 'all' || animal.status === statusFilter
      return matchCategory && matchSearch && matchStatus
    })
  }, [animals, selectedCategory, searchQuery, statusFilter])

  const totalAnimals = animals.length
  const adoptedAnimals = animals.filter(a => a.status === 'adopted').length
  const waitingAnimals = animals.filter(a => a.status === 'available').length

  const bgColors = [
    'bg-green-400', 'bg-amber-400', 'bg-cyan-400', 'bg-orange-400',
    'bg-rose-300', 'bg-pink-300', 'bg-yellow-400', 'bg-emerald-400', 'bg-violet-400'
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Banner */}
      <section className="relative pt-28 pb-16 vibrant-hero overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-4xl sm:text-5xl font-bold mb-4 drop-shadow-md">Temukan Sahabat Barumu</h1>
            <p className="text-xl opacity-90 max-w-2xl mx-auto mb-8">
              Jelajahi berbagai hewan yang menunggu untuk diadopsi dan temukan yang paling cocok untukmu
            </p>
          </motion.div>

          {/* Stats Cards */}
          <div className="grid grid-cols-3 gap-4 max-w-3xl mx-auto mt-8">
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 text-center border border-white/30">
              <div className="text-3xl font-bold">{totalAnimals}</div>
              <div className="text-sm opacity-90 font-medium">Total Hewan</div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 text-center border border-white/30">
              <div className="text-3xl font-bold">{adoptedAnimals}</div>
              <div className="text-sm opacity-90 font-medium">Teradopsi</div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 text-center border border-white/30">
              <div className="text-3xl font-bold">{waitingAnimals}</div>
              <div className="text-sm opacity-90 font-medium">Menunggu Adopsi</div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 w-full overflow-hidden leading-none">
          <svg className="relative block w-full h-12" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C59.71,118.08,130.83,110.15,189.36,93.41c62.3-17.81,121.4-44.41,180.22-63.53Z" className="fill-current text-white dark:text-dark-900"></path>
          </svg>
        </div>
      </section>

      {/* Search & Filter */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-20">
        <div className="bg-white dark:bg-dark-800 rounded-2xl shadow-xl p-6 border border-gray-100 dark:border-dark-700">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
              <input
                type="text"
                placeholder="Cari nama atau ras hewan..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 dark:border-dark-600 bg-gray-50 dark:bg-dark-700 focus:ring-2 focus:ring-brand-orange outline-none smooth-transition"
              />
            </div>
            {/* Status filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-3 rounded-xl border border-gray-200 dark:border-dark-600 bg-gray-50 dark:bg-dark-700 focus:ring-2 focus:ring-brand-orange outline-none"
            >
              <option value="all">Semua Status</option>
              <option value="available">Tersedia</option>
              <option value="adopted">Sudah Diadopsi</option>
            </select>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setSelectedCategory('Semua')}
            className={`px-5 py-2 rounded-full font-semibold text-sm smooth-transition ${
              selectedCategory === 'Semua'
                ? 'bg-brand-orange text-white shadow-lg'
                : 'bg-gray-100 dark:bg-dark-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-dark-600'
            }`}
          >
            Semua
          </button>
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.name)}
              className={`px-5 py-2 rounded-full font-semibold text-sm smooth-transition flex items-center gap-2 ${
                selectedCategory === cat.name
                  ? 'bg-brand-orange text-white shadow-lg'
                  : 'bg-gray-100 dark:bg-dark-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-dark-600'
              }`}
            >
              <span>{cat.icon || '🐾'}</span> {cat.name}
            </button>
          ))}
        </div>
      </section>

      {/* Animal Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <div className="flex justify-center p-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-orange"></div>
          </div>
        ) : filteredAnimals.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🐾</div>
            <h3 className="text-2xl font-bold text-gray-600 dark:text-gray-400 mb-2">Tidak ada hewan ditemukan</h3>
            <p className="text-gray-500">Coba ubah filter atau kata pencarian Anda</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredAnimals.map((animal, index) => (
              <motion.div
                key={animal.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8 }}
              >
                <Link
                  to={`/hewan/${animal.id}`}
                  className="block bg-white dark:bg-dark-800 rounded-[2rem] overflow-hidden shadow-lg border border-gray-100 dark:border-dark-700 group cursor-pointer"
                >
                  <div className={`h-64 overflow-hidden relative ${bgColors[index % bgColors.length]}`}>
                    {animal.status === 'adopted' && (
                      <div className="absolute top-4 right-4 z-20 bg-brand-pink text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                        Sudah Diadopsi
                      </div>
                    )}
                    <img
                      src={animal.image}
                      alt={animal.name}
                      className="w-full h-full object-cover group-hover:scale-110 smooth-transition duration-500"
                    />
                  </div>
                  <div className="p-5">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-bold text-gray-800 dark:text-white">{animal.name}</h3>
                      <span className="text-xs bg-gray-100 dark:bg-dark-700 text-gray-500 dark:text-gray-400 px-2 py-1 rounded-full">{animal.category}</span>
                    </div>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mb-3">{animal.breed} · {animal.age} tahun</p>
                    <div className="flex justify-between items-center text-xs text-gray-400 dark:text-gray-500">
                      <span>📍 {animal.location}</span>
                      <span>❤️ {animal.favorites_count}</span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
