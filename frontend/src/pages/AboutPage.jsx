import { motion } from 'framer-motion'

export default function AboutPage() {
  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto dark:text-white">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-dark-800 p-8 md:p-12 rounded-3xl shadow-xl"
      >
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-6">Tentang Kami</h1>
        
        <div className="space-y-6 text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
          <p>
            Selamat datang di <strong className="text-brand-orange">Adopt.Me</strong>, platform revolusioner yang didedikasikan untuk menjembatani jarak antara hewan peliharaan yang membutuhkan rumah dan keluarga yang penuh kasih sayang.
          </p>
          
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mt-8 mb-4">Visi Kami</h2>
          <p>
            Menciptakan dunia di mana setiap hewan peliharaan memiliki rumah yang aman, sehat, dan penuh kasih. Kami percaya bahwa adopsi bukan sekadar menyelamatkan nyawa, melainkan juga memperkaya hidup manusia yang mengadopsinya.
          </p>
          
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mt-8 mb-4">Misi Kami</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Menyediakan platform yang mudah diakses bagi shelter hewan untuk mempublikasikan hewan yang siap diadopsi.</li>
            <li>Mengedukasi masyarakat tentang tanggung jawab memelihara hewan.</li>
            <li>Memfasilitasi proses adopsi yang transparan, aman, dan efisien.</li>
            <li>Mendukung komunitas pecinta hewan di seluruh Indonesia melalui donasi dan kampanye kepedulian.</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mt-8 mb-4">Tim Kami</h2>
          <p>
            Di balik Adopt.Me ada tim yang terdiri dari pecinta hewan, dokter hewan sukarelawan, dan teknolog yang memiliki satu tujuan mulia: mengakhiri penelantaran hewan. Kami bekerja erat dengan berbagai shelter lokal terpercaya untuk memastikan setiap data hewan yang ditampilkan valid dan akurat.
          </p>
        </div>
      </motion.div>
    </div>
  )
}
