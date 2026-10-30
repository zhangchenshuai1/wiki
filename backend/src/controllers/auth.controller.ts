import { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import pool from '../config/db'
import { signToken } from '../utils/jwt'

export async function register(req: Request, res: Response) {
    const { username, password } = req.body
    if (!username || !password) {
        res.status(400).json({ message: '请输入用户名和密码' })
        return
    }
    if (password.length < 6) {
        res.status(400).json({ message: '密码至少6位' })
        return
    }
    try {
        const [exist]: any = await pool.query('SELECT id FROM users WHERE username = ?', [username])
        if (exist.length > 0) {
            res.status(409).json({ message: '用户名已被注册' })
            return
        }
        const hashed = await bcrypt.hash(password, 10)
        const [result]: any = await pool.query(
            'INSERT INTO users (username, password, role) VALUES (?, ?, ?)',
            [username, hashed, 'user']
        )
        const token = signToken({ id: result.insertId, username, role: 'user' })
        res.status(201).json({
            token,
            user: { id: result.insertId, username, role: 'user' },
        })
    } catch {
        res.status(500).json({ message: '服务器错误' })
    }
}

export async function login(req: Request, res: Response) {
    const { username, password } = req.body
    if (!username || !password) {
        res.status(400).json({ message: '请输入用户名和密码' })
        return
    }
    try {
        const [rows]: any = await pool.query(
            'SELECT id, username, password, role FROM users WHERE username = ?',
            [username]
        )
        if (rows.length === 0) {
            res.status(401).json({ message: '用户名或密码错误' })
            return
        }
        const user = rows[0]
        const valid = await bcrypt.compare(password, user.password)
        if (!valid) {
            res.status(401).json({ message: '用户名或密码错误' })
            return
        }
        const token = signToken({ id: user.id, username: user.username, role: user.role })
        res.json({
            token,
            user: {
                id: user.id,
                username: user.username,
                role: user.role,
            },
        })
    } catch (err) {
        res.status(500).json({ message: '服务器错误' })
    }
}

export async function getUser(req: Request, res: Response) {
    const { id } = (req as any).user
    try {
        const [rows]: any = await pool.query(
            'SELECT id, username, role FROM users WHERE id = ?',
            [id]
        )
        if (rows.length === 0) {
            res.status(404).json({ message: '用户不存在' })
            return
        }
        res.json({ user: rows[0] })
    } catch {
        res.status(500).json({ message: '服务器错误' })
    }
}
