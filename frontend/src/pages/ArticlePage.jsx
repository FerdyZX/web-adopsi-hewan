import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { supabase } from '../utils/supabaseClient'

export default function ArticlePage() {
  const [selectedCategory, setSelectedCategory] = useState('Semua')
  const [articles, setArticles] = useState([])
  const [categories, setCategories] = useState(['Semua'])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true)
      try {
        const { data, error } = await supabase
          .from('articles')
          .select(`
            id, title, excerpt, thumbnail_url, category, views_count,
            users(name)
          `)
          .eq('published', true)
          .order('created_at', { ascending: false })

        if (error) throw error

        if (data) {
          const formatted = data.map(a => ({
            id: a.id,
            title: a.title,
            excerpt: a.excerpt,
            thumbnail_url: a.thumbnail_url || 'https://images.unsplash.com/photo-1552728089-57168db284ee?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            category: a.category || 'Umum',
            author: a.users?.name || 'Admin',
            views_count: a.views_count || 0
          }))
          setArticles(formatted)

          // Extract unique categories
          const uniqueCats = ['Semua', ...new Set(formatted.map(a => a.category))]
          setCategories(uniqueCats)
        }
      } catch (err) {
        console.error("Error fetching articles:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchArticles()
  }, [])

  const filteredArticles = selectedCategory === 'Semua'
    ? articles
    : articles.filter(a => a.category === selectedCategory)

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative pt-28 pb-16 overflow-hidden" style={{ background: 'linear-gradient(135deg, #8338EC, #FF4D6D)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center text-white">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl sm:text-5xl font-bold mb-4 drop-shadow-md">📚 Artikel Edukasi</h1>
            <p className="text-xl opacity-90 max-w-2xl mx-auto">Pelajari cara merawat hewan peliharaan, tips adopsi, dan informasi seputar konservasi</p>
          </motion.div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 w-full overflow-hidden leading-none">
          <svg className="relative block w-full h-12" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C59.71,118.08,130.83,110.15,189.36,93.41c62.3-17.81,121.4-44.41,180.22-63.53Z" className="fill-current text-white dark:text-dark-900"></path>
          </svg>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="flex flex-wrap gap-3">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2 rounded-full font-semibold text-sm smooth-transition ${
                selectedCategory === cat
                  ? 'bg-brand-purple text-white shadow-lg'
                  : 'bg-gray-100 dark:bg-dark-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-dark-600'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Articles Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-purple"></div>
          </div>
        ) : filteredArticles.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-2xl font-bold text-gray-600 dark:text-gray-400">Belum ada artikel di kategori ini</h3>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredArticles.map((article, i) => (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Link
                  to={`/artikel/${article.id}`}
                  className="block bg-white dark:bg-dark-800 rounded-2xl overflow-hidden shadow-lg border border-gray-100 dark:border-dark-700 group hover:-translate-y-2 smooth-transition h-full"
                >
                  <div className="h-48 overflow-hidden">
                    <img src={article.thumbnail_url} alt={article.title} className="w-full h-full object-cover group-hover:scale-110 smooth-transition duration-500" />
                  </div>
                  <div className="p-6">
                    <span className="inline-block px-3 py-1 bg-brand-purple/10 dark:bg-brand-purple/20 text-brand-purple rounded-full text-xs font-bold mb-3">{article.category}</span>
                    <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2 line-clamp-2 group-hover:text-brand-purple smooth-transition">{article.title}</h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mb-4 line-clamp-2">{article.excerpt}</p>
                    <div className="flex items-center justify-between text-xs text-gray-400">
                      <span>✍️ {article.author}</span>
                      <span>👁️ {article.views_count}</span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
