import express from 'express'
import { shelterController } from '../controllers/shelterController.js'

const router = express.Router()

router.get('/', shelterController.getAll)
router.get('/:id', shelterController.getById)
router.post('/', shelterController.create)
router.put('/:id', shelterController.update)
router.delete('/:id', shelterController.delete)

export default router
