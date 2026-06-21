import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export default function Footer() {
  const { t } = useTranslation()

  return (
    <footer className="bg-dark-900 dark:bg-dark-950 text-white mt-0">
      {/* Curved Top Decor */}
      <div className="w-full overflow-hidden leading-none rotate-180 mb-[-1px]">
        <svg className="relative block w-full h-12" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C59.71,118.08,130.83,110.15,189.36,93.41c62.3-17.81,121.4-44.41,180.22-63.53Z" className="fill-current text-[#ece8e3] dark:text-dark-800"></path>
        </svg>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="flex flex-col items-start">
            <Link to="/" className="flex items-center space-x-2 mb-6">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg">
                <span className="text-brand-pink font-bold text-2xl">🐾</span>
              </div>
              <span className="text-2xl font-bold text-white tracking-wide">Adopt.Me</span>
            </Link>
            <p className="text-gray-400">
              Platform adopsi hewan yang menghubungkan shelter, komunitas pecinta hewan, dan individu yang ingin mengadopsi.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold mb-4">Navigasi</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-400 hover:text-white">Beranda</Link></li>
              <li><Link to="/hewan" className="text-gray-400 hover:text-white">Daftar Hewan</Link></li>
              <li><Link to="/shelter" className="text-gray-400 hover:text-white">Shelter</Link></li>
              <li><Link to="/artikel" className="text-gray-400 hover:text-white">Artikel</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold mb-4">Dukungan</h4>
            <ul className="space-y-2">
              <li><Link to="/tentang-kami" className="text-gray-400 hover:text-white">Tentang Kami</Link></li>
              <li><Link to="/hubungi-kami" className="text-gray-400 hover:text-white">Hubungi Kami</Link></li>
              <li><Link to="/faq" className="text-gray-400 hover:text-white">FAQ</Link></li>
              <li><Link to="/kebijakan-privasi" className="text-gray-400 hover:text-white">Kebijakan Privasi</Link></li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-semibold mb-4">Ikuti Kami</h4>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 rounded-full bg-gray-700 hover:bg-green-500 flex items-center justify-center smooth-transition">
                f
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-700 hover:bg-green-500 flex items-center justify-center smooth-transition">
                🐦
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-700 hover:bg-green-500 flex items-center justify-center smooth-transition">
                📷
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/20 pt-8 mt-12">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-white/80">© 2024 Adopt.Me. Semua hak dilindungi.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white text-sm">Syarat & Ketentuan</a>
              <Link to="/kebijakan-privasi" className="text-gray-400 hover:text-white text-sm">Kebijakan Privasi</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
