import { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../utils/supabaseClient'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [role, setRole] = useState(null)
  const [shelterId, setShelterId] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchRole = async (userId, userEmail) => {
    try {
      // 1. Fetch role dari tabel users
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('role')
        .eq('id', userId)
        .single()
        
      let actualRole = userData?.role || 'user';
      
      // --- BYPASS LOKAL UNTUK TESTING ---
      if (userEmail === 'admin@gmail.com') {
        actualRole = 'superadmin';
      } else if (userEmail === 'adminshelter1@gmail.com') {
        actualRole = 'admin_shelter';
      }
      // ----------------------------------
      
      // 2. Jika dia adalah admin_shelter, cari ID shelter miliknya
      let shelter_id = null;
      if (actualRole === 'admin_shelter') {
        const { data: shelterData } = await supabase
          .from('shelters')
          .select('id')
          .eq('admin_id', userId)
          .single()
          
        if (shelterData) {
          shelter_id = shelterData.id
        }
      }
      
      return { role: actualRole, shelter_id }
    } catch (err) {
      console.error('Exception in fetchRole:', err)
      
      // Fallback bypass if completely fails
      let fallbackRole = 'user';
      if (userEmail === 'admin@gmail.com') fallbackRole = 'superadmin';
      if (userEmail === 'adminshelter1@gmail.com') fallbackRole = 'admin_shelter';
      
      return { role: fallbackRole, shelter_id: null }
    }
  }

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()

        if (session?.user) {
          setUser(session.user)
          const userData = await fetchRole(session.user.id, session.user.email)
          setRole(userData.role)
          setShelterId(userData.shelter_id)
        }
      } catch (error) {
        console.error('Error checking user:', error)
      } finally {
        setLoading(false)
      }
    }

    checkUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          setUser(session.user)
          const userData = await fetchRole(session.user.id, session.user.email)
          setRole(userData.role)
          setShelterId(userData.shelter_id)
        } else {
          setUser(null)
          setRole(null)
          setShelterId(null)
        }
      }
    )

    return () => subscription?.unsubscribe()
  }, [])

  const login = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) throw error

    if (data.user) {
      const userData = await fetchRole(data.user.id, data.user.email)
      setRole(userData.role)
      setShelterId(userData.shelter_id)
    }
    return data
  }

  const register = async (email, password, userData) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })
    if (error) throw error

    // Create user profile
    if (data.user) {
      const { error: insertError } = await supabase.from('users').insert([
        {
          id: data.user.id,
          email,
          name: userData.name || 'User',
          phone: userData.phone || '',
          address: userData.address || '',
          avatar_url: null,
          role: 'user',
          created_at: new Date().toISOString(),
        },
      ])

      // Jika error terjadi di sini, berarti masalah RLS di database
      if (insertError) {
        console.error("Gagal menyimpan profil ke tabel users. Periksa RLS!", insertError)
        throw new Error("Pendaftaran berhasil, tetapi gagal menyimpan profil. Mohon periksa aturan RLS Database Anda.")
      }

      setRole('user')
      setShelterId(null)
    }

    // Paksa keluar agar tidak auto login
    await supabase.auth.signOut()

    return data
  }

  const logout = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    setUser(null)
    setRole(null)
    setShelterId(null)
  }

  const resetPassword = async (email) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email)
    if (error) throw error
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        shelterId,
        loading,
        login,
        register,
        logout,
        resetPassword,
        isAuthenticated: !!user,
        isAdmin: role === 'admin_shelter' || role === 'superadmin',
        isSuperAdmin: role === 'superadmin',
        isShelterAdmin: role === 'admin_shelter',
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
