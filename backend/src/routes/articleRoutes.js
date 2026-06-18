import express from 'express'
import { articleController } from '../controllers/articleController.js'

const router = express.Router()

router.get('/', articleController.getAll)
router.get('/:id', articleController.getById)
router.post('/', articleController.create)
router.put('/:id', articleController.update)
router.delete('/:id', articleController.delete)

export default router
