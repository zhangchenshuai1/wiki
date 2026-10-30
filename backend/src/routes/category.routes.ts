import { Router } from 'express'
import pool from '../config/db'

const router = Router()

router.get('/categories', async (_req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM categories ORDER BY id')
        res.json({ categories: rows })
    } catch {
        res.status(500).json({ message: '服务器错误' })
    }
})

export default router
