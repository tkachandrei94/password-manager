import type { NextApiRequest, NextApiResponse } from 'next';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

// Типи відповіді
type ResponseData = {
    message?: string;
    error?: string;
    data?: any;
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

// Схема паролів
const PasswordSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Модель паролів
const Password = mongoose.models.Password || mongoose.model('Password', PasswordSchema);

// Функція перевірки авторизації
function verifyToken(req: NextApiRequest): { userId: string } | null {
    console.log('Verifying authentication token...');
    
    try {
        const authHeader = req.headers.authorization;
        
        if (!authHeader) {
            console.warn('No authorization header provided');
            return null;
        }
        
        const token = authHeader.split(' ')[1];
        
        if (!token) {
            console.warn('No token provided in authorization header');
            return null;
        }
        
        const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
        console.log(`Token verified for user ID: ${decoded.userId}`);
        return decoded;
    } catch (error: any) {
        console.error('Token verification failed:', error);
        return null;
    }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
    console.log(`[${new Date().toISOString()}] Password API request: ${req.method}`);
    
    // Перевірка авторизації
    const tokenData = verifyToken(req);
    
    if (!tokenData) {
        console.warn('Unauthorized access attempt');
        return res.status(401).json({ message: 'Unauthorized' });
    }
    
    // Підключення до бази даних
    try {
        console.log('Connecting to database...');
        await dbConnect();
    } catch (dbError: any) {
        console.error('Database connection failed:', dbError);
        return res.status(500).json({ 
            message: 'Database connection failed',
            error: dbError.message
        });
    }
    
    // Обробка GET запиту (отримання паролів)
    if (req.method === 'GET') {
        console.log(`Fetching passwords for user: ${tokenData.userId}`);
        
        try {
            const passwords = await Password.find({ userId: tokenData.userId })
                .sort({ createdAt: -1 });
            
            console.log(`Found ${passwords.length} passwords`);
            return res.status(200).json({ data: passwords });
        } catch (error: any) {
            console.error('Error fetching passwords:', error);
            return res.status(500).json({ 
                message: 'Error fetching passwords',
                error: error.message
            });
        }
    }
    
    // Обробка POST запиту (створення пароля)
    if (req.method === 'POST') {
        console.log('Creating new password entry');
        
        try {
            const { title, password } = req.body;
            
            // Валідація вхідних даних
            if (!title || !password) {
                console.warn('Missing title or password');
                return res.status(400).json({ message: 'Title and password are required' });
            }
            
            // Створення нового запису пароля
            const newPassword = await Password.create({
                userId: tokenData.userId,
                title,
                password
            });
            
            console.log(`Password created with ID: ${newPassword._id}`);
            return res.status(201).json(newPassword);
        } catch (error: any) {
            console.error('Error creating password:', error);
            
            // Обробка помилок валідації
            if (error instanceof mongoose.Error.ValidationError) {
                const messages = Object.values(error.errors).map(err => err.message);
                return res.status(400).json({ message: messages.join(', ') });
            }
            
            return res.status(500).json({ 
                message: 'Error creating password',
                error: error.message
            });
        }
    }
    
    // Обробка невідомих методів
    console.warn(`Unsupported method: ${req.method}`);
    return res.status(405).json({ message: 'Method not allowed' });
}