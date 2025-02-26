import type { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import dbConnect from '../../../lib/dbConnect';
import { validatePassword, validateUsername } from '../../../utils/validation';
import User from 'models/User';
import { generateToken } from '../../../utils/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        console.log('Підключення до бази даних...');
        await dbConnect();
        console.log('Підключено до бази даних');

        const { username, password } = req.body;
        console.log('Отримано запит на реєстрацію для користувача:', username);

        // Валідація даних
        if (!validateUsername(username) || !validatePassword(password)) {
            console.log('Помилка валідації:', { 
                usernameValid: validateUsername(username), 
                passwordValid: validatePassword(password) 
            });
            return res.status(400).json({ 
                message: 'Невірне ім\'я користувача або пароль',
                details: {
                    username: validateUsername(username) ? 'вірний' : 'невірний',
                    password: validatePassword(password) ? 'вірний' : 'невірний'
                }
            });
        }

        // Перевірка існування користувача
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            console.log('Користувач вже існує:', username);
            return res.status(400).json({ message: 'Користувач вже існує' });
        }

        // Хешування пароля
        const hashedPassword = await bcrypt.hash(password, 10);

        // Створення користувача
        const user = await User.create({
            username,
            password: hashedPassword
        });

        // Генерація токена
        const token = generateToken({ userId: user._id.toString() });

        console.log('Користувача успішно створено:', username);
        return res.status(201).json({ 
            message: 'Користувача успішно створено',
            token 
        });
    } catch (error: any) {
        console.error('Помилка реєстрації:', error);
        return res.status(500).json({ 
            message: 'Помилка створення користувача',
            error: process.env.NODE_ENV === 'development' ? 
                error?.message || 'Невідома помилка' : 
                undefined
        });
    }
} 