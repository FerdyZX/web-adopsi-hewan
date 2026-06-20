import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { supabase } from '../utils/supabaseClient'

export default function HomePage() {
  const { t } = useTranslation()
  const [categories, setCategories] = useState([])
  const [featuredAnimals, setFeaturedAnimals] = useState([])
  const [stats, setStats] = useState([
    { label: 'dogs', value: '0', icon: '🐶' },
    { label: 'cats', value: '0', icon: '🐱' },
    { label: 'capacity', value: '100', icon: '🏠' },
    { label: 'adopted', value: '0', icon: '❤️' },
  ])
  const [heroBanner, setHeroBanner] = useState('/images/hero.png')
  const [recentArticles, setRecentArticles] = useState([])
  const [loading, setLoading] = useState(true)

  // Default Categories Fallback
  const defaultCategories = [
    { name: 'Kucing', icon: '🐱', color: 'bg-brand-teal' },
    { name: 'Anjing', icon: '🐶', color: 'bg-brand-green' },
    { name: 'Hewan Langka', icon: '🦊', color: 'bg-brand-blue' },
    { name: 'Reptil', icon: '🦎', color: 'bg-blue-400' },
    { name: 'Burung', icon: '🦜', color: 'bg-brand-purple' },
    { name: 'Ikan', icon: '🐠', color: 'bg-brand-pink' },
  ]

  useEffect(() => {
    const fetchHomeData = async () => {
      setLoading(true)
      
      try {
        // Fetch categories (ambil 6 teratas)
        const { data: catData, error: catError } = await supabase
          .from('categories')
          .select('name, icon')
          .limit(6)
        
        if (!catError && catData && catData.length > 0) {
          // Map color based on index
          const colors = ['bg-brand-teal', 'bg-brand-green', 'bg-brand-blue', 'bg-blue-400', 'bg-brand-purple', 'bg-brand-pink']
          const mappedCategories = catData.map((c, i) => ({
            name: c.name,
            icon: c.icon || '🐾',
            color: colors[i % colors.length]
          }))
          setCategories(mappedCategories)
        } else {
          setCategories(defaultCategories)
        }

        // Fetch featured animals (6 terbaru)
        const { data: animalData, error: animalError } = await supabase
          .from('animals')
          .select(`
            id, name, breed,
            animal_images(image_url, is_primary)
          `)
          .eq('status', 'available')
          .order('created_at', { ascending: false })
          .limit(6)
          
        if (!animalError && animalData) {
          const formattedAnimals = animalData.map(animal => {
            // Cari gambar primary, jika tidak ada pakai gambar pertama, jika tidak ada pakai fallback
            let imageUrl = 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
            if (animal.animal_images && animal.animal_images.length > 0) {
              const primaryImage = animal.animal_images.find(img => img.is_primary)
              imageUrl = primaryImage ? primaryImage.image_url : animal.animal_images[0].image_url
            }
            return {
              id: animal.id,
              name: animal.name,
              type: animal.breed || 'Unknown',
              image: imageUrl
            }
          })
          setFeaturedAnimals(formattedAnimals)
        }

        // Fetch Stats
        const { count: dogsCount } = await supabase.from('animals').select('id', { count: 'exact' }).eq('category_id', 2)
        const { count: catsCount } = await supabase.from('animals').select('id', { count: 'exact' }).eq('category_id', 1)
        const { count: adoptedCount } = await supabase.from('animals').select('id', { count: 'exact' }).eq('status', 'adopted')
        
        setStats([
          { label: 'dogs', value: (dogsCount || 0).toString(), icon: '🐶' },
          { label: 'cats', value: (catsCount || 0).toString(), icon: '🐱' },
          { label: 'capacity', value: '100', icon: '🏠' },
          { label: 'adopted', value: (adoptedCount || 0).toString(), icon: '❤️' },
        ])

        // Fetch Hero Banner
        const { data: settingsData } = await supabase.from('settings').select('value').eq('key', 'hero_banner').single()
        if (settingsData && settingsData.value && settingsData.value.url) {
          setHeroBanner(settingsData.value.url)
        }

        // Fetch Recent Articles (3 terbaru)
        const { data: articlesData } = await supabase
          .from('articles')
          .select('id, title, thumbnail_url')
          .order('created_at', { ascending: false })
          .limit(3)
          
        if (articlesData) {
          setRecentArticles(articlesData)
        }
      } catch (err) {
        console.error("Error fetching home data:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchHomeData()
  }, [])

  return (
    <div className="min-h-screen">
      {/* Vibrant Hero Section */}
      <section className="relative pt-28 pb-32 overflow-hidden vibrant-hero">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row items-center">
            {/* Text Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:w-1/2 text-center lg:text-left mb-12 lg:mb-0"
            >
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 drop-shadow-md">
                Temukan Sahabat Barumu
              </h1>
              <p className="text-xl sm:text-2xl mb-8 opacity-90 max-w-2xl mx-auto lg:mx-0 font-medium">
                Ada banyak hewan lucu di shelter kami yang menunggu kasih sayangmu. Bantu mereka menemukan keluarga dan rumah baru!
              </p>
              <div className="flex justify-center lg:justify-start">
                <Link to="/hewan" className="px-8 py-4 bg-white text-brand-orange rounded-full font-bold text-lg hover:bg-gray-100 shadow-xl hover:shadow-2xl smooth-transition">
                  Mulai Adopsi
                </Link>
              </div>
            </motion.div>
            
            {/* Image Content */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="lg:w-1/2 flex justify-center lg:justify-end relative"
            >
              <img 
                src={heroBanner} 
                alt="Cute Pet" 
                className="w-full max-w-md lg:max-w-xl object-contain drop-shadow-2xl z-10"
                style={{ maxHeight: '500px' }}
                onError={(e) => {
                  e.target.onerror = null; 
                  e.target.src = 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80';
                }}
              />
            </motion.div>
          </div>
        </div>

        {/* Decorative Wave/Shape at bottom */}
        <div className="absolute bottom-0 left-0 right-0 w-full overflow-hidden leading-none">
          <svg className="relative block w-full h-16 sm:h-24" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C59.71,118.08,130.83,110.15,189.36,93.41c62.3-17.81,121.4-44.41,180.22-63.53Z" className="fill-current text-white dark:text-dark-900"></path>
          </svg>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="relative z-20 -mt-16 sm:-mt-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <Link to="/hewan" className="bg-white dark:bg-dark-800 rounded-3xl p-6 text-center shadow-xl hover:-translate-y-2 smooth-transition border border-gray-100 dark:border-dark-700">
            <div className="text-4xl mb-4">💝</div>
            <h3 className="text-xl font-bold text-gray-800 dark:text-white">Adopsi Hewan</h3>
          </Link>
          <Link to="/shelter" className="bg-white dark:bg-dark-800 rounded-3xl p-6 text-center shadow-xl hover:-translate-y-2 smooth-transition border border-gray-100 dark:border-dark-700">
            <div className="text-4xl mb-4">🤝</div>
            <h3 className="text-xl font-bold text-gray-800 dark:text-white">Jadi Relawan</h3>
          </Link>
          <Link to="/donasi" className="bg-white dark:bg-dark-800 rounded-3xl p-6 text-center shadow-xl hover:-translate-y-2 smooth-transition border border-gray-100 dark:border-dark-700">
            <div className="text-4xl mb-4">💰</div>
            <h3 className="text-xl font-bold text-gray-800 dark:text-white">Berdonasi</h3>
          </Link>
        </div>
      </section>

      {/* Colorful Categories Bar */}
      <section className="py-16">
        <div className="w-full flex flex-wrap md:flex-nowrap">
          {categories.map((cat, idx) => (
            <Link 
              to={`/hewan?category=${cat.name}`} 
              key={idx} 
              className={`w-1/3 md:flex-1 flex flex-col items-center justify-center p-6 ${cat.color} text-white hover:opacity-90 smooth-transition min-h-[140px] border-r border-white/20`}
            >
              <div className="text-4xl md:text-5xl mb-2 drop-shadow-md">{cat.icon}</div>
              <span className="font-bold text-sm md:text-lg text-center">{cat.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Who are waiting for You? */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-dark-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">Siapa yang menunggu Anda?</h2>
            <p className="text-gray-500 dark:text-gray-400">Klik pada foto hewan untuk mengetahui profil lengkapnya.</p>
          </div>
          
          {loading ? (
            <div className="flex justify-center p-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-orange"></div>
            </div>
          ) : featuredAnimals.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredAnimals.map((animal) => (
                <Link key={animal.id} to={`/hewan/${animal.id}`}>
                  <motion.div
                    whileHover={{ y: -10 }}
                    className="bg-white dark:bg-dark-800 rounded-[2rem] overflow-hidden shadow-lg border border-gray-100 dark:border-dark-700 group cursor-pointer h-full flex flex-col"
                  >
                    <div className="h-64 overflow-hidden relative">
                      <div className="absolute inset-0 bg-brand-yellow/20 group-hover:bg-transparent z-10 smooth-transition"></div>
                      <img src={animal.image} alt={animal.name} className="w-full h-full object-cover group-hover:scale-110 smooth-transition duration-500" />
                    </div>
                    <div className="p-6 text-center flex-1 flex flex-col justify-center">
                      <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-1">{animal.name}</h3>
                      <p className="text-gray-500 font-medium text-sm">{animal.type}</p>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              Belum ada hewan yang tersedia untuk diadopsi saat ini.
            </div>
          )}

          <div className="mt-12 text-center">
            <Link to="/hewan" className="inline-block px-10 py-3 bg-[#c9b794] text-white rounded-full font-bold hover:bg-[#b09e7d] smooth-transition shadow-md">
              Lihat Semua Hewan
            </Link>
          </div>
        </div>
      </section>

      {/* Call to action & Articles */}
      <section className="flex flex-col lg:flex-row w-full">
        {/* Yellow Box */}
        <div className="w-full lg:w-1/4 bg-brand-yellow p-12 text-white flex flex-col justify-center">
          <h3 className="text-xl font-bold mb-4 opacity-90 drop-shadow-sm">KATA MUTIARA</h3>
          <p className="text-lg leading-relaxed font-bold drop-shadow-sm">Mengadopsi hewan adalah seperti membuka hadiah yang tak pernah berhenti memberi kebahagiaan.</p>
        </div>
        {/* Article 1 Area */}
        <Link to={recentArticles[0] ? `/artikel/${recentArticles[0].id}` : "/artikel"} className="w-full lg:w-1/4 h-80 lg:h-auto relative group overflow-hidden cursor-pointer block bg-gray-200 dark:bg-dark-700">
          <img src={recentArticles[0]?.thumbnail_url || "https://images.unsplash.com/photo-1552728089-57168db284ee?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"} alt={recentArticles[0]?.title || "Artikel 1"} className="w-full h-full object-cover group-hover:scale-110 smooth-transition duration-500" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-8">
            <h3 className="text-white font-bold text-xl mb-1 drop-shadow-md">{recentArticles[0]?.title || "Tips merawat burung peliharaan"}</h3>
            <span className="text-white/90 text-sm font-semibold">baca artikel</span>
          </div>
        </Link>
        {/* Two smaller blocks */}
        <div className="w-full lg:w-1/2 flex flex-col">
          <div className="flex flex-col sm:flex-row h-1/2">
            <Link to={recentArticles[1] ? `/artikel/${recentArticles[1].id}` : "/artikel"} className="w-full sm:w-1/2 h-64 sm:h-auto relative group overflow-hidden cursor-pointer block bg-gray-300 dark:bg-dark-600">
              <img src={recentArticles[1]?.thumbnail_url || "https://images.unsplash.com/photo-1559828456-a496b055d7f1?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"} alt={recentArticles[1]?.title || "Artikel 2"} className="w-full h-full object-cover group-hover:scale-110 smooth-transition duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-6">
                <h3 className="text-white font-bold text-lg mb-1 drop-shadow-md">{recentArticles[1]?.title || "Hewan Eksotis 101"}</h3>
                <span className="text-white/90 text-sm font-semibold">baca artikel</span>
              </div>
            </Link>
            <Link to={recentArticles[2] ? `/artikel/${recentArticles[2].id}` : "/artikel"} className="w-full sm:w-1/2 h-64 sm:h-auto relative group overflow-hidden cursor-pointer block bg-gray-400 dark:bg-dark-500">
              <img src={recentArticles[2]?.thumbnail_url || "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"} alt={recentArticles[2]?.title || "Artikel 3"} className="w-full h-full object-cover group-hover:scale-110 smooth-transition duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-6">
                <h3 className="text-white font-bold text-lg mb-1 drop-shadow-md">{recentArticles[2]?.title || "Dasar pelatihan anak anjing"}</h3>
                <span className="text-white/90 text-sm font-semibold">baca artikel</span>
              </div>
            </Link>
          </div>
          {/* Testimonial Box */}
          <div className="h-1/2 bg-brand-pink p-12 flex flex-col justify-center text-white">
            <h3 className="text-2xl font-bold mb-4 drop-shadow-sm">Testimonial</h3>
            <p className="text-xl italic mb-6 font-medium drop-shadow-sm">"Menemukan Layla lewat platform ini mengubah hidup saya. Prosesnya cepat dan komunitasnya sangat membantu."</p>
            <span className="font-bold opacity-90 drop-shadow-sm">- Maria Bernares</span>
          </div>
        </div>
      </section>

      {/* Our Statistic */}
      <section className="py-20 bg-[#ece8e3] dark:bg-dark-800 text-center">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-gray-800 dark:text-white mb-16">Statistik Kami</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className="w-32 h-32 rounded-full bg-white dark:bg-dark-700 shadow-xl flex items-center justify-center text-5xl mb-6 border-4 border-white dark:border-dark-600 hover:scale-110 smooth-transition">
                  {stat.icon}
                </div>
                <div className="text-4xl font-bold text-gray-800 dark:text-white mb-2">{stat.value}</div>
                <div className="text-gray-500 dark:text-gray-400 font-medium capitalize">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
