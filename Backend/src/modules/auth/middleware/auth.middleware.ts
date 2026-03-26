import { Request, Response, NextFunction } from 'express'
import { verifyToken } from '../../../utils/jwt'

export const protect = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies.token

        if (!token) {
            return res.status(401).json({ message: 'Not authorized, no token' })
        }

        const decoded = verifyToken(token) as any
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

export const checkPermission = (permission: string) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const user = (req as any).user;
        
        if (!user || user.role !== 'ADMIN') {
            return res.status(403).json({ message: 'Admin access required' });
        }

        // Super Admin bypasses all permission checks
        if (user.isSuperAdmin) {
            return next();
        }

        // Check assigned permissions
        if (user.permissions && Array.isArray(user.permissions) && user.permissions.includes(permission)) {
            return next();
        }

        return res.status(403).json({ 
            message: `Access denied: You do not have the ${permission.replace(/_/g, ' ').toLowerCase()} permission` 
        });
    };
};
