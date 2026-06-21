import { motion } from 'framer-motion'
import { useState } from 'react'

export default function ContactPage() {
  const [isSent, setIsSent] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    // Simulate sending message
    setIsSent(true)
    setTimeout(() => setIsSent(false), 3000)
  }

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col md:flex-row gap-8">
      {/* Contact Info */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="w-full md:w-1/3 space-y-6"
      >
        <div className="bg-white dark:bg-dark-800 p-8 rounded-3xl shadow-xl h-full">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-6">Hubungi Kami</h1>
          <p className="text-gray-600 dark:text-gray-300 mb-8">
            Punya pertanyaan seputar adopsi, donasi, atau ingin bermitra dengan kami? Jangan ragu untuk menghubungi kami melalui informasi di bawah ini.
          </p>
          
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-brand-orange/20 flex items-center justify-center text-xl shrink-0">📍</div>
              <div>
                <h3 className="font-bold text-gray-800 dark:text-white">Alamat Kantor</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">Jl. Satwa Harapan No. 123<br/>Bandung, Jawa Barat 40123</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-brand-blue/20 flex items-center justify-center text-xl shrink-0">✉️</div>
              <div>
                <h3 className="font-bold text-gray-800 dark:text-white">Email</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">support@adopt.me.id<br/>partnership@adopt.me.id</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center text-xl shrink-0">📞</div>
              <div>
                <h3 className="font-bold text-gray-800 dark:text-white">Telepon / WhatsApp</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">+62 811-2233-4455<br/>(Senin - Jumat, 09:00 - 17:00 WIB)</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Contact Form */}
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="w-full md:w-2/3"
      >
        <div className="bg-white dark:bg-dark-800 p-8 md:p-10 rounded-3xl shadow-xl">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Kirimkan Pesan</h2>
          
          {isSent ? (
            <div className="p-4 bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-xl font-medium flex items-center gap-3 animate-pulse">
              <span>✅</span> Pesan Anda berhasil dikirim! Kami akan segera merespons.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Nama Lengkap</label>
                  <input required type="text" className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-dark-600 bg-gray-50 dark:bg-dark-700 outline-none focus:ring-2 focus:ring-brand-orange transition-all" placeholder="John Doe" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Alamat Email</label>
                  <input required type="email" className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-dark-600 bg-gray-50 dark:bg-dark-700 outline-none focus:ring-2 focus:ring-brand-orange transition-all" placeholder="john@example.com" />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Subjek / Topik</label>
                <select className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-dark-600 bg-gray-50 dark:bg-dark-700 outline-none focus:ring-2 focus:ring-brand-orange transition-all text-gray-600 dark:text-gray-300">
                  <option>Pertanyaan Umum</option>
                  <option>Bantuan Adopsi</option>
                  <option>Kemitraan Shelter</option>
                  <option>Donasi</option>
                  <option>Lainnya</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Isi Pesan</label>
                <textarea required rows="5" className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-dark-600 bg-gray-50 dark:bg-dark-700 outline-none focus:ring-2 focus:ring-brand-orange transition-all resize-none" placeholder="Tuliskan pesan Anda di sini..."></textarea>
              </div>
              
              <button type="submit" className="px-8 py-3 bg-brand-orange text-white font-bold rounded-xl shadow-lg hover:bg-brand-yellow hover:shadow-xl transition-all w-full md:w-auto">
                Kirim Pesan Sekarang
              </button>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  )
}
