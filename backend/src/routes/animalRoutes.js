import express from 'express'
import { animalController } from '../controllers/animalController.js'
import { authMiddleware } from '../middleware/auth.js'

const router = express.Router()

router.get('/', animalController.getAll)
router.get('/:id', animalController.getById)
router.post('/', authMiddleware, animalController.create)
router.put('/:id', authMiddleware, animalController.update)
router.delete('/:id', authMiddleware, animalController.delete)

export default router
