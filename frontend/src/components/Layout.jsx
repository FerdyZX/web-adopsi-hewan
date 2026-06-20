import { Outlet, useLocation } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'

export default function Layout() {
  const location = useLocation()

  // Halaman yang TIDAK memiliki hero section / gambar di atas
  // Halaman-halaman ini butuh padding top agar tidak tertutup navbar transparan
  const isFullScreenApp = location.pathname === '/chat'
  const isDashboard = ['/admin', '/superadmin', '/mitra-dashboard'].includes(location.pathname)

  // Halaman yang TIDAK memiliki hero section / gambar di atas
  const needsPadding = [
    '/chat', 
    '/login', 
    '/register'
  ].includes(location.pathname) || location.pathname.match(/^\/hewan\/[a-zA-Z0-9_-]+$/) || isDashboard

  return (
    <div className={`flex flex-col bg-white dark:bg-dark-900 ${isFullScreenApp ? 'h-screen overflow-hidden' : 'min-h-screen'}`}>
      <Navbar isTransparent={!needsPadding} />
      <main className={`flex-1 flex flex-col min-h-0 ${isFullScreenApp || isDashboard ? 'pt-16' : needsPadding ? 'pt-24' : ''}`}>
        <Outlet />
      </main>
      {!isFullScreenApp && <Footer />}
    </div>
  )
}
