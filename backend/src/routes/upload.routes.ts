import { Router } from 'express'
import { auth } from '../middleware/auth'
import { upload } from '../middleware/upload'

const router = Router()

router.post('/upload', auth, upload.single('file'), (req, res) => {
    if (!req.file) {
        res.status(400).json({ message: '请选择文件' })
        return
    }
    res.json({ url: `/uploads/${req.file.filename}` })
})

export default router
