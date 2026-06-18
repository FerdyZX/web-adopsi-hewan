import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold mb-4">404</h1>
        <p className="text-2xl mb-6">Halaman tidak ditemukan</p>
        <Link to="/" className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">
          Kembali ke Beranda
        </Link>
      </div>
    </div>
  )
}
