import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'

export default function HomePage() {
  const { t } = useTranslation()

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="text-5xl sm:text-6xl font-bold mb-6 gradient-text">
              Berikan Rumah untuk Mereka
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
              Platform adopsi hewan yang menghubungkan shelter, komunitas pecinta hewan, dan individu yang ingin mengadopsi.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-3 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 smooth-transition">
                Lihat Hewan
              </button>
              <button className="px-8 py-3 bg-gray-200 dark:bg-dark-800 text-gray-900 dark:text-white rounded-lg font-semibold hover:bg-gray-300 dark:hover:bg-dark-700 smooth-transition">
                Pelajari Lebih Lanjut
              </button>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-16"
          >
            {[
              { label: 'Total Hewan', value: '1,234' },
              { label: 'Total Shelter', value: '45' },
              { label: 'Adopsi Berhasil', value: '562' },
              { label: 'Menunggu Adopsi', value: '189' },
            ].map((stat, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -5 }}
                className="glass soft-shadow p-6 rounded-xl text-center"
              >
                <div className="text-3xl font-bold text-green-500 mb-2">{stat.value}</div>
                <div className="text-gray-600 dark:text-gray-400">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-dark-800">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center">Kategori Hewan</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {['Kucing', 'Anjing', 'Burung', 'Kelinci', 'Hamster', 'Ikan', 'Reptil', 'Eksotis', 'Langka', 'Dilindungi', 'Laut', 'Ternak'].map((category, i) => (
              <motion.button
                key={i}
                whileHover={{ scale: 1.05 }}
                className="glass soft-shadow p-4 rounded-lg font-semibold hover:bg-green-500 hover:text-white smooth-transition"
              >
                {category}
              </motion.button>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
