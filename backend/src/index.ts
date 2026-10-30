import express from 'express'
import cors from 'cors'
import path from 'path'
import dotenv from 'dotenv'

import authRoutes from './routes/auth.routes'
import postRoutes from './routes/post.routes'
import commentRoutes from './routes/comment.routes'
import uploadRoutes from './routes/upload.routes'
import categoryRoutes from './routes/category.routes'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000
const isProd = process.env.NODE_ENV === 'production'

app.use(cors())
app.use(express.json())
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')))

app.use('/api', authRoutes)
app.use('/api', postRoutes)
app.use('/api', commentRoutes)
app.use('/api', uploadRoutes)
app.use('/api', categoryRoutes)

if (isProd) {
    const distPath = path.join(__dirname, '..', '..', 'frontend', 'dist')
    app.use(express.static(distPath))
    app.get('/{*splat}', (_req, res) => {
        res.sendFile(path.join(distPath, 'index.html'))
    })
}

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT} ${isProd ? '(production)' : '(development)'}`)
})

export default app
