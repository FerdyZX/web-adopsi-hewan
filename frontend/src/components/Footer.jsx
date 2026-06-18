import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export default function Footer() {
  const { t } = useTranslation()

  return (
    <footer className="bg-dark-800 dark:bg-dark-900 text-white mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <h3 className="text-xl font-bold gradient-text mb-4">AdopsiHewan</h3>
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
              <li><a href="#" className="text-gray-400 hover:text-white">Tentang Kami</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Hubungi Kami</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">FAQ</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Kebijakan Privasi</a></li>
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

        <div className="border-t border-gray-700 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400">© 2024 AdopsiHewan. Semua hak dilindungi.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white text-sm">Syarat & Ketentuan</a>
              <a href="#" className="text-gray-400 hover:text-white text-sm">Kebijakan Privasi</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
