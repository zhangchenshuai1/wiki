import { Request, Response, NextFunction } from 'express'
import { verifyToken } from '../utils/jwt'

export function auth(req: Request, res: Response, next: NextFunction) {
    const header = req.headers.authorization
    if (!header || !header.startsWith('Bearer ')) {
        res.status(401).json({ message: '请先登录' })
        return
    }
    const token = header.split(' ')[1]
    try {
        const decoded = verifyToken(token)
        ;(req as any).user = decoded
        next()
    } catch {
        res.status(401).json({ message: '登录已过期，请重新登录' })
    }
}
