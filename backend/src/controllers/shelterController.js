export const shelterController = {
  getAll: async (req, res) => {
    try {
      res.json({ message: 'Get all shelters' })
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  },

  getById: async (req, res) => {
    try {
      res.json({ message: 'Get shelter by ID' })
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  },

  create: async (req, res) => {
    try {
      res.status(201).json({ message: 'Shelter created' })
    } catch (error) {
      res.status(400).json({ message: error.message })
    }
  },

  update: async (req, res) => {
    try {
      res.json({ message: 'Shelter updated' })
    } catch (error) {
      res.status(400).json({ message: error.message })
    }
  },

  delete: async (req, res) => {
    try {
      res.json({ message: 'Shelter deleted' })
    } catch (error) {
      res.status(400).json({ message: error.message })
    }
  },
}
