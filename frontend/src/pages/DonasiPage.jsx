import React from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

export default function DonasiPage() {
  const floatingAnimals = ['🐶', '🐱', '🐰', '🦜', '🐹', '🐢', '🦋', '🐠']

  return (
    <div className="min-h-screen pt-32 pb-20 relative overflow-hidden bg-gradient-to-br from-[#FFE5E5] via-[#FFF1CC] to-[#E5F9FF] dark:from-dark-900 dark:via-dark-800 dark:to-brand-teal/20">
      
      {/* Floating Cartoon Animals Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-40 dark:opacity-20 z-0">
        {floatingAnimals.map((emoji, idx) => (
          <motion.div
            key={idx}
            className="absolute text-5xl md:text-7xl filter drop-shadow-lg"
            initial={{ 
              x: Math.random() * window.innerWidth, 
              y: Math.random() * window.innerHeight 
            }}
            animate={{
              y: [null, Math.random() * -100 - 50, Math.random() * 100 + 50, null],
              x: [null, Math.random() * 100 - 50, Math.random() * -100 + 50, null],
              rotate: [0, 10, -10, 0]
            }}
            transition={{
              duration: Math.random() * 10 + 15,
              repeat: Infinity,
              ease: "linear",
              repeatType: "reverse"
            }}
          >
            {emoji}
          </motion.div>
        ))}
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header Section */}
        <div className="text-center mb-12">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-extrabold text-gray-800 dark:text-white mb-4"
          >
            Dukung Misi Kami 🐾
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"
          >
            Setiap donasi Anda sangat berarti untuk membantu kami menyediakan makanan, perawatan medis, dan tempat yang aman bagi hewan-hewan terlantar.
          </motion.p>
        </div>

        {/* QR Code Section */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-dark-800 rounded-3xl shadow-2xl overflow-hidden max-w-md mx-auto border border-gray-100 dark:border-dark-700"
        >
          <div className="bg-brand-teal p-6 text-center">
            <h2 className="text-2xl font-bold text-white drop-shadow-sm">Donasi via QRIS</h2>
            <p className="text-brand-teal-50 mt-1 font-medium">Gopay, OVO, Dana, ShopeePay, Mobile Banking</p>
          </div>
          
          <div className="p-8 flex flex-col items-center">
            {/* The QR Image */}
            <div className="w-64 h-64 bg-white rounded-3xl overflow-hidden shadow-xl border-4 border-white dark:border-dark-700 mb-6 flex items-center justify-center p-2">
              <img 
                src="/images/qris-donasi.jpeg" 
                alt="QRIS Donasi Adopsi Hewan" 
                className="w-full h-full object-contain rounded-2xl"
                onError={(e) => {
                  e.target.onerror = null; 
                  e.target.src = "https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg";
                }}
              />
            </div>
            
            <div className="text-center">
              <p className="text-gray-800 dark:text-white font-bold text-lg mb-1">Peduli Sesama Makhluk Hidup</p>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">+62 812 **** 5607</p>
              
              <div className="bg-gray-50 dark:bg-dark-700 rounded-xl p-4 text-sm text-gray-600 dark:text-gray-300">
                <p className="font-semibold mb-2">Cara Berdonasi:</p>
                <ol className="text-left list-decimal list-inside space-y-1">
                  <li>Buka aplikasi e-wallet / m-banking Anda.</li>
                  <li>Pilih menu <b>Scan QRIS</b>.</li>
                  <li>Scan kode QR di atas atau upload dari galeri.</li>
                  <li>Masukkan nominal donasi.</li>
                  <li>Selesaikan pembayaran.</li>
                </ol>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Footer Note */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center mt-12 text-gray-500 dark:text-gray-400 font-medium"
        >
          <p>Terima kasih atas kebaikan hati Anda! ❤️</p>
          <Link to="/" className="inline-block mt-4 text-brand-orange hover:text-brand-yellow smooth-transition font-bold">
            &larr; Kembali ke Beranda
          </Link>
        </motion.div>

      </div>
    </div>
  )
}
