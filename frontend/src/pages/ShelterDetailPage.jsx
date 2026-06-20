import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { supabase } from '../utils/supabaseClient'
import { useAuth } from '../context/AuthContext'

export default function ShelterDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [shelter, setShelter] = useState(null)
  const [shelterAnimals, setShelterAnimals] = useState([])
  const [loading, setLoading] = useState(true)
  const [isChatLoading, setIsChatLoading] = useState(false)

  const handleChat = async () => {
    if (!user) {
      alert("Silakan login terlebih dahulu untuk memulai chat.")
      navigate('/login')
      return
    }

    setIsChatLoading(true)
    try {
      // 1. Cek apakah chat room sudah ada
      const { data: existingRooms, error: checkError } = await supabase
        .from('chat_rooms')
        .select('id')
        .eq('user_id', user.id)
        .eq('shelter_id', shelter.id)

      if (checkError) throw checkError

      if (existingRooms && existingRooms.length > 0) {
        // Jika sudah ada, langsung redirect ke chat
        navigate('/chat')
      } else {
        // Jika belum, buat room baru
        const { error: insertError } = await supabase
          .from('chat_rooms')
          .insert([{ user_id: user.id, shelter_id: shelter.id }])

        if (insertError) throw insertError
        
        navigate('/chat')
      }
    } catch (error) {
      console.error("Gagal memulai chat:", error)
      alert("Gagal memulai chat: " + error.message)
    } finally {
      setIsChatLoading(false)
    }
  }

  useEffect(() => {
    const fetchShelterData = async () => {
      setLoading(true)
      try {
        const { data: shelterData, error: shelterError } = await supabase
          .from('shelters')
          .select('*')
          .eq('id', id)
          .single()

        if (shelterError) throw shelterError
        if (shelterData) {
          setShelter({
            ...shelterData,
            rating: shelterData.rating || 5.0,
            operating_hours: shelterData.operating_hours || { senin_jumat: '08:00 - 17:00', sabtu: '08:00 - 14:00', minggu: 'Tutup' }
          })
        }

        const { data: animalsData } = await supabase
          .from('animals')
          .select('id, name, breed, age, status, animal_images(image_url, is_primary)')
          .eq('shelter_id', id)

        if (animalsData) {
          setShelterAnimals(animalsData.map(a => {
            let image = 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
            const images = a.animal_images || []
            if (images.length > 0) {
              const primary = images.find(img => img.is_primary)
              image = primary ? primary.image_url : images[0].image_url
            }
            return { ...a, image }
          }))
        }
      } catch (err) {
        console.error("Error fetching shelter details:", err)
      } finally {
        setLoading(false)
      }
    }

    if (id) fetchShelterData()
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-blue"></div>
      </div>
    )
  }

  if (!shelter) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🏠</div>
          <h2 className="text-2xl font-bold mb-2">Shelter tidak ditemukan</h2>
          <Link to="/shelter" className="text-brand-orange hover:underline font-semibold">← Kembali ke daftar shelter</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative py-16 overflow-hidden" style={{ background: 'linear-gradient(135deg, #01BAEF, #2B59C3)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-white">
          <div className="flex items-center gap-2 text-sm opacity-80 mb-4">
            <Link to="/" className="hover:opacity-100">Beranda</Link> / <Link to="/shelter" className="hover:opacity-100">Shelter</Link> / <span>{shelter.name}</span>
          </div>
          <div className="flex flex-col md:flex-row items-start gap-6">
            <img src={shelter.logo_url || 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b'} alt={shelter.name} className="w-24 h-24 rounded-2xl object-cover shadow-xl border-2 border-white/30" />
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-4xl font-bold drop-shadow-md">{shelter.name}</h1>
                {shelter.verified && <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-bold">✅ Verified</span>}
              </div>
              <p className="opacity-90 max-w-2xl">{shelter.description}</p>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 w-full overflow-hidden leading-none">
          <svg className="relative block w-full h-12" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C59.71,118.08,130.83,110.15,189.36,93.41c62.3-17.81,121.4-44.41,180.22-63.53Z" className="fill-current text-white dark:text-dark-900"></path>
          </svg>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Info Card */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-dark-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-dark-700 sticky top-20">
              <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">Informasi Shelter</h3>
              <div className="space-y-4 text-sm">
                <div className="flex items-start gap-3">
                  <span className="text-lg">📍</span>
                  <div>
                    <div className="text-gray-400 text-xs">Alamat</div>
                    <div className="text-gray-700 dark:text-gray-300">{shelter.address}, {shelter.city}</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-lg">📞</span>
                  <div>
                    <div className="text-gray-400 text-xs">Telepon</div>
                    <div className="text-gray-700 dark:text-gray-300">{shelter.phone}</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-lg">📧</span>
                  <div>
                    <div className="text-gray-400 text-xs">Email</div>
                    <div className="text-gray-700 dark:text-gray-300">{shelter.email}</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-lg">🕐</span>
                  <div>
                    <div className="text-gray-400 text-xs">Jam Operasional</div>
                    {shelter.operating_hours ? Object.entries(shelter.operating_hours).map(([day, hours]) => (
                      <div key={day} className="text-gray-700 dark:text-gray-300 capitalize">
                        {day.replace('_', '-')}: {hours}
                      </div>
                    )) : <div className="text-gray-700 dark:text-gray-300">Tidak tersedia</div>}
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-lg">⭐</span>
                  <div>
                    <div className="text-gray-400 text-xs">Rating</div>
                    <div className="text-gray-700 dark:text-gray-300 font-bold">{shelter.rating}/5.0</div>
                  </div>
                </div>
              </div>
              <div className="mt-6">
                <button
                  onClick={handleChat}
                  disabled={isChatLoading}
                  className="w-full bg-brand-orange hover:bg-brand-yellow text-white font-bold py-3 px-4 rounded-xl shadow-md smooth-transition flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isChatLoading ? 'Memproses...' : '💬 Chat dengan Shelter'}
                </button>
              </div>
            </div>
          </div>

          {/* Animals */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
              Hewan di {shelter.name} ({shelterAnimals.length})
            </h2>
            {shelterAnimals.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <div className="text-4xl mb-2">🐾</div>
                <p>Belum ada hewan terdaftar di shelter ini</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {shelterAnimals.map((animal, i) => (
                  <motion.div
                    key={animal.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <Link
                      to={`/hewan/${animal.id}`}
                      className="block bg-white dark:bg-dark-800 rounded-2xl overflow-hidden shadow-lg border border-gray-100 dark:border-dark-700 group hover:-translate-y-2 smooth-transition"
                    >
                      <div className="h-48 overflow-hidden">
                        <img src={animal.image} alt={animal.name} className="w-full h-full object-cover group-hover:scale-110 smooth-transition duration-500" />
                      </div>
                      <div className="p-4">
                        <h3 className="font-bold text-gray-800 dark:text-white">{animal.name}</h3>
                        <p className="text-sm text-gray-500">{animal.breed} · {animal.age} tahun</p>
                        <span className={`inline-block mt-2 px-2 py-1 rounded-full text-xs font-bold ${
                          animal.status === 'available'
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-600'
                            : 'bg-red-100 dark:bg-red-900/30 text-red-600'
                        }`}>
                          {animal.status === 'available' ? '✅ Tersedia' : '❌ Diadopsi'}
                        </span>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
