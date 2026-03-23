import { Request, Response, NextFunction } from 'express'
import { verifyToken } from '../../../utils/jwt'

export const protect = async (req: Request, res: Response, next: NextFunction) => {
    try {
        console.log('[AuthMiddleware] Cookies:', req.cookies);
        const token = req.cookies.token

        if (!token) {
            console.log('[AuthMiddleware] No token found in cookies');
            return res.status(401).json({ message: 'Not authorized, no token' })
        }

        const decoded = verifyToken(token) as { id: string, role: string }
        if (!decoded) {
            return res.status(401).json({ message: 'Not authorized, invalid token' })
        }

        ;(req as any).user = decoded
        next()
    } catch (error) {
        console.error(error)
        res.status(401).json({ message: 'Not authorized' })
    }
}

export const restrictTo = (...roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const user = (req as any).user;
        if (!user || !roles.includes(user.role)) {
            return res.status(403).json({ 
                message: 'You do not have permission to perform this action' 
            });
        }
        next();
    };
};
