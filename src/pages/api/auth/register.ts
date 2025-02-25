import type { NextApiRequest, NextApiResponse } from 'next';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

declare global {
    var mongoose: { conn: null | typeof mongoose; promise: null | Promise<typeof mongoose> };
}

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://mongo_pass-manager:27017/praktika';

if (!MONGODB_URI) {
    throw new Error('Please define MONGODB_URI environment variable');
}

mongoose.set('strictQuery', false);

let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
    console.log('Attempting to connect to MongoDB...');
    
    try {
        // Перевірка існуючого підключення
        if (mongoose.connections[0].readyState) {
            console.log('Using existing MongoDB connection');
            return mongoose.connections[0];
        }
        
        console.log(`Connecting to MongoDB...`);
        
        // Підключення до бази даних
        await mongoose.connect(MONGODB_URI);
        
        console.log('Successfully connected to MongoDB');
        return mongoose.connections[0];
    } catch (error: any) {
        console.error('MongoDB connection error:', error);
        throw new Error(`Failed to connect to database: ${error.message}`);
    }
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

    try {
        await dbConnect();
        
        const { username, password } = req.body;
        const existingUser = await User.findOne({ username });
        
        if (existingUser) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        const user = await User.create({ 
            username, 
            password,
            isAdmin: false
        });

        const token = jwt.sign({ 
            userId: user._id,
            isAdmin: user.isAdmin 
        }, JWT_SECRET, { expiresIn: '24h' });

        return res.status(200).json({ token });
    } catch (error) {
        console.error('Registration error:', error);
        return res.status(500).json({ message: 'Error creating user' });
    }
} 