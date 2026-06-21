import { motion } from 'framer-motion'
import { useState } from 'react'

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState(0)

  const faqs = [
    {
      q: "Bagaimana cara mengadopsi hewan di Adopt.Me?",
      a: "Anda bisa menelusuri daftar hewan yang tersedia di halaman 'Daftar Hewan'. Jika Anda menemukan hewan yang cocok, klik 'Adopsi Sekarang' pada halaman detail hewan tersebut, lalu isi formulir pengajuan adopsi dengan lengkap. Admin shelter akan mereview pengajuan Anda."
    },
    {
      q: "Apakah adopsi hewan dipungut biaya?",
      a: "Sebagian besar hewan di platform kami dapat diadopsi secara gratis. Namun, beberapa shelter mungkin mengenakan 'Biaya Pengganti' (adoption fee) yang digunakan untuk menutupi biaya vaksinasi awal, sterilisasi, atau perawatan medis hewan tersebut."
    },
    {
      q: "Apa saja syarat untuk bisa mengadopsi hewan?",
      a: "Syarat utama adalah komitmen untuk merawat hewan seumur hidup mereka. Anda juga harus memiliki penghasilan yang stabil untuk biaya pakan dan perawatan, serta mendapatkan izin dari anggota keluarga atau pemilik kos/kontrakan (jika menyewa)."
    },
    {
      q: "Apakah saya bisa mendaftarkan shelter saya ke Adopt.Me?",
      a: "Tentu! Kami sangat terbuka untuk bermitra dengan berbagai shelter dan rescuer terpercaya. Silakan daftar sebagai pengguna, lalu hubungi kami melalui halaman 'Hubungi Kami' untuk proses verifikasi menjadi akun Mitra Shelter."
    },
    {
      q: "Bagaimana jika saya tidak bisa lagi merawat hewan yang saya adopsi?",
      a: "Kami mohon Anda tidak membuang hewan tersebut ke jalanan. Silakan hubungi kembali shelter tempat Anda mengadopsi hewan tersebut. Mereka akan membantu mencari solusi terbaik, termasuk menerima kembali hewan tersebut jika diperlukan."
    }
  ]

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-4">Frequently Asked Questions</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">Pertanyaan yang sering ditanyakan seputar proses adopsi.</p>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, idx) => (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            key={idx} 
            className="bg-white dark:bg-dark-800 rounded-2xl shadow-sm border border-gray-100 dark:border-dark-700 overflow-hidden"
          >
            <button
              onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
              className="w-full px-6 py-4 flex justify-between items-center bg-transparent focus:outline-none"
            >
              <h3 className="font-semibold text-gray-800 dark:text-white text-left">{faq.q}</h3>
              <span className={`text-brand-orange transition-transform duration-300 ${openIndex === idx ? 'rotate-180' : ''}`}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </span>
            </button>
            <div 
              className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${openIndex === idx ? 'max-h-96 pb-4 opacity-100' : 'max-h-0 opacity-0'}`}
            >
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed pt-2 border-t border-gray-100 dark:border-dark-700">
                {faq.a}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
