import jwt from 'jsonwebtoken'

export const authMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]
    
    if (!token) {
      return res.status(401).json({ message: 'Token tidak ditemukan' })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.userId = decoded.userId
    next()
  } catch (error) {
    res.status(401).json({ message: 'Token tidak valid' })
  }
}

export const adminMiddleware = (req, res, next) => {
  // Implementasi admin check
  next()
}

export const superAdminMiddleware = (req, res, next) => {
  // Implementasi super admin check
  next()
}
