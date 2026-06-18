export const articleController = {
  getAll: async (req, res) => {
    try {
      res.json({ message: 'Get all articles' })
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  },

  getById: async (req, res) => {
    try {
      res.json({ message: 'Get article by ID' })
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  },

  create: async (req, res) => {
    try {
      res.status(201).json({ message: 'Article created' })
    } catch (error) {
      res.status(400).json({ message: error.message })
    }
  },

  update: async (req, res) => {
    try {
      res.json({ message: 'Article updated' })
    } catch (error) {
      res.status(400).json({ message: error.message })
    }
  },

  delete: async (req, res) => {
    try {
      res.json({ message: 'Article deleted' })
    } catch (error) {
      res.status(400).json({ message: error.message })
    }
  },
}
