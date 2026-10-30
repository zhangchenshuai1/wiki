import { Request, Response } from 'express'
import pool from '../config/db'

export async function getPosts(req: Request, res: Response) {
    const { page = '1', limit = '10', category, search, pinned } = req.query
    const pageNum = parseInt(page as string) || 1
    const limitNum = parseInt(limit as string) || 10
    const offset = (pageNum - 1) * limitNum

    let where = "WHERE 1=1"
    const params: any[] = []

    if (category) {
        where += " AND c.slug = ?"
        params.push(category)
    }
    if (search) {
        where += " AND (a.title LIKE ? OR a.content LIKE ?)"
        params.push(`%${search}%`, `%${search}%`)
    }
    if (pinned === '1') {
        where += " AND a.is_pinned = 1"
    }
    if (req.query.all !== '1') {
        where += " AND a.status = 'published' AND a.is_hidden = 0"
    }

    try {
        const [rows]: any = await pool.query(
            `SELECT a.id, a.title, a.summary, a.cover_image, a.category_id, a.is_pinned, a.is_hidden, a.view_count, a.status, a.created_at, a.updated_at,
                    c.name as category_name, c.slug as category_slug,
                    u.username as author_name
             FROM articles a
             LEFT JOIN categories c ON a.category_id = c.id
             LEFT JOIN users u ON a.author_id = u.id
             ${where}
             ORDER BY a.is_pinned DESC, a.created_at DESC
             LIMIT ? OFFSET ?`,
            [...params, limitNum, offset]
        )
        const [[{ total }]]: any = await pool.query(
            `SELECT COUNT(*) as total FROM articles a
             LEFT JOIN categories c ON a.category_id = c.id
             ${where}`,
            params
        )
        res.json({
            posts: rows,
            total,
            page: pageNum,
            totalPages: Math.ceil(total / limitNum),
        })
    } catch (err) {
        res.status(500).json({ message: '服务器错误' })
    }
}

export async function getPost(req: Request, res: Response) {
    const { id } = req.params
    try {
        const [rows]: any = await pool.query(
            `SELECT a.*, c.name as category_name, c.slug as category_slug, u.username as author_name
             FROM articles a
             LEFT JOIN categories c ON a.category_id = c.id
             LEFT JOIN users u ON a.author_id = u.id
             WHERE a.id = ?`,
            [id]
        )
        if (rows.length === 0 || rows[0].is_hidden) {
            res.status(404).json({ message: '文章不存在' })
            return
        }
        const post = rows[0]
        await pool.query('UPDATE articles SET view_count = view_count + 1 WHERE id = ?', [id])
        post.view_count++
        res.json({ post })
    } catch {
        res.status(500).json({ message: '服务器错误' })
    }
}

export async function createPost(req: Request, res: Response) {
    const { title, content, summary, cover_image, category_id, is_pinned, status } = req.body
    const author_id = (req as any).user.id
    const isAdmin = (req as any).user.role === 'admin'
    if (!title || !content) {
        res.status(400).json({ message: '标题和内容不能为空' })
        return
    }
    try {
        const [result]: any = await pool.query(
            `INSERT INTO articles (title, content, summary, cover_image, category_id, author_id, is_pinned, status)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [title, content, summary || content.slice(0, 200).replace(/[#*`\n\r]/g, '').trim(), cover_image || null, category_id || null, author_id, isAdmin && is_pinned ? 1 : 0, status || 'draft']
        )
        const [rows]: any = await pool.query('SELECT * FROM articles WHERE id = ?', [result.insertId])
        res.status(201).json({ post: rows[0] })
    } catch (err) {
        res.status(500).json({ message: '服务器错误' })
    }
}

export async function updatePost(req: Request, res: Response) {
    const { id } = req.params
    const { title, content, summary, cover_image, category_id, is_pinned, status } = req.body
    if (!title || !content) {
        res.status(400).json({ message: '标题和内容不能为空' })
        return
    }
    try {
        const [result]: any = await pool.query(
            `UPDATE articles SET title=?, content=?, summary=?, cover_image=?, category_id=?, is_pinned=?, status=? WHERE id=?`,
            [title, content, summary || content.slice(0, 200).replace(/[#*`\n\r]/g, '').trim(), cover_image || null, category_id || null, is_pinned ? 1 : 0, status || 'draft', id]
        )
        if (result.affectedRows === 0) {
            res.status(404).json({ message: '文章不存在' })
            return
        }
        const [rows]: any = await pool.query('SELECT * FROM articles WHERE id = ?', [id])
        res.json({ post: rows[0] })
    } catch {
        res.status(500).json({ message: '服务器错误' })
    }
}

export async function deletePost(req: Request, res: Response) {
    const { id } = req.params
    try {
        const [result]: any = await pool.query('DELETE FROM articles WHERE id = ?', [id])
        if (result.affectedRows === 0) {
            res.status(404).json({ message: '文章不存在' })
            return
        }
        res.json({ message: '删除成功' })
    } catch {
        res.status(500).json({ message: '服务器错误' })
    }
}

export async function toggleHide(req: Request, res: Response) {
    const { id } = req.params
    try {
        const [rows]: any = await pool.query('SELECT id, is_hidden FROM articles WHERE id = ?', [id])
        if (rows.length === 0) {
            res.status(404).json({ message: '文章不存在' })
            return
        }
        const newVal = rows[0].is_hidden ? 0 : 1
        await pool.query('UPDATE articles SET is_hidden = ? WHERE id = ?', [newVal, id])
        res.json({ is_hidden: newVal })
    } catch {
        res.status(500).json({ message: '服务器错误' })
    }
}
