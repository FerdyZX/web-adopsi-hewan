import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { supabase } from '../utils/supabaseClient'

export default function ShelterPage() {
  const [search, setSearch] = useState('')
  const [shelters, setShelters] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchShelters = async () => {
      setLoading(true)
      try {
        const { data, error } = await supabase
          .from('shelters')
          .select('*')
          .order('name', { ascending: true })

        if (error) throw error
        
        // Count animals for each shelter
        const sheltersWithCounts = await Promise.all((data || []).map(async (shelter) => {
          const { count } = await supabase
            .from('animals')
            .select('*', { count: 'exact', head: true })
            .eq('shelter_id', shelter.id)
            .eq('status', 'available')
            
          return {
            ...shelter,
            animal_count: count || 0,
            rating: shelter.rating || 5.0 // default rating if not present
          }
        }))
        
        setShelters(sheltersWithCounts)
      } catch (err) {
        console.error("Error fetching shelters:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchShelters()
  }, [])

  const filteredShelters = shelters.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.city.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative pt-28 pb-16 overflow-hidden" style={{ background: 'linear-gradient(135deg, #01BAEF, #2B59C3)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center text-white">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl sm:text-5xl font-bold mb-4 drop-shadow-md">🏠 Shelter Hewan</h1>
            <p className="text-xl opacity-90 max-w-2xl mx-auto mb-8">Temukan shelter hewan terdekat di kota Anda dan mulai proses adopsi</p>
            <div className="max-w-lg mx-auto">
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
                <input
                  type="text"
                  placeholder="Cari shelter atau kota..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-2xl text-gray-800 dark:text-white bg-white/90 dark:bg-dark-800/90 backdrop-blur-sm outline-none focus:ring-2 focus:ring-white/50 shadow-xl"
                />
              </div>
            </div>
          </motion.div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 w-full overflow-hidden leading-none">
          <svg className="relative block w-full h-12" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C59.71,118.08,130.83,110.15,189.36,93.41c62.3-17.81,121.4-44.41,180.22-63.53Z" className="fill-current text-white dark:text-dark-900"></path>
          </svg>
        </div>
      </section>

      {/* Shelter Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-blue"></div>
          </div>
        ) : filteredShelters.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🏠</div>
            <h3 className="text-2xl font-bold text-gray-600 dark:text-gray-400">Shelter tidak ditemukan</h3>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredShelters.map((shelter, i) => (
              <motion.div
                key={shelter.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.15 }}
              >
                <Link
                  to={`/shelter/${shelter.id}`}
                  className="block bg-white dark:bg-dark-800 rounded-2xl overflow-hidden shadow-lg border border-gray-100 dark:border-dark-700 group hover:-translate-y-2 smooth-transition h-full"
                >
                  <div className="h-48 overflow-hidden bg-gray-100 dark:bg-dark-700">
                    <img src={shelter.logo_url || 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b'} alt={shelter.name} className="w-full h-full object-cover group-hover:scale-110 smooth-transition duration-500" />
                  </div>
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-xl font-bold text-gray-800 dark:text-white">{shelter.name}</h3>
                      {shelter.verified && (
                        <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full text-xs font-bold">✅ Verified</span>
                      )}
                    </div>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mb-4 line-clamp-2">{shelter.description}</p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">📍 {shelter.city}</span>
                      <span className="text-brand-orange font-bold">🐾 {shelter.animal_count} hewan</span>
                    </div>
                    <div className="mt-3 flex items-center gap-1">
                      {'⭐'.repeat(Math.floor(shelter.rating || 5))}
                      <span className="text-sm text-gray-500 ml-1">{shelter.rating || 5.0}</span>
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
