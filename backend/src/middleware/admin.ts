import { Request, Response, NextFunction } from 'express'

export function admin(req: Request, res: Response, next: NextFunction) {
    const user = (req as any).user
    if (!user || user.role !== 'admin') {
        res.status(403).json({ message: '需要管理员权限' })
        return
    }
    next()
}
