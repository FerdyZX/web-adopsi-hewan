import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../utils/supabaseClient'
import AdoptionModal from '../components/AdoptionModal'

export default function AnimalDetailPage() {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  
  const [animal, setAnimal] = useState(null)
  const [similarAnimals, setSimilarAnimals] = useState([])
  const [isFavorited, setIsFavorited] = useState(false)
  const [showAdoptionModal, setShowAdoptionModal] = useState(false)
  const [activeImage, setActiveImage] = useState(0)
  const [loading, setLoading] = useState(true)
  const [isChatLoading, setIsChatLoading] = useState(false)

  const handleChat = async () => {
    if (!user) {
      alert("Silakan login terlebih dahulu untuk memulai chat.")
      navigate('/login')
      return
    }

    if (!animal || !animal.shelter_id) {
      alert("Informasi shelter tidak tersedia.")
      return
    }

    setIsChatLoading(true)
    try {
      // 1. Cek apakah chat room sudah ada
      const { data: existingRooms, error: checkError } = await supabase
        .from('chat_rooms')
        .select('id')
        .eq('user_id', user.id)
        .eq('shelter_id', animal.shelter_id)

      if (checkError) throw checkError

      if (existingRooms && existingRooms.length > 0) {
        navigate('/chat')
      } else {
        // Buat room baru
        const { error: insertError } = await supabase
          .from('chat_rooms')
          .insert([{ user_id: user.id, shelter_id: animal.shelter_id }])

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
    const fetchAnimalDetail = async () => {
      setLoading(true)
      try {
        // Fetch Animal Detail
        const { data, error } = await supabase
          .from('animals')
          .select(`
            *,
            categories(name),
            shelters(name, city),
            animal_images(image_url, is_primary)
          `)
          .eq('id', id)
          .single()

        if (error) throw error

        if (data) {
          // Format images
          let images = ['https://images.unsplash.com/photo-1543466835-00a7907e9de1?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80']
          if (data.animal_images && data.animal_images.length > 0) {
            images = data.animal_images.map(img => img.image_url)
            // Put primary image first
            const primaryIndex = data.animal_images.findIndex(img => img.is_primary)
            if (primaryIndex > 0) {
              const primary = images.splice(primaryIndex, 1)[0]
              images.unshift(primary)
            }
          }

          const formattedAnimal = {
            ...data,
            category: data.categories?.name || 'Unknown',
            shelter_name: data.shelters?.name || 'Unknown Shelter',
            location: data.shelters?.city || 'Unknown Location',
            images: images
          }
          setAnimal(formattedAnimal)

          // Tambah views_count
          await supabase.rpc('increment_animal_views', { row_id: id }).catch(() => {})

          // Cek apakah difavoritkan
          if (user) {
            const { data: favData } = await supabase
              .from('favorites')
              .select('id')
              .eq('user_id', user.id)
              .eq('animal_id', id)
              .single()
            if (favData) setIsFavorited(true)
          }

          // Fetch similar animals (same category)
          if (data.category_id) {
            const { data: similarData } = await supabase
              .from('animals')
              .select(`
                id, name, breed, age,
                animal_images(image_url, is_primary)
              `)
              .eq('category_id', data.category_id)
              .neq('id', id)
              .limit(3)
            
            if (similarData) {
              setSimilarAnimals(similarData.map(a => ({
                id: a.id,
                name: a.name,
                breed: a.breed,
                age: a.age,
                image: a.animal_images?.[0]?.image_url || images[0]
              })))
            }
          }
        }
      } catch (err) {
        console.error("Error fetching animal details:", err)
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchAnimalDetail()
    }
  }, [id, user])

  const toggleFavorite = async () => {
    if (!user) {
      alert('Silakan login terlebih dahulu untuk menyimpan favorit')
      return
    }

    try {
      if (isFavorited) {
        await supabase
          .from('favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('animal_id', id)
        setIsFavorited(false)
      } else {
        await supabase
          .from('favorites')
          .insert([{ user_id: user.id, animal_id: id }])
        setIsFavorited(true)
      }
    } catch (err) {
      console.error("Error toggling favorite:", err)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-orange"></div>
      </div>
    )
  }

  if (!animal) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🐾</div>
          <h2 className="text-2xl font-bold mb-2">Hewan tidak ditemukan</h2>
          <Link to="/hewan" className="text-brand-orange hover:underline font-semibold">← Kembali ke daftar hewan</Link>
        </div>
      </div>
    )
  }

  const infoItems = [
    { label: 'Jenis', value: animal.category, icon: '🏷️' },
    { label: 'Ras', value: animal.breed || '-', icon: '🧬' },
    { label: 'Umur', value: `${animal.age || 0} tahun`, icon: '🎂' },
    { label: 'Berat', value: `${animal.weight || 0} kg`, icon: '⚖️' },
    { label: 'Warna', value: animal.color || '-', icon: '🎨' },
    { label: 'Gender', value: animal.gender || '-', icon: animal.gender === 'Jantan' ? '♂️' : '♀️' },
    { label: 'Kesehatan', value: animal.health_status || '-', icon: '💊' },
    { label: 'Vaksinasi', value: animal.vaccinated ? 'Sudah' : 'Belum', icon: '💉' },
    { label: 'Lokasi', value: animal.location, icon: '📍' },
    { label: 'Shelter', value: animal.shelter_name, icon: '🏠' },
  ]

  return (
    <div className="min-h-screen pb-16">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <Link to="/" className="hover:text-brand-orange smooth-transition">Beranda</Link>
          <span>/</span>
          <Link to="/hewan" className="hover:text-brand-orange smooth-transition">Hewan</Link>
          <span>/</span>
          <span className="text-gray-800 dark:text-white font-medium">{animal.name}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Image Gallery */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="rounded-3xl overflow-hidden shadow-xl mb-4 aspect-square">
              <img
                src={animal.images[activeImage]}
                alt={animal.name}
                className="w-full h-full object-cover"
              />
            </div>
            {animal.images.length > 1 && (
              <div className="flex gap-3">
                {animal.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={`w-20 h-20 rounded-xl overflow-hidden border-2 smooth-transition ${
                      activeImage === i ? 'border-brand-orange shadow-lg scale-105' : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Detail Info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">{animal.name}</h1>
                <p className="text-gray-500 dark:text-gray-400">{animal.breed}</p>
              </div>
              <span className={`px-4 py-1 rounded-full text-sm font-bold ${
                animal.status === 'available'
                  ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                  : 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
              }`}>
                {animal.status === 'available' ? '✅ Tersedia' : '❌ Sudah Diadopsi'}
              </span>
            </div>

            {/* Quick Stats */}
            <div className="flex gap-6 mb-6 text-sm text-gray-500 dark:text-gray-400">
              <span>👁️ {animal.views_count || 0} dilihat</span>
              <span>❤️ {animal.favorites_count || 0} difavoritkan</span>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-2 gap-3 mb-8">
              {infoItems.map((item, i) => (
                <div key={i} className="bg-gray-50 dark:bg-dark-700 rounded-xl p-3 flex items-center gap-3">
                  <span className="text-xl">{item.icon}</span>
                  <div>
                    <div className="text-xs text-gray-400 dark:text-gray-500">{item.label}</div>
                    <div className="font-semibold text-gray-800 dark:text-white text-sm">{item.value}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Description */}
            <div className="mb-8">
              <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-3">Tentang {animal.name}</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{animal.description || 'Belum ada deskripsi.'}</p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-4 mt-8">
              <div className="flex gap-4">
                {animal.status === 'available' && (
                  <button
                    onClick={() => {
                      if (!user) { alert('Silakan login terlebih dahulu'); return }
                      setShowAdoptionModal(true)
                    }}
                    className="flex-1 py-4 bg-brand-orange text-white rounded-2xl font-bold text-lg hover:bg-brand-yellow shadow-xl hover:shadow-2xl smooth-transition flex items-center justify-center gap-2"
                  >
                    💝 Ajukan Adopsi
                  </button>
                )}
                <button
                  onClick={toggleFavorite}
                  className={`px-6 py-4 rounded-2xl font-bold text-lg smooth-transition border-2 ${
                    isFavorited
                      ? 'bg-brand-pink text-white border-brand-pink shadow-xl'
                      : 'bg-white dark:bg-dark-700 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-dark-600 hover:border-brand-pink hover:text-brand-pink'
                  }`}
                >
                  {isFavorited ? '❤️' : '🤍'}
                </button>
              </div>
              <button
                onClick={handleChat}
                disabled={isChatLoading}
                className="w-full py-3 bg-brand-blue/10 hover:bg-brand-blue/20 text-brand-blue dark:text-brand-teal rounded-2xl font-bold text-md border border-brand-blue/20 smooth-transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isChatLoading ? 'Memproses...' : '💬 Chat dengan Shelter Pemilik'}
              </button>
            </div>
          </motion.div>
        </div>

        {/* Similar Animals */}
        {similarAnimals.length > 0 && (
          <section className="mt-20">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-8">Hewan Serupa</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {similarAnimals.map(a => (
                <Link
                  key={a.id}
                  to={`/hewan/${a.id}`}
                  className="bg-white dark:bg-dark-800 rounded-2xl overflow-hidden shadow-lg border border-gray-100 dark:border-dark-700 group hover:-translate-y-2 smooth-transition"
                >
                  <div className="h-48 overflow-hidden">
                    <img src={a.image} alt={a.name} className="w-full h-full object-cover group-hover:scale-110 smooth-transition duration-500" />
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-gray-800 dark:text-white">{a.name}</h3>
                    <p className="text-sm text-gray-500">{a.breed} · {a.age} tahun</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Adoption Modal */}
      {showAdoptionModal && (
        <AdoptionModal
          animal={animal}
          onClose={() => setShowAdoptionModal(false)}
        />
      )}
    </div>
  )
}
