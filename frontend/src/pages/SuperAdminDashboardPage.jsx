import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '../utils/supabaseClient'

export default function SuperAdminDashboardPage() {
  const [shelters, setShelters] = useState([])
  const [statsData, setStatsData] = useState({
    users: 0,
    adoptions: 0,
    animals: 0,
    articles: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const [
          { count: usersCount },
          { count: adoptionsCount },
          { count: animalsCount },
          { count: articlesCount },
          { data: sheltersData }
        ] = await Promise.all([
          supabase.from('users').select('*', { count: 'exact', head: true }),
          supabase.from('adoptions').select('*', { count: 'exact', head: true }),
          supabase.from('animals').select('*', { count: 'exact', head: true }),
          supabase.from('articles').select('*', { count: 'exact', head: true }),
          supabase.from('shelters').select('*')
        ])

        setStatsData({
          users: usersCount || 0,
          adoptions: adoptionsCount || 0,
          animals: animalsCount || 0,
          articles: articlesCount || 0
        })

        if (sheltersData) {
          const sheltersWithCounts = await Promise.all(sheltersData.map(async (s) => {
            const { count } = await supabase
              .from('animals')
              .select('*', { count: 'exact', head: true })
              .eq('shelter_id', s.id)
            return { ...s, animal_count: count || 0 }
          }))
          setShelters(sheltersWithCounts)
        }
      } catch (err) {
        console.error("Error fetching super admin data:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const stats = [
    { label: 'Total User', value: statsData.users, icon: '👥', color: 'from-brand-orange to-brand-yellow' },
    { label: 'Total Shelter', value: shelters.length, icon: '🏠', color: 'from-brand-teal to-brand-blue' },
    { label: 'Total Adopsi', value: statsData.adoptions, icon: '💝', color: 'from-brand-pink to-brand-red' },
    { label: 'Total Hewan', value: statsData.animals, icon: '🐾', color: 'from-brand-green to-brand-teal' },
    { label: 'Artikel Published', value: statsData.articles, icon: '📰', color: 'from-brand-purple to-brand-pink' },
    { label: 'Revenue (Donasi)', value: 'Rp 15M', icon: '💰', color: 'from-yellow-500 to-brand-orange' },
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-dark-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-purple"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-brand-purple to-brand-pink px-8 pt-28 pb-12 text-white">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold drop-shadow-md">⚡ Super Admin Dashboard</h1>
          <p className="opacity-90 mt-2">Kontrol penuh terhadap seluruh sistem platform</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`bg-gradient-to-br ${stat.color} rounded-2xl p-6 text-white shadow-xl`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm opacity-90 font-medium">{stat.label}</div>
                  <div className="text-3xl font-bold mt-1">{stat.value}</div>
                </div>
                <div className="text-4xl opacity-80">{stat.icon}</div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* System Management */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-dark-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-dark-700">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">🛡️ Manajemen Shelter</h2>
            <div className="space-y-3">
              {shelters.length === 0 ? (
                <div className="text-gray-500 text-sm">Belum ada shelter terdaftar.</div>
              ) : shelters.map(s => (
                <div key={s.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-dark-700 rounded-xl">
                  <div>
                    <div className="font-semibold text-gray-800 dark:text-white">{s.name}</div>
                    <div className="text-xs text-gray-500">{s.city} · {s.animal_count} hewan</div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${s.verified ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>
                    {s.verified ? '✅ Verified' : '⏳ Pending'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-dark-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-dark-700">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">⚙️ System Settings</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-dark-700 rounded-xl">
                <div>
                  <div className="font-semibold text-gray-800 dark:text-white">Maintenance Mode</div>
                  <div className="text-xs text-gray-500">Nonaktifkan akses publik</div>
                </div>
                <div className="w-12 h-6 bg-gray-300 dark:bg-dark-600 rounded-full relative cursor-pointer">
                  <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 left-0.5 shadow-md"></div>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-dark-700 rounded-xl">
                <div>
                  <div className="font-semibold text-gray-800 dark:text-white">Auto-approve Adopsi</div>
                  <div className="text-xs text-gray-500">Setujui adopsi otomatis</div>
                </div>
                <div className="w-12 h-6 bg-gray-300 dark:bg-dark-600 rounded-full relative cursor-pointer">
                  <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 left-0.5 shadow-md"></div>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-dark-700 rounded-xl">
                <div>
                  <div className="font-semibold text-gray-800 dark:text-white">Email Notifications</div>
                  <div className="text-xs text-gray-500">Kirim notifikasi email</div>
                </div>
                <div className="w-12 h-6 bg-brand-green rounded-full relative cursor-pointer">
                  <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 right-0.5 shadow-md"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
