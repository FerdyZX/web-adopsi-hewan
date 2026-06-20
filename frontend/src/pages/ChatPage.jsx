import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../utils/supabaseClient'

export default function ChatPage() {
  const { user, role } = useAuth()
  const [chatRooms, setChatRooms] = useState([])
  const [selectedRoom, setSelectedRoom] = useState(null)
  
  const [messages, setMessages] = useState([])
  const [localBotMessages, setLocalBotMessages] = useState([])
  
  const [messageInput, setMessageInput] = useState('')
  const [loadingRooms, setLoadingRooms] = useState(true)
  const messagesEndRef = useRef(null)

  // FAQ Options (User)
  const userFaqOptions = [
    { text: "📝 Syarat Adopsi", reply: "Untuk mengadopsi hewan, Anda perlu mengisi form pengajuan adopsi dari halaman detail hewan. Pastikan Anda sudah siap secara finansial dan waktu untuk merawat mereka! 🐾" },
    { text: "📍 Lokasi Shelter", reply: "Lokasi lengkap shelter kami dapat Anda temukan di halaman profil Shelter. Silakan buat janji temu sebelum berkunjung. 🗺️" },
    { text: "💰 Biaya Adopsi", reply: "Adopsi umumnya gratis, tetapi kami mungkin meminta donasi sukarela atau biaya pengganti vaksinasi/sterilisasi demi kesehatan hewan. 💊" },
    { text: "👩‍💼 Chat dengan Admin", reply: "Baik, pesan Anda selanjutnya akan langsung dibaca dan dibalas oleh admin kami. Silakan ketik pesan Anda! ✨", action: 'chat_admin' }
  ]

  // Quick Replies (Admin)
  const adminOptions = [
    { text: "👋 Sapa Pengguna", reply: "Halo! Terima kasih telah menghubungi shelter kami. Ada yang bisa kami bantu terkait proses adopsi?" },
    { text: "📄 Minta Form Adopsi", reply: "Untuk melanjutkan, mohon pastikan Anda sudah mengisi formulir pengajuan adopsi di halaman detail hewan ya." },
    { text: "⏳ Sedang Diproses", reply: "Pengajuan Anda sedang kami proses. Mohon ditunggu ya, kami akan segera memberikan update." },
    { text: "✅ Adopsi Disetujui", reply: "Selamat! Pengajuan adopsi Anda telah disetujui. Silakan kunjungi shelter kami untuk menjemput hewan peliharaan baru Anda." }
  ]

  const currentOptions = role === 'user' ? userFaqOptions : adminOptions;

  // Auto-scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, localBotMessages])

  // Fetch Chat Rooms
  useEffect(() => {
    if (!user) return

    const fetchRooms = async () => {
      setLoadingRooms(true)
      try {
        let query = supabase.from('chat_rooms').select(`
          id, created_at,
          users:user_id(id, name, avatar_url),
          shelters:shelter_id(id, name, logo_url)
        `).order('updated_at', { ascending: false })

        if (role === 'user') {
          query = query.eq('user_id', user.id)
        }

        const { data, error } = await query

        if (error) throw error
        if (data) {
          const formattedRooms = data.map(room => {
            const isUser = role === 'user'
            const partnerName = isUser ? room.shelters?.name : room.users?.name
            const partnerAvatar = isUser 
              ? (room.shelters?.logo_url || '🏠') 
              : (room.users?.avatar_url || '👤')

            return {
              id: room.id,
              partnerName: partnerName || 'Unknown',
              partnerAvatar,
              partnerId: isUser ? room.shelters?.id : room.users?.id,
              time: new Date(room.created_at).toLocaleDateString('id-ID'),
              lastMessage: 'Klik untuk melihat pesan',
              unread: 0
            }
          })
          setChatRooms(formattedRooms)
          if (formattedRooms.length > 0) {
            setSelectedRoom(formattedRooms[0])
          }
        }
      } catch (err) {
        console.error("Error fetching chat rooms:", err)
      } finally {
        setLoadingRooms(false)
      }
    }

    fetchRooms()
  }, [user, role])

  // Fetch Messages for selected room & Subscribe to Realtime
  useEffect(() => {
    if (!selectedRoom || !user) return

    let channel

    const fetchMessagesAndSubscribe = async () => {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('room_id', selectedRoom.id)
        .order('created_at', { ascending: true })

      if (error) {
        console.error("Error fetching messages:", error)
      } else if (data) {
        setMessages(data)
        // Jalankan bot setiap kali ruang obrolan dibuka, agar menu FAQ selalu tersedia
        initBot(data)
      }

      channel = supabase.channel(`room:${selectedRoom.id}`)
        .on(
          'postgres_changes',
          { event: 'INSERT', schema: 'public', table: 'chat_messages', filter: `room_id=eq.${selectedRoom.id}` },
          (payload) => {
            const newMessage = payload.new
            setMessages(prev => {
              if (prev.find(m => m.id === newMessage.id)) return prev
              return [...prev, newMessage]
            })
          }
        )
        .subscribe()
    }

    // Definisi initBot dipindah ke atas agar bisa dipanggil di dalam fetch
    const initBot = (loadedMessages) => {
      // Ambil waktu dari pesan terakhir di DB untuk menghindari masalah zona waktu / clock skew
      // Jika tidak ada pesan, gunakan waktu 1 menit yang lalu agar pesan baru pasti masuk di bawahnya
      const baseTime = loadedMessages && loadedMessages.length > 0
        ? new Date(parseDate(loadedMessages[loadedMessages.length - 1].created_at).getTime() + 1000)
        : new Date(Date.now() - 60000);

      if (role === 'user') {
        setLocalBotMessages([{
          id: `bot_welcome_${Date.now()}`,
          sender_id: 'bot',
          message: `Halo! Selamat datang di layanan chat otomatis ${selectedRoom.partnerName}. Ada yang bisa kami bantu?`,
          isOptions: true,
          created_at: baseTime.toISOString()
        }])
      } else {
        setLocalBotMessages([{
          id: `bot_welcome_admin_${Date.now()}`,
          sender_id: 'bot',
          message: `🤖 Halo Admin! Anda sedang terhubung dengan ${selectedRoom.partnerName}. Gunakan template balasan cepat di bawah ini atau ketik pesan Anda langsung.`,
          isOptions: true,
          created_at: baseTime.toISOString()
        }])
      }
    }

    fetchMessagesAndSubscribe()

    return () => {
      if (channel) supabase.removeChannel(channel)
    }
  }, [selectedRoom, user])

  const handleFAQClick = async (faq) => {
    if (role === 'user') {
      // Add User Message (Local)
      const userMsg = {
        id: `local_user_${Date.now()}`,
        sender_id: user.id,
        message: faq.text,
        created_at: new Date().toISOString()
      }
      
      setLocalBotMessages(prev => [...prev, userMsg])

      // Add Bot Reply (Local)
      setTimeout(() => {
        const botMsg = {
          id: `local_bot_${Date.now()}`,
          sender_id: 'bot',
          message: faq.reply,
          isOptions: faq.action !== 'chat_admin', // Hide options if they chose Chat Admin
          created_at: new Date().toISOString()
        }
        setLocalBotMessages(prev => [...prev, botMsg])
      }, 600)
    } else {
      // For Admin, clicking a quick reply sends a real message to the user
      const newMessage = {
        room_id: selectedRoom.id,
        sender_id: user.id,
        message: faq.reply, // Send the template reply text
      }

      try {
        const { error } = await supabase.from('chat_messages').insert([newMessage])
        if (error) throw error
        
        await supabase.from('chat_rooms').update({ updated_at: new Date() }).eq('id', selectedRoom.id)
      } catch (err) {
        console.error("Error sending message:", err)
        alert("Gagal mengirim pesan: " + err.message)
      }
    }
  }

  const sendMessage = async (e) => {
    e.preventDefault()
    const text = messageInput.trim()
    if (!text || !selectedRoom || !user) return

    setMessageInput('') // Optimistic clear

    // Realtime DB Chat
    const newMessage = {
      room_id: selectedRoom.id,
      sender_id: user.id,
      message: text,
    }

    try {
      const { error } = await supabase.from('chat_messages').insert([newMessage])
      if (error) throw error
      
      await supabase.from('chat_rooms').update({ updated_at: new Date() }).eq('id', selectedRoom.id)
    } catch (err) {
      console.error("Error sending message:", err)
      alert("Gagal mengirim pesan: " + err.message)
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Silakan login untuk mengakses fitur chat.</p>
      </div>
    )
  }

  // Combine DB messages and Local Bot messages
  const parseDate = (dateStr) => {
    if (!dateStr) return new Date(0)
    // Jika dari Supabase (timestamp without timezone) biasanya tidak ada 'Z', jadi dianggap local time. 
    // Kita tambahkan 'Z' agar dibaca sebagai UTC.
    return new Date(dateStr.endsWith('Z') || dateStr.includes('+') ? dateStr : dateStr + 'Z')
  }

  const allMessages = [...messages, ...localBotMessages].sort((a, b) => parseDate(a.created_at) - parseDate(b.created_at))

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <div className="flex-1 flex max-w-7xl mx-auto w-full min-h-0">
        
        {/* Chat List */}
        <div className="w-80 border-r border-gray-200 dark:border-dark-700 bg-white dark:bg-dark-800 flex flex-col min-h-0">
          <div className="p-4 border-b border-gray-200 dark:border-dark-700 shrink-0">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">💬 Chat</h2>
            <p className="text-xs text-gray-500">Percakapan Anda</p>
          </div>
          <div className="flex-1 overflow-y-auto divide-y divide-gray-100 dark:divide-dark-700">
            {loadingRooms ? (
              <div className="p-4 text-center text-sm text-gray-500">Memuat percakapan...</div>
            ) : chatRooms.length === 0 ? (
              <div className="p-8 text-center text-sm text-gray-500">Belum ada percakapan. Mulai chat dari halaman profil shelter.</div>
            ) : (
              chatRooms.map((room) => (
                <button
                  key={room.id}
                  onClick={() => setSelectedRoom(room)}
                  className={`w-full text-left p-4 smooth-transition ${
                    selectedRoom?.id === room.id
                      ? 'bg-brand-orange/10 dark:bg-brand-orange/20 border-l-4 border-brand-orange'
                      : 'hover:bg-gray-50 dark:hover:bg-dark-700 border-l-4 border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {room.partnerAvatar.length > 2 ? (
                      <img src={room.partnerAvatar} alt="avatar" className="w-10 h-10 rounded-full object-cover" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-brand-orange/20 flex items-center justify-center text-xl">{room.partnerAvatar}</div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-gray-800 dark:text-white text-sm truncate">{room.partnerName}</span>
                        <span className="text-xs text-gray-400">{room.time}</span>
                      </div>
                      <p className="text-xs text-gray-500 truncate">{room.lastMessage}</p>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 flex flex-col bg-gray-50 dark:bg-dark-900 relative min-h-0">
          {!selectedRoom ? (
            <div className="flex-1 flex items-center justify-center text-gray-400">
              Pilih percakapan untuk mulai mengirim pesan
            </div>
          ) : (
            <>
              {/* Chat Header */}
              <div className="p-4 bg-white dark:bg-dark-800 border-b border-gray-200 dark:border-dark-700 flex items-center gap-3 shrink-0 z-10 shadow-sm">
                {selectedRoom.partnerAvatar.length > 2 ? (
                  <img src={selectedRoom.partnerAvatar} alt="avatar" className="w-10 h-10 rounded-full object-cover" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-brand-orange/20 flex items-center justify-center text-xl">{selectedRoom.partnerAvatar}</div>
                )}
                <div>
                  <h3 className="font-bold text-gray-800 dark:text-white">{selectedRoom.partnerName}</h3>
                  <span className="text-xs text-green-500">● Tersambung</span>
                </div>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 scroll-smooth">
                {allMessages.length === 0 ? (
                  <div className="text-center text-gray-400 text-sm py-10">Kirim pesan pertama Anda!</div>
                ) : (
                  allMessages.map((msg, idx) => {
                    const isMe = msg.sender_id === user.id
                    const isBot = msg.sender_id === 'bot'
                    
                    return (
                      <motion.div
                        key={msg.id || idx}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex flex-col mb-2 ${isMe ? 'items-end' : 'items-start'}`}
                      >
                        <div className={`max-w-[85%] sm:max-w-[75%] px-3 py-2 rounded-2xl ${
                          isMe
                            ? 'bg-brand-orange text-white rounded-br-sm shadow-md'
                            : isBot 
                              ? 'bg-white dark:bg-dark-800 text-gray-800 dark:text-white rounded-tl-sm shadow-sm border-l-4 border-brand-blue'
                              : 'bg-white dark:bg-dark-800 text-gray-800 dark:text-white rounded-tl-sm shadow-md'
                        }`}>
                          {/* Bot Identifier */}
                          {isBot && (
                            <div className="flex items-center gap-1.5 mb-1.5 opacity-80 border-b border-gray-100 dark:border-dark-700 pb-1.5">
                              <span className="text-xs">🤖</span>
                              <span className="text-[10px] font-bold uppercase tracking-wider text-brand-blue">Auto-Reply</span>
                            </div>
                          )}
                          
                          <p className="text-[13px] sm:text-sm leading-relaxed whitespace-pre-wrap">{msg.message}</p>
                          <p className={`text-[10px] mt-1 text-right ${isMe ? 'text-white/70' : 'text-gray-400'}`}>
                            {parseDate(msg.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>

                        {/* Tampilkan Tombol FAQ khusus di bawah pesan bot yang terakhir (isOptions = true) */}
                        {isBot && msg.isOptions && idx === allMessages.length - 1 && (
                          <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2 }}
                            className="mt-2 flex flex-wrap gap-2 max-w-[90%]"
                          >
                            {currentOptions.map((faq, i) => (
                              <button
                                key={i}
                                onClick={() => handleFAQClick(faq)}
                                className={`text-xs font-semibold px-3 py-2 rounded-xl transition-all shadow-sm ${
                                  faq.action === 'chat_admin'
                                    ? 'bg-brand-orange/10 text-brand-orange hover:bg-brand-orange hover:text-white border border-brand-orange/30'
                                    : 'bg-white dark:bg-dark-800 text-gray-700 dark:text-gray-200 hover:bg-brand-blue hover:text-white border border-gray-200 dark:border-dark-600'
                                }`}
                              >
                                {faq.text}
                              </button>
                            ))}
                          </motion.div>
                        )}
                      </motion.div>
                    )
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <form onSubmit={sendMessage} className="p-4 bg-white dark:bg-dark-800 border-t border-gray-200 dark:border-dark-700 shrink-0">
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    placeholder="Ketik pesan untuk Admin..."
                    className="flex-1 px-4 py-3 rounded-xl border border-gray-200 dark:border-dark-600 bg-gray-50 dark:bg-dark-700 outline-none focus:ring-2 focus:ring-brand-orange smooth-transition"
                  />
                  <button 
                    type="submit" 
                    disabled={!messageInput.trim()}
                    className="px-5 py-3 bg-brand-orange text-white rounded-xl font-bold hover:bg-brand-yellow smooth-transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    <span>Kirim</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
