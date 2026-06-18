import { supabaseAdmin } from '../db/supabaseClient.js'

export const adoptionController = {
  getAll: async (req, res) => {
    try {
      const { data, error } = await supabaseAdmin
        .from('adoptions')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error

      res.json(data)
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  },

  create: async (req, res) => {
    try {
      const { user_id, animal_id, shelter_id, message } = req.body

      const { data, error } = await supabaseAdmin
        .from('adoptions')
        .insert([
          {
            user_id,
            animal_id,
            shelter_id,
            message,
            status: 'pending',
          },
        ])
        .select()

      if (error) throw error

      res.status(201).json(data[0])
    } catch (error) {
      res.status(400).json({ message: error.message })
    }
  },

  updateStatus: async (req, res) => {
    try {
      const { id } = req.params
      const { status } = req.body

      const { data, error } = await supabaseAdmin
        .from('adoptions')
        .update({ status })
        .eq('id', id)
        .select()

      if (error) throw error

      res.json(data[0])
    } catch (error) {
      res.status(400).json({ message: error.message })
    }
  },
}
