import { Router } from 'express'
import { getComments, createComment } from '../controllers/comment.controller'

const router = Router()

router.get('/posts/:postId/comments', getComments)
router.post('/posts/:postId/comments', createComment)

export default router
