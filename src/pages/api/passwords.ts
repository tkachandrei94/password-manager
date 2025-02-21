import type { NextApiRequest, NextApiResponse } from 'next';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    throw new Error('Please define MONGODB_URI environment variable');
}

// Схема пользователя
const UserSchema = new mongoose.Schema({
    username: String,
    password: String,
    isAdmin: { type: Boolean, default: false }
});

// Схема пароля с привязкой к пользователю
const PasswordSchema = new mongoose.Schema({
    title: String,
    password: String,
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

const User = mongoose.models.User || mongoose.model('User', UserSchema);
const Password = mongoose.models.Password || mongoose.model('Password', PasswordSchema);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; isAdmin: boolean };
        
        if (req.method === 'GET') {
            const user = await User.findById(decoded.userId);
            const passwords = user.isAdmin 
                ? await Password.find() // админ видит все пароли
                : await Password.find({ userId: decoded.userId }); // пользователь видит только свои
            return res.status(200).json(passwords);
        }

        if (req.method === 'POST') {
            const { title, password } = req.body;
            const newPassword = await Password.create({
                title,
                password,
                userId: decoded.userId
            });
            return res.status(201).json(newPassword);
        }

        return res.status(405).json({ message: 'Method not allowed' });
    } catch (error) {
        return res.status(401).json({ message: 'Invalid token' });
    }
}