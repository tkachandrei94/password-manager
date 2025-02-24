import type { NextApiRequest, NextApiResponse } from 'next';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

// Типи відповіді
type ResponseData = {
    token?: string;
    message?: string;
    error?: string;
};

// Правильне оголошення глобальної змінної
declare global {
    var mongoose: {
        conn: typeof mongoose | null;
        promise: Promise<typeof mongoose> | null;
    } | undefined;
}

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/password-manager';

// Функція підключення до бази даних
async function dbConnect() {
    try {
        if (mongoose.connections[0].readyState) {
            return mongoose.connections[0];
        }

        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');
        return mongoose.connections[0];
    } catch (error) {
        console.error('MongoDB connection error:', error);
        throw new Error('Failed to connect to database');
    }
}

// Схема користувача
const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username is required'],
        unique: true,
        trim: true,
        minlength: [3, 'Username must be at least 3 characters']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters']
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Модель користувача
const User = mongoose.models.User || mongoose.model('User', UserSchema);

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
    // Перевірка методу запиту
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        // Підключення до бази даних
        await dbConnect();
        
        const { username, password } = req.body;
        
        // Валідація вхідних даних
        if (!username || !password) {
            return res.status(400).json({ message: 'Username and password are required' });
        }
        
        if (username.length < 3) {
            return res.status(400).json({ message: 'Username must be at least 3 characters' });
        }
        
        if (password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters' });
        }
        
        // Перевірка на існуючого користувача
        const existingUser = await User.findOne({ username });
        
        if (existingUser) {
            return res.status(400).json({ message: 'Username already exists' });
        }
        
        // Хешування пароля
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        // Створення нового користувача
        const user = await User.create({ 
            username, 
            password: hashedPassword,
            isAdmin: false
        });
        
        // Генерація JWT токена
        const token = jwt.sign({ 
            userId: user._id,
            username: user.username,
            isAdmin: user.isAdmin 
        }, JWT_SECRET, { expiresIn: '24h' });
        
        // Успішна відповідь
        return res.status(201).json({ 
            token,
            message: 'User registered successfully' 
        });
    } catch (error: any) {
        console.error('Registration error:', error);
        
        // Обробка помилок MongoDB
        if (error instanceof mongoose.Error.ValidationError) {
            const messages = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({ message: messages.join(', ') });
        }
        
        // Обробка помилок дублікатів
        if (error.code === 11000) {
            return res.status(400).json({ message: 'Username already exists' });
        }
        
        // Загальна помилка сервера
        return res.status(500).json({ 
            message: 'Error creating user',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
}