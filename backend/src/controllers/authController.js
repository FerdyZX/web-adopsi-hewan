import { supabaseAdmin } from '../db/supabaseClient.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

export const authController = {
  register: async (req, res) => {
    try {
      const { email, password, name, phone, address } = req.body

      // Create auth user
      const { data, error } = await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: false,
      })

      if (error) throw error

      // Create user profile
      const { error: profileError } = await supabaseAdmin
        .from('users')
        .insert([
          {
            id: data.user.id,
            email,
            name,
            phone,
            address,
            role: 'user',
          },
        ])

      if (profileError) throw profileError

      res.status(201).json({
        message: 'User terdaftar berhasil',
        user: data.user,
      })
    } catch (error) {
      res.status(400).json({ message: error.message })
    }
  },

  login: async (req, res) => {
    try {
      const { email, password } = req.body

      // Get user
      const { data, error } = await supabaseAdmin.auth.admin.listUsers()
      
      // Find user by email
      const user = data.users.find(u => u.email === email)
      
      if (!user) {
        return res.status(404).json({ message: 'User tidak ditemukan' })
      }

      // Verify password using Supabase
      const { data: signInData, error: signInError } = await supabaseAdmin.auth.signInWithPassword({
        email,
        password,
      })

      if (signInError) throw signInError

      // Generate JWT token
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRY || '7d' }
      )

      res.json({
        message: 'Login berhasil',
        token,
        user: signInData.user,
      })
    } catch (error) {
      res.status(400).json({ message: error.message })
    }
  },

  logout: (req, res) => {
    res.json({ message: 'Logout berhasil' })
  },

  resetPassword: async (req, res) => {
    try {
      const { email } = req.body

      const { error } = await supabaseAdmin.auth.admin.resetPasswordForEmail(email)

      if (error) throw error

      res.json({ message: 'Email reset password telah dikirim' })
    } catch (error) {
      res.status(400).json({ message: error.message })
    }
  },
}
