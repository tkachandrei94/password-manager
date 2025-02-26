import type { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import dbConnect from '../../../lib/dbConnect';
import User from '../../../models/User';
import { generateToken } from '../../../utils/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).end();
    }

    try {
        await dbConnect();
        
        const { username, password } = req.body;
        const normalizedUsername = username.toLowerCase(); // Приводим к нижнему регистру
        console.log("Спроба входу для користувача:", normalizedUsername);

        // Знаходимо користувача
        const user = await User.findOne({ 
            username: { $regex: new RegExp(`^${normalizedUsername}$`, 'i') } 
        });
        
        if (!user) {
            console.log("Користувача не знайдено");
            return res.status(401).json({ message: 'Невірний логін або пароль' });
        }

        // Перевіряємо пароль
        const isValidPassword = await bcrypt.compare(password, user.password);
        
        if (!isValidPassword) {
            console.log("Невірний пароль");
            return res.status(401).json({ message: 'Невірний логін або пароль' });
        }

        // Генеруємо токен
        const token = generateToken({ 
            userId: user._id.toString(),
            isAdmin: user.isAdmin 
        });

        console.log("Успішний вхід для користувача:", normalizedUsername);
        return res.status(200).json({ token });
    } catch (error) {
        console.error("Помилка входу:", error);
        return res.status(500).json({ message: 'Помилка входу в систему' });
    }
} 