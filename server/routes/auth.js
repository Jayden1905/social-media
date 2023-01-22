import e from 'express'
import { login } from '../controllers/auth.js'

const router = e.Router()

router.post('/login', login)

export default router
