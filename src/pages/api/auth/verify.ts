import type { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const authHeader = req.headers.authorization;
        
        if (!authHeader) {
            return res.status(401).json({ message: 'No authorization header' });
        }
        
        const token = authHeader.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }
        
        // Перевірка токена
        const decoded = jwt.verify(token, JWT_SECRET);
        return res.status(200).json({ valid: true, user: decoded });
    } catch (error) {
        return res.status(401).json({ message: 'Invalid token' });
    }
} 