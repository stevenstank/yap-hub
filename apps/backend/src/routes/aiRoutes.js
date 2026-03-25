import express from 'express'
import { chatWithAI } from '../controllers/aiController.js'

const router = express.Router()

router.post('/', chatWithAI)
router.get('/', (req, res) => {
  res.send('AI route working (use POST)')
})

export default router
