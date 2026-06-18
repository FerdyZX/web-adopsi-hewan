import { supabaseAdmin } from '../db/supabaseClient.js'

export const animalController = {
  getAll: async (req, res) => {
    try {
      const { category, status, search } = req.query

      let query = supabaseAdmin.from('animals').select('*')

      if (category) {
        query = query.eq('category_id', category)
      }

      if (status) {
        query = query.eq('status', status)
      }

      if (search) {
        query = query.ilike('name', `%${search}%`)
      }

      const { data, error } = await query

      if (error) throw error

      res.json(data)
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  },

  getById: async (req, res) => {
    try {
      const { id } = req.params

      const { data, error } = await supabaseAdmin
        .from('animals')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error

      res.json(data)
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  },

  create: async (req, res) => {
    try {
      const { name, category_id, breed, age, weight, color, gender, health_status, shelter_id } = req.body

      const { data, error } = await supabaseAdmin
        .from('animals')
        .insert([
          {
            name,
            category_id,
            breed,
            age,
            weight,
            color,
            gender,
            health_status,
            shelter_id,
            status: 'available',
          },
        ])
        .select()

      if (error) throw error

      res.status(201).json(data[0])
    } catch (error) {
      res.status(400).json({ message: error.message })
    }
  },

  update: async (req, res) => {
    try {
      const { id } = req.params
      const updateData = req.body

      const { data, error } = await supabaseAdmin
        .from('animals')
        .update(updateData)
        .eq('id', id)
        .select()

      if (error) throw error

      res.json(data[0])
    } catch (error) {
      res.status(400).json({ message: error.message })
    }
  },

  delete: async (req, res) => {
    try {
      const { id } = req.params

      const { error } = await supabaseAdmin
        .from('animals')
        .delete()
        .eq('id', id)

      if (error) throw error

      res.json({ message: 'Hewan berhasil dihapus' })
    } catch (error) {
      res.status(400).json({ message: error.message })
    }
  },
}
