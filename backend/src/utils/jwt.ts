import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

const SECRET = process.env.JWT_SECRET || 'fallback_secret'

export function signToken(payload: { id: number; username: string; role: string }) {
    return jwt.sign(payload, SECRET, { expiresIn: '24h' })
}

export function verifyToken(token: string) {
    return jwt.verify(token, SECRET) as { id: number; username: string; role: string }
}
