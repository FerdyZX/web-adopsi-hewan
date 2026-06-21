import { motion } from 'framer-motion'

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto dark:text-white">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-dark-800 p-8 md:p-12 rounded-3xl shadow-xl prose prose-brand dark:prose-invert max-w-none"
      >
        <h1 className="text-3xl font-extrabold mb-8 text-gray-900 dark:text-white">Kebijakan Privasi</h1>
        <p className="text-gray-500 mb-8">Terakhir diperbarui: 21 Juni 2026</p>

        <p className="text-gray-600 dark:text-gray-300">
          Privasi Anda sangat penting bagi kami. Kebijakan Privasi ini menjelaskan bagaimana Adopt.Me mengumpulkan, menggunakan, dan melindungi informasi pribadi Anda saat Anda menggunakan website dan layanan kami.
        </p>

        <h3 className="text-xl font-bold mt-8 mb-4 text-gray-800 dark:text-white">1. Informasi yang Kami Kumpulkan</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          Kami dapat mengumpulkan informasi pribadi yang Anda berikan secara langsung kepada kami, seperti:
        </p>
        <ul className="list-disc pl-6 text-gray-600 dark:text-gray-300 space-y-2 mb-6">
          <li>Nama lengkap dan informasi kontak (email, nomor telepon).</li>
          <li>Data profil pengguna dan histori adopsi hewan.</li>
          <li>Informasi formulir pengajuan adopsi yang mungkin mencakup detail kondisi rumah dan kesiapan finansial.</li>
          <li>Pesan komunikasi yang dikirim melalui fitur chat kami.</li>
        </ul>

        <h3 className="text-xl font-bold mt-8 mb-4 text-gray-800 dark:text-white">2. Penggunaan Informasi</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          Informasi yang kami kumpulkan digunakan untuk:
        </p>
        <ul className="list-disc pl-6 text-gray-600 dark:text-gray-300 space-y-2 mb-6">
          <li>Memfasilitasi proses adopsi antara calon adopter dan shelter/rescuer.</li>
          <li>Menyediakan layanan chat dan komunikasi antar pengguna platform.</li>
          <li>Mengirimkan notifikasi terkait status adopsi atau pesan baru.</li>
          <li>Meningkatkan kualitas dan keamanan layanan website kami.</li>
        </ul>

        <h3 className="text-xl font-bold mt-8 mb-4 text-gray-800 dark:text-white">3. Keamanan Data</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Kami menerapkan langkah-langkah keamanan teknis yang wajar untuk melindungi informasi Anda dari akses, penggunaan, atau pengungkapan yang tidak sah. Data pengguna disimpan menggunakan infrastruktur Supabase yang terenkripsi secara aman.
        </p>

        <h3 className="text-xl font-bold mt-8 mb-4 text-gray-800 dark:text-white">4. Berbagi Informasi dengan Pihak Ketiga</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Kami <strong>tidak akan pernah</strong> menjual atau menyewakan informasi pribadi Anda kepada pihak ketiga. Informasi Anda hanya akan dibagikan kepada Shelter Mitra ketika Anda secara aktif mengajukan formulir adopsi ke shelter tersebut.
        </p>

        <h3 className="text-xl font-bold mt-8 mb-4 text-gray-800 dark:text-white">5. Hak Anda</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Anda berhak untuk meminta penghapusan akun dan seluruh data pribadi yang terkait dengannya. Jika Anda ingin melakukannya, silakan hubungi kami melalui halaman Kontak.
        </p>
      </motion.div>
    </div>
  )
}
