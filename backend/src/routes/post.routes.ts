import { Router } from 'express'
import { getPosts, getPost, createPost, updatePost, deletePost, toggleHide } from '../controllers/post.controller'
import { auth } from '../middleware/auth'
import { admin } from '../middleware/admin'

const router = Router()

router.get('/posts', getPosts)
router.get('/posts/:id', getPost)
router.post('/posts', auth, createPost)
router.put('/posts/:id', auth, admin, updatePost)
router.delete('/posts/:id', auth, admin, deletePost)
router.put('/posts/:id/hide', auth, admin, toggleHide)

export default router
