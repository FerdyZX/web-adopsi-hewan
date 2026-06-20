import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '../utils/supabaseClient'
import { toast } from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'

export default function ShelterAdminDashboardPage() {
  const { shelterId, user } = useAuth()
  const [activeMenu, setActiveMenu] = useState('overview')
  const [loading, setLoading] = useState(true)
  
  // Real States from Supabase
  const [animals, setAnimals] = useState([])
  const [categories, setCategories] = useState([])
  const [adoptions, setAdoptions] = useState([])

  // Modals Visibility & Editing states
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingAnimal, setEditingAnimal] = useState(null)

  const menuItems = [
    { id: 'overview', label: 'Overview Shelter', icon: '📊' },
    { id: 'animals', label: 'Kelola Hewan', icon: '🐾' },
    { id: 'adoptions', label: 'Verifikasi Adopsi', icon: '✅' },
  ]

  const stats = [
    { label: 'Total Hewan', value: animals.length, icon: '🐾', color: 'from-brand-orange to-brand-yellow' },
    { label: 'Total Adopsi Disetujui', value: adoptions.filter(a => a.status === 'approved').length, icon: '💝', color: 'from-brand-pink to-brand-red' },
    { label: 'Menunggu Verifikasi', value: adoptions.filter(a => a.status === 'pending').length, icon: '⏳', color: 'from-brand-teal to-brand-blue' },
  ]

  useEffect(() => {
    if (shelterId) {
      fetchData()
    } else {
      setLoading(false)
      toast.error('Akun Anda belum terhubung dengan shelter mana pun.')
    }
  }, [shelterId])

  const fetchData = async () => {
    setLoading(true)
    try {
      const [
        { data: animalsData },
        { data: catData },
        { data: adoptionsData }
      ] = await Promise.all([
        supabase.from('animals').select('*, categories(name), animal_images(id, image_url)').eq('shelter_id', shelterId).order('created_at', { ascending: false }),
        supabase.from('categories').select('*').order('id', { ascending: true }),
        supabase.from('adoptions').select('*, users(name, email), animals(name)').eq('shelter_id', shelterId).order('created_at', { ascending: false })
      ])

      if (animalsData) setAnimals(animalsData)
      if (catData) setCategories(catData)
      if (adoptionsData) setAdoptions(adoptionsData)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  // --- FILE UPLOAD UTILITY ---
  const handleFileUpload = async (file, bucket) => {
    if (!file) return null
    const fileExt = file.name.split('.').pop()
    const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`
    
    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(fileName, file)

    if (uploadError) {
      toast.error("Gagal upload gambar: " + uploadError.message)
      return null
    }

    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(fileName)
      
    return publicUrl
  }

  const handleDeleteAnimal = async (id) => {
    if (confirm('Yakin ingin menghapus hewan ini?')) {
      await supabase.from('animals').delete().eq('id', id)
      toast.success("Hewan berhasil dihapus!")
      fetchData()
    }
  }

  const handleUpdateAdoption = async (id, status) => {
    if (confirm(`Yakin ingin ${status === 'approved' ? 'menyetujui' : 'menolak'} adopsi ini?`)) {
      await supabase.from('adoptions').update({ status }).eq('id', id)
      toast.success(`Adopsi berhasil ${status === 'approved' ? 'disetujui' : 'ditolak'}!`)
      fetchData()
    }
  }

  const handleSaveAnimal = async (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    
    try {
      const animalData = {
        name: formData.get('name'),
        category_id: parseInt(formData.get('category_id')),
        breed: formData.get('breed'),
        age: parseInt(formData.get('age')),
        weight: parseFloat(formData.get('weight')),
        gender: formData.get('gender'),
        color: formData.get('color'),
        health_status: formData.get('health_status'),
        vaccinated: formData.get('vaccinated') === 'true',
        status: 'available',
        shelter_id: shelterId, // Automatis assign ke shelter admin yang login
      }

      let animalId = editingAnimal?.id

      if (editingAnimal) {
        await supabase.from('animals').update(animalData).eq('id', animalId)
      } else {
        const { data, error } = await supabase.from('animals').insert([animalData]).select().single()
        if (error) throw error
        animalId = data.id
      }

      const file = e.target.querySelector('input[type="file"]').files[0]
      if (file && animalId) {
        const imageUrl = await handleFileUpload(file, 'animal-images')
        if (imageUrl) {
          await supabase.from('animal_images').insert([{
            animal_id: animalId,
            image_url: imageUrl,
            is_primary: true
          }])
        }
      }

      setShowAddModal(false)
      setEditingAnimal(null)
      fetchData()
      toast.success("Data hewan berhasil disimpan!")
    } catch (err) {
      toast.error("Terjadi kesalahan saat menyimpan hewan: " + err.message)
    }
  }

  const handleDeleteImage = async (imageId, animalId) => {
    if (confirm("Yakin ingin menghapus foto ini?")) {
      const { error } = await supabase.from('animal_images').delete().eq('id', imageId)
      if (!error) {
        toast.success("Foto berhasil dihapus!")
        fetchData()
        setEditingAnimal(prev => ({
          ...prev,
          animal_images: prev.animal_images.filter(img => img.id !== imageId)
        }))
      } else {
        toast.error("Gagal menghapus foto")
      }
    }
  }

  const inputClass = "w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-dark-600 bg-gray-50 dark:bg-dark-700 outline-none focus:ring-2 focus:ring-brand-orange"

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-dark-900 text-gray-500">Memuat data dari Supabase...</div>
  }

  if (!shelterId) {
    const handleRegisterShelter = async (e) => {
      e.preventDefault()
      const formData = new FormData(e.target)
      try {
        const { error } = await supabase.from('shelters').insert([{
          admin_id: user?.id,
          name: formData.get('name'),
          address: formData.get('address'),
          city: formData.get('city'),
          phone: formData.get('phone')
        }])
        
        if (error) throw error
        
        toast.success("Shelter berhasil didaftarkan! Halaman akan dimuat ulang.")
        setTimeout(() => window.location.reload(), 1500)
      } catch (err) {
        toast.error("Gagal mendaftarkan shelter: " + err.message)
      }
    }

    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-dark-900 p-4">
        <div className="bg-white dark:bg-dark-800 p-8 rounded-3xl shadow-2xl w-full max-w-xl border border-gray-100 dark:border-dark-700">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">🏠</div>
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Selamat Datang, Mitra!</h2>
            <p className="text-gray-500 dark:text-gray-400">Akun Anda telah disetujui sebagai Admin Shelter. Silakan lengkapi profil shelter Anda di bawah ini untuk mulai menggunakan dashboard.</p>
          </div>

          <form onSubmit={handleRegisterShelter} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold mb-1.5 text-gray-700 dark:text-gray-300">Nama Shelter</label>
              <input name="name" className={inputClass} placeholder="Contoh: Shelter Peduli Kucing" required />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1.5 text-gray-700 dark:text-gray-300">Alamat Lengkap</label>
              <textarea name="address" className={inputClass} rows="3" placeholder="Alamat lengkap shelter Anda..." required></textarea>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-1.5 text-gray-700 dark:text-gray-300">Kota</label>
                <input name="city" className={inputClass} placeholder="Contoh: Jakarta" required />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1.5 text-gray-700 dark:text-gray-300">Nomor Telepon</label>
                <input name="phone" type="tel" className={inputClass} placeholder="0812..." required />
              </div>
            </div>
            <button type="submit" className="w-full py-3.5 bg-brand-orange text-white rounded-xl font-bold hover:bg-brand-yellow shadow-lg smooth-transition mt-4">
              Daftarkan Shelter Sekarang 🚀
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-dark-900 text-gray-800 dark:text-white min-h-[calc(100vh-4rem)] border-r border-gray-100 dark:border-dark-700 sticky top-16 hidden lg:block">
        <div className="p-6 border-b border-gray-100 dark:border-dark-700">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <span className="w-8 h-8 bg-brand-orange rounded-lg flex items-center justify-center text-sm">🏠</span>
            Mitra Panel
          </h2>
        </div>
        <nav className="p-4 space-y-1">
          {menuItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveMenu(item.id)}
              className={`w-full text-left px-4 py-3 rounded-xl smooth-transition flex items-center gap-3 text-sm font-medium ${
                activeMenu === item.id
                  ? 'bg-brand-orange text-white shadow-lg'
                  : 'text-gray-600 dark:text-gray-400 hover:text-brand-orange dark:hover:text-white hover:bg-gray-50 dark:hover:bg-dark-800'
              }`}
            >
              <span>{item.icon}</span> {item.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Mobile menu */}
      <div className="lg:hidden sticky top-16 z-30 bg-white dark:bg-dark-800 border-b border-gray-100 dark:border-dark-700 w-full">
        <div className="flex overflow-x-auto gap-1 p-2">
          {menuItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveMenu(item.id)}
              className={`px-3 py-2 rounded-lg whitespace-nowrap text-xs font-semibold smooth-transition ${
                activeMenu === item.id ? 'bg-brand-orange text-white' : 'bg-gray-100 dark:bg-dark-700 text-gray-600 dark:text-gray-400'
              }`}
            >
              {item.icon} {item.label}
            </button>
          ))}
        </div>
      </div>

      <main className="flex-1 p-6 lg:p-8 bg-gray-50 dark:bg-dark-900">
        <motion.div key={activeMenu} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>

          {/* OVERVIEW */}
          {activeMenu === 'overview' && (
            <>
              <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-8">Dashboard Mitra Shelter</h1>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                {stats.map((stat, i) => (
                  <div key={i} className={`bg-gradient-to-br ${stat.color} rounded-2xl p-6 text-white shadow-xl`}>
                    <div className="text-3xl mb-2">{stat.icon}</div>
                    <div className="text-3xl font-bold">{stat.value}</div>
                    <div className="text-sm opacity-90 font-medium">{stat.label}</div>
                  </div>
                ))}
              </div>

              <div className="bg-white dark:bg-dark-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-dark-700">
                <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Pengajuan Adopsi Terbaru (Menunggu)</h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-dark-600">
                        <th className="text-left py-3 px-4 font-semibold text-gray-500 dark:text-gray-400">Pemohon</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-500 dark:text-gray-400">Hewan</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-500 dark:text-gray-400">Tanggal</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-500 dark:text-gray-400">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {adoptions.filter(a => a.status === 'pending').slice(0, 5).map(item => (
                        <tr key={item.id} className="border-b border-gray-100 dark:border-dark-700">
                          <td className="py-3 px-4">
                            <div className="font-semibold text-gray-800 dark:text-white">{item.users?.name || 'Unknown'}</div>
                            <div className="text-gray-400 text-xs">{item.users?.email}</div>
                          </td>
                          <td className="py-3 px-4 text-gray-700 dark:text-gray-300">{item.animals?.name}</td>
                          <td className="py-3 px-4 text-gray-500">{new Date(item.created_at).toLocaleDateString('id-ID')}</td>
                          <td className="py-3 px-4">
                            <span className="px-2 py-1 rounded-full text-xs font-bold bg-yellow-100 text-yellow-700">⏳ Menunggu</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {/* KELOLA HEWAN */}
          {activeMenu === 'animals' && (
            <>
              <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Kelola Hewan Saya</h1>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="px-6 py-3 bg-brand-orange text-white rounded-xl font-bold hover:bg-brand-yellow smooth-transition shadow-lg flex items-center gap-2"
                >
                  ➕ Tambah Hewan
                </button>
              </div>
              <div className="bg-white dark:bg-dark-800 rounded-2xl shadow-lg border border-gray-100 dark:border-dark-700 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 dark:bg-dark-700">
                      <tr>
                        <th className="text-left py-3 px-4 font-semibold text-gray-500 dark:text-gray-400">Foto</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-500 dark:text-gray-400">Nama</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-500 dark:text-gray-400">Kategori</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-500 dark:text-gray-400">Status</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-500 dark:text-gray-400">Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {animals.map(animal => {
                        const animalImage = animal.animal_images?.[0]?.image_url || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
                        return (
                          <tr key={animal.id} className="border-b border-gray-100 dark:border-dark-700 hover:bg-gray-50 dark:hover:bg-dark-700/50 smooth-transition">
                            <td className="py-3 px-4">
                              <img src={animalImage} alt={animal.name} className="w-12 h-12 rounded-xl object-cover" />
                            </td>
                            <td className="py-3 px-4">
                              <div className="font-semibold text-gray-800 dark:text-white">{animal.name}</div>
                              <div className="text-gray-400 text-xs">{animal.breed} · {animal.age} thn</div>
                            </td>
                            <td className="py-3 px-4 text-gray-600 dark:text-gray-300">{animal.categories?.name || '-'}</td>
                            <td className="py-3 px-4">
                              <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                                animal.status === 'available'
                                  ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                                  : 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                              }`}>
                                {animal.status === 'available' ? 'Tersedia' : 'Diadopsi'}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex gap-2">
                                <button onClick={() => setEditingAnimal(animal)} className="px-3 py-1 rounded-lg bg-blue-500 text-white text-xs font-bold hover:bg-blue-600">Edit</button>
                                <button onClick={() => handleDeleteAnimal(animal.id)} className="px-3 py-1 rounded-lg bg-red-500 text-white text-xs font-bold hover:bg-red-600">Hapus</button>
                              </div>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {/* VERIFIKASI ADOPSI */}
          {activeMenu === 'adoptions' && (
            <>
              <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-8">Verifikasi Pengajuan Adopsi</h1>
              <div className="space-y-4">
                {adoptions.length === 0 ? (
                   <div className="text-gray-500">Belum ada pengajuan adopsi untuk shelter Anda.</div>
                ) : adoptions.map((item, i) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-white dark:bg-dark-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-dark-700"
                  >
                    <div className="flex items-center justify-between flex-wrap gap-4">
                      <div>
                        <h3 className="font-bold text-gray-800 dark:text-white text-lg">{item.users?.name || 'Unknown User'}</h3>
                        <p className="text-sm text-gray-500">{item.users?.email} · Mengajukan adopsi <strong>{item.animals?.name}</strong></p>
                        <p className="text-xs text-gray-400 mt-1">Tanggal: {new Date(item.created_at).toLocaleDateString('id-ID')}</p>
                      </div>
                      <div className="flex gap-3">
                        {item.status === 'pending' ? (
                          <>
                            <button onClick={() => handleUpdateAdoption(item.id, 'approved')} className="px-5 py-2 rounded-xl bg-green-500 text-white font-bold hover:bg-green-600 shadow-lg">✅ Setujui</button>
                            <button onClick={() => handleUpdateAdoption(item.id, 'rejected')} className="px-5 py-2 rounded-xl bg-red-500 text-white font-bold hover:bg-red-600 shadow-lg">❌ Tolak</button>
                          </>
                        ) : (
                          <span className={`px-4 py-2 rounded-xl font-bold ${item.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {item.status === 'approved' ? 'Telah Disetujui' : 'Telah Ditolak'}
                          </span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </>
          )}

        </motion.div>
      </main>

      {/* Add/Edit Animal Modal */}
      {(showAddModal || editingAnimal) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => {setShowAddModal(false); setEditingAnimal(null)}}></div>
          <div className="relative bg-white dark:bg-dark-800 rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-8 z-10">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">{editingAnimal ? 'Edit Hewan' : 'Tambah Hewan Baru'}</h2>
            <form onSubmit={handleSaveAnimal} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-1.5">Nama Hewan</label>
                <input name="name" defaultValue={editingAnimal?.name} className={inputClass} required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-1.5">Kategori</label>
                  <select name="category_id" defaultValue={editingAnimal?.category_id} className={inputClass} required>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1.5">Ras</label>
                  <input name="breed" defaultValue={editingAnimal?.breed} className={inputClass} />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-1.5">Umur (thn)</label>
                  <input name="age" type="number" defaultValue={editingAnimal?.age} className={inputClass} />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1.5">Berat (kg)</label>
                  <input name="weight" type="number" step="0.1" defaultValue={editingAnimal?.weight} className={inputClass} />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1.5">Gender</label>
                  <select name="gender" defaultValue={editingAnimal?.gender} className={inputClass}>
                    <option value="Jantan">Jantan</option>
                    <option value="Betina">Betina</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-1.5">Warna</label>
                  <input name="color" defaultValue={editingAnimal?.color} className={inputClass} placeholder="Misal: Belang, Putih" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1.5">Kesehatan</label>
                  <input name="health_status" defaultValue={editingAnimal?.health_status} className={inputClass} placeholder="Misal: Sehat, Pemulihan" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1.5">Vaksinasi</label>
                  <select name="vaccinated" defaultValue={editingAnimal?.vaccinated ? 'true' : 'false'} className={inputClass}>
                    <option value="false">Belum</option>
                    <option value="true">Sudah</option>
                  </select>
                </div>
              </div>
              
              {/* Existing Images Management */}
              {editingAnimal?.animal_images && editingAnimal.animal_images.length > 0 && (
                <div>
                  <label className="block text-sm font-semibold mb-2">Foto Saat Ini (Klik X untuk Hapus)</label>
                  <div className="flex gap-2 flex-wrap">
                    {editingAnimal.animal_images.map(img => (
                      <div key={img.id} className="relative group">
                        <img src={img.image_url} alt="Animal" className="w-16 h-16 object-cover rounded-lg border border-gray-200" />
                        <button type="button" onClick={() => handleDeleteImage(img.id, editingAnimal.id)} className="absolute -top-2 -right-2 bg-red-500 text-white w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center opacity-0 group-hover:opacity-100 smooth-transition shadow-lg hover:bg-red-600">X</button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold mb-1.5">Upload Foto Baru (Opsional)</label>
                <input type="file" accept="image/*" className={inputClass} />
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => {setShowAddModal(false); setEditingAnimal(null)}} className="flex-1 py-3 bg-gray-200 dark:bg-dark-700 rounded-xl font-bold text-gray-700 dark:text-white">Batal</button>
                <button type="submit" className="flex-1 py-3 bg-brand-orange text-white rounded-xl font-bold shadow-lg">💾 Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  )
}
