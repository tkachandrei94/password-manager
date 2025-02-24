import type { NextApiRequest, NextApiResponse } from 'next';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    throw new Error('Please define MONGODB_URI environment variable');
}

const UserSchema = new mongoose.Schema({
    username: String,
    password: String,
    isAdmin: { type: Boolean, default: false }
});

const User = mongoose.models.User || mongoose.model('User', UserSchema);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).end();
    }

    const { username, password } = req.body;
    console.log("username:", username);
    console.log("password:", password);
    try {
        const user = await User.findOne({ username, password });
        console.log("user:", user);
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ 
            userId: user._id,
            isAdmin: user.isAdmin 
        }, JWT_SECRET, { expiresIn: '24h' });

        return res.status(200).json({ token });
    } catch (error) {
        return res.status(500).json({ message: 'Login error' });
    }
} 