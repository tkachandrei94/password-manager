import type { NextApiRequest, NextApiResponse } from 'next';
import mongoose from 'mongoose';
import dbConnect from '../../lib/dbConnect';
import { verifyToken } from 'utils/auth';

// Определяем интерфейс для пароля
interface IPassword {
    userId: string;
    title: string;
    password: string;
}

// Определяем схему для пароля
const PasswordSchema = new mongoose.Schema<IPassword>({
    userId: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

// Создаем или получаем модель
const Password = mongoose.models.Password || mongoose.model<IPassword>('Password', PasswordSchema);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    try {
        const decoded = verifyToken(token);
        await dbConnect();

        switch (req.method) {
            case 'GET':
                const passwords = await Password.find({ userId: decoded.userId });
                return res.status(200).json(passwords);

            case 'POST':
                const newPassword = await Password.create({
                    userId: decoded.userId,
                    title: req.body.title,
                    password: req.body.password
                });
                return res.status(201).json(newPassword);

            default:
                return res.status(405).json({ message: 'Method not allowed' });
        }
    } catch (error) {
        console.error('Password API error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}