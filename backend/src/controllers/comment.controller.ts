import { Request, Response } from 'express'
import pool from '../config/db'

export async function getComments(req: Request, res: Response) {
    const { postId } = req.params
    const { page = '1', limit = '20' } = req.query
    const pageNum = parseInt(page as string) || 1
    const limitNum = parseInt(limit as string) || 20
    const offset = (pageNum - 1) * limitNum

    try {
        const [rows]: any = await pool.query(
            `SELECT * FROM comments WHERE article_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?`,
            [postId, limitNum, offset]
        )
        const [[{ total }]]: any = await pool.query(
            'SELECT COUNT(*) as total FROM comments WHERE article_id = ?',
            [postId]
        )
        res.json({ comments: rows, total, page: pageNum, totalPages: Math.ceil(total / limitNum) })
    } catch {
        res.status(500).json({ message: '服务器错误' })
    }
}

export async function createComment(req: Request, res: Response) {
    const { postId } = req.params
    const { author_name, content, parent_id } = req.body
    if (!author_name || !content) {
        res.status(400).json({ message: '昵称和评论内容不能为空' })
        return
    }
    try {
        const [result]: any = await pool.query(
            `INSERT INTO comments (article_id, author_name, content, parent_id) VALUES (?, ?, ?, ?)`,
            [postId, author_name, content, parent_id || null]
        )
        const [rows]: any = await pool.query('SELECT * FROM comments WHERE id = ?', [result.insertId])
        res.status(201).json({ comment: rows[0] })
    } catch {
        res.status(500).json({ message: '服务器错误' })
    }
}
