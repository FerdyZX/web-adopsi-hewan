import express from 'express'
import { adoptionController } from '../controllers/adoptionController.js'
import { authMiddleware } from '../middleware/auth.js'

const router = express.Router()

router.get('/', adoptionController.getAll)
router.post('/', authMiddleware, adoptionController.create)
router.patch('/:id/status', adoptionController.updateStatus)

export default router
