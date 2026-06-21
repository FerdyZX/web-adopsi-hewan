import { Link, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useTheme } from '../context/ThemeContext'
import { useAuth } from '../context/AuthContext'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '../utils/supabaseClient'
import { toast } from 'react-hot-toast'

export default function Navbar({ isTransparent = true }) {
  const { isDark, toggleTheme } = useTheme()
  const { user, role, shelterId, logout, isShelterAdmin, isSuperAdmin } = useAuth()
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    // Set initial state based on current scroll position
    handleScroll()
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Realtime Chat Notification
  useEffect(() => {
    if (!user || (role !== 'user' && role !== 'admin_shelter')) return;

    let channel;
    const subscribeToChats = async () => {
      // 1. Dapatkan daftar room ID miliknya
      let query = supabase.from('chat_rooms').select('id');
      if (role === 'user') query = query.eq('user_id', user.id);
      if (role === 'admin_shelter') query = query.eq('shelter_id', shelterId || user.id);

      const { data: rooms } = await query;
      const myRoomIds = rooms?.map(r => r.id) || [];

      if (myRoomIds.length === 0) return;

      // 1.5 Fetch current unread messages - extracted to function
      const fetchUnreadCount = async () => {
        const { data: unreadMsgs } = await supabase.from('chat_messages')
          .select('id, room_id, created_at')
          .in('room_id', myRoomIds)
          .eq('read', false)
          .neq('sender_id', user.id);
          
        if (unreadMsgs) {
          const localReceipts = JSON.parse(localStorage.getItem(`chat_read_receipts_${user.id}`) || '{}');
          const actualUnread = unreadMsgs.filter(m => {
            const roomLastRead = localReceipts[m.room_id];
            if (roomLastRead && new Date(m.created_at) <= new Date(roomLastRead)) return false;
            return true;
          });
          setUnreadCount(actualUnread.length);
        }
      };
      
      fetchUnreadCount();

      // Listen to exact update requests
      window.addEventListener('chat_read_updated', fetchUnreadCount);

      // 2. Listen ke semua chat_messages, filter manual
      channel = supabase.channel('navbar-chat-notif')
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'chat_messages' }, payload => {
          const msg = payload.new;
          if (myRoomIds.includes(msg.room_id) && msg.sender_id !== user.id) {
            // Check if user is currently looking at this specific room
            const isCurrentlyViewingRoom = window.location.pathname.startsWith('/chat') && window.currentChatRoomId === msg.room_id;
            
            if (!isCurrentlyViewingRoom) {
              toast('💬 Ada pesan baru masuk!', {
                style: { borderRadius: '10px', background: '#333', color: '#fff' }
              });
              setUnreadCount(prev => prev + 1);
            }
          }
        })
        .subscribe();
        
      // Return cleanup function for the listener inside useEffect
      return () => {
        window.removeEventListener('chat_read_updated', fetchUnreadCount);
      };
    }

    subscribeToChats();

    return () => {
      if (channel) supabase.removeChannel(channel);
    }
  }, [user, role, shelterId]);

  // Legacy event listener removed because we now use chat_read_updated in the main useEffect

  const handleLogout = async () => {
    try {
      await logout()
      navigate('/')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const menuItems = [
    { label: t('nav.home'), href: '/' },
    { label: t('nav.animals'), href: '/hewan' },
    { label: t('nav.shelters'), href: '/shelter' },
    { label: t('nav.articles'), href: '/artikel' },
    { label: 'Donasi', href: '/donasi' },
  ]

  // Dynamic styling logic
  const useLightText = isDark || (isTransparent && !scrolled)
  
  const navBgClass = (isTransparent && !scrolled)
    ? 'bg-transparent'
    : 'bg-white/90 dark:bg-dark-900/95 backdrop-blur-md shadow-sm dark:shadow-xl'

  const textPrimary = useLightText ? 'text-white' : 'text-gray-800'
  const textSecondary = useLightText ? 'text-white/90' : 'text-gray-600'
  const textHover = useLightText ? 'hover:text-brand-yellow' : 'hover:text-brand-orange'
  const iconBtnBg = useLightText 
    ? 'bg-white/10 hover:bg-white/20 text-white' 
    : 'bg-gray-100 hover:bg-gray-200 text-gray-600'

  return (
    <nav className={`fixed w-full top-0 left-0 z-50 transition-all duration-300 ${navBgClass}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-brand-pink rounded-lg flex items-center justify-center shadow-sm">
              <span className="text-white font-bold">🐾</span>
            </div>
            <span className={`text-xl font-bold transition-colors drop-shadow-sm ${textPrimary}`}>Adopt.Me</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={`font-medium transition-colors drop-shadow-sm ${textSecondary} ${textHover}`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Right Side */}
          <div className="flex items-center space-x-4">
            
            {/* Global Chat Icon (Only for User & Shelter Admin) */}
            {user && (role === 'user' || role === 'admin_shelter') && (
              <Link to="/chat" className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-700 transition">
                <span className="text-xl">💬</span>
                {unreadCount > 0 && (
                  <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-red-600 rounded-full">
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </span>
                )}
              </Link>
            )}

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg transition-colors backdrop-blur-sm ${iconBtnBg}`}
            >
              {isDark ? '☀️' : '🌙'}
            </button>

            {/* Auth Buttons */}
            {!user ? (
              <>
                <Link
                  to="/login"
                  className={`hidden sm:inline-block px-4 py-2 rounded-lg transition-colors font-medium backdrop-blur-sm ${
                    useLightText 
                      ? 'text-white/90 hover:text-white hover:bg-white/10' 
                      : 'text-gray-600 hover:text-brand-orange hover:bg-gray-100'
                  }`}
                >
                  {t('auth.login')}
                </Link>
                <Link
                  to="/register"
                  className="px-5 py-2 rounded-full bg-brand-pink text-white hover:bg-brand-red font-semibold shadow-md hover:shadow-lg transition-all"
                >
                  {t('auth.register')}
                </Link>
              </>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors backdrop-blur-sm shadow-sm ${
                    useLightText 
                      ? 'bg-white/10 hover:bg-white/20 text-white' 
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                  }`}
                >
                  <span className="text-sm font-medium">
                    {user?.email}
                  </span>
                  <svg className={`w-4 h-4 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-52 bg-white dark:bg-dark-800 rounded-xl shadow-xl border border-gray-100 dark:border-dark-700 overflow-hidden z-50"
                    >
                      <Link to="/dashboard" onClick={() => setDropdownOpen(false)} className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-dark-700 text-gray-700 dark:text-gray-300 transition-colors">
                        <span>👤</span> {t('dashboard.title')}
                      </Link>
                      <Link to="/favorit" onClick={() => setDropdownOpen(false)} className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-dark-700 text-gray-700 dark:text-gray-300 transition-colors">
                        <span>❤️</span> {t('favorites.title')}
                      </Link>
                      <Link to="/riwayat-adopsi" onClick={() => setDropdownOpen(false)} className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-dark-700 text-gray-700 dark:text-gray-300 transition-colors">
                        <span>📋</span> Riwayat Adopsi
                      </Link>
                      {isShelterAdmin && (
                        <Link to="/mitra-dashboard" onClick={() => setDropdownOpen(false)} className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-dark-700 text-gray-700 dark:text-gray-300 transition-colors">
                          <span>🏠</span> Mitra Dashboard
                        </Link>
                      )}
                      {isSuperAdmin && (
                        <Link to="/admin" onClick={() => setDropdownOpen(false)} className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-dark-700 text-gray-700 dark:text-gray-300 transition-colors">
                          <span>⚡</span> Super Admin
                        </Link>
                      )}
                      <div className="border-t border-gray-100 dark:border-dark-700"></div>
                      <button
                        onClick={() => { handleLogout(); setDropdownOpen(false) }}
                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 transition-colors text-left"
                      >
                        <span>🚪</span> {t('auth.logout')}
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`md:hidden p-2 rounded-lg ${iconBtnBg}`}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'} />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden overflow-hidden bg-white dark:bg-dark-900 rounded-b-2xl shadow-xl mt-2 mx-[-1rem] px-4 border-t border-gray-100 dark:border-dark-800"
            >
              <div className="pb-4 pt-2 space-y-2">
                {menuItems.map((item) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    onClick={() => setIsOpen(false)}
                    className="block px-4 py-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-800 hover:text-brand-orange dark:hover:text-white transition-colors font-medium"
                  >
                    {item.label}
                  </Link>
                ))}
                {user && (
                  <>
                    <div className="border-t border-gray-100 dark:border-dark-800 my-2"></div>
                    <Link to="/dashboard" onClick={() => setIsOpen(false)} className="block px-4 py-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-800 font-medium">👤 Dashboard</Link>
                    <Link to="/favorit" onClick={() => setIsOpen(false)} className="block px-4 py-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-800 font-medium">❤️ Favorit</Link>
                    <Link to="/riwayat-adopsi" onClick={() => setIsOpen(false)} className="block px-4 py-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-800 font-medium">📋 Riwayat</Link>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  )
}
