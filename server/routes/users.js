import e from 'express'
import {
  getUser,
  getUserFriends,
  addRemoveFriend,
} from '../controllers/users.js'
import { verifyToken } from '../middleware/auth.js'

const router = e.Router()

/* READ */
router.get('/:id', verifyToken, getUser)
router.get('/:id/friends', verifyToken, getUserFriends)

/* UPDATE */
router.patch('/:id/:frindId', verifyToken, addRemoveFriend)

export const userRoutes = () => {
  return 'user routes'
}

export default router
