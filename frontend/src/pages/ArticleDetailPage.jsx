import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { supabase } from '../utils/supabaseClient'

export default function ArticleDetailPage() {
  const { id } = useParams()
  const [article, setArticle] = useState(null)
  const [relatedArticles, setRelatedArticles] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchArticle = async () => {
      setLoading(true)
      try {
        const { data, error } = await supabase
          .from('articles')
          .select(`
            id, title, category, content, thumbnail_url, created_at, views_count,
            users(name)
          `)
          .eq('id', id)
          .single()

        if (error) throw error

        if (data) {
          const formatted = {
            ...data,
            author: data.users?.name || 'Admin',
            thumbnail_url: data.thumbnail_url || 'https://images.unsplash.com/photo-1552728089-57168db284ee?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            date: new Date(data.created_at).toLocaleDateString('id-ID')
          }
          setArticle(formatted)

          // Increment views
          await supabase.rpc('increment_article_views', { row_id: id }).catch(() => {})

          // Fetch related articles
          if (data.category) {
            const { data: related } = await supabase
              .from('articles')
              .select('id, title, category, thumbnail_url, users(name)')
              .eq('category', data.category)
              .neq('id', id)
              .limit(2)

            if (related) {
              setRelatedArticles(related.map(a => ({
                id: a.id,
                title: a.title,
                category: a.category,
                thumbnail_url: a.thumbnail_url || formatted.thumbnail_url,
                author: a.users?.name || 'Admin'
              })))
            }
          }
        }
      } catch (err) {
        console.error("Error fetching article:", err)
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchArticle()
    }
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-purple"></div>
      </div>
    )
  }

  if (!article) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">📝</div>
          <h2 className="text-2xl font-bold mb-2">Artikel tidak ditemukan</h2>
          <Link to="/artikel" className="text-brand-purple hover:underline font-semibold">← Kembali ke daftar artikel</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Hero Image */}
      <div className="relative h-72 sm:h-96 overflow-hidden">
        <img src={article.thumbnail_url} alt={article.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 p-8 max-w-4xl mx-auto">
          <div className="flex items-center gap-2 text-sm text-white/80 mb-3">
            <Link to="/" className="hover:text-white">Beranda</Link>
            <span>/</span>
            <Link to="/artikel" className="hover:text-white">Artikel</Link>
            <span>/</span>
            <span className="text-white">{article.title.substring(0, 30)}...</span>
          </div>
          <span className="inline-block px-3 py-1 bg-brand-purple text-white rounded-full text-xs font-bold mb-3">{article.category}</span>
          <h1 className="text-3xl sm:text-4xl font-bold text-white drop-shadow-lg">{article.title}</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          {/* Author Info */}
          <div className="flex items-center gap-4 mb-8 pb-8 border-b border-gray-200 dark:border-dark-700">
            <div className="w-12 h-12 rounded-full bg-brand-purple/20 flex items-center justify-center text-xl">✍️</div>
            <div>
              <div className="font-bold text-gray-800 dark:text-white">{article.author}</div>
              <div className="text-sm text-gray-500">{article.date} · {article.views_count || 0} views</div>
            </div>
          </div>

          {/* Content */}
          <div className="prose prose-lg dark:prose-invert max-w-none">
            {article.content ? article.content.split('\n\n').map((paragraph, i) => {
              if (paragraph.startsWith('## ')) {
                return <h2 key={i} className="text-2xl font-bold text-gray-800 dark:text-white mt-8 mb-4">{paragraph.replace('## ', '')}</h2>
              }
              if (paragraph.startsWith('- ')) {
                const items = paragraph.split('\n').filter(line => line.startsWith('- '))
                return (
                  <ul key={i} className="list-disc pl-6 space-y-2 mb-6 text-gray-600 dark:text-gray-300">
                    {items.map((item, j) => (
                      <li key={j} dangerouslySetInnerHTML={{ __html: item.replace('- ', '').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                    ))}
                  </ul>
                )
              }
              return <p key={i} className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">{paragraph}</p>
            }) : <p className="text-gray-500 italic">Konten belum tersedia.</p>}
          </div>

          {/* Tags */}
          <div className="mt-12 pt-8 border-t border-gray-200 dark:border-dark-700">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-sm font-semibold text-gray-500">Tags:</span>
              <span className="px-3 py-1 bg-gray-100 dark:bg-dark-700 text-gray-600 dark:text-gray-400 rounded-full text-xs font-medium">{article.category}</span>
              <span className="px-3 py-1 bg-gray-100 dark:bg-dark-700 text-gray-600 dark:text-gray-400 rounded-full text-xs font-medium">Hewan Peliharaan</span>
              <span className="px-3 py-1 bg-gray-100 dark:bg-dark-700 text-gray-600 dark:text-gray-400 rounded-full text-xs font-medium">Edukasi</span>
            </div>
          </div>
        </motion.div>

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <section className="mt-16">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Artikel Terkait</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {relatedArticles.map(a => (
                <Link
                  key={a.id}
                  to={`/artikel/${a.id}`}
                  className="bg-white dark:bg-dark-800 rounded-2xl overflow-hidden shadow-lg border border-gray-100 dark:border-dark-700 group hover:-translate-y-2 smooth-transition flex"
                >
                  <div className="w-32 overflow-hidden">
                    <img src={a.thumbnail_url} alt={a.title} className="w-full h-full object-cover group-hover:scale-110 smooth-transition duration-500" />
                  </div>
                  <div className="p-4 flex-1">
                    <span className="text-xs text-brand-purple font-bold">{a.category}</span>
                    <h3 className="font-bold text-gray-800 dark:text-white text-sm mt-1 line-clamp-2">{a.title}</h3>
                    <p className="text-xs text-gray-500 mt-2">{a.author}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
