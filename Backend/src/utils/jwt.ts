import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'secret'

export const generateToken = (id: string, role: string, extra: any = {}) => {
    return jwt.sign({ id, role, ...extra }, JWT_SECRET, {
        expiresIn: '30d',
    })
}

export const verifyToken = (token: string) => {
    try {
        return jwt.verify(token, JWT_SECRET)
    } catch (error) {
        return null
    }
}
