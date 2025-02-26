import mongoose from 'mongoose';

// Определяем интерфейс для пользователя
export interface IUser {
    username: string;
    password: string;
    isAdmin?: boolean;
}

// Определяем схему для пользователя
const UserSchema = new mongoose.Schema<IUser>({
    username: {
        type: String,
        required: [true, 'Please provide a username'],
        unique: true,
        minlength: [3, 'Username must be at least 3 characters long']
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: [6, 'Password must be at least 6 characters long']
    },
    isAdmin: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true // Добавляет поля createdAt и updatedAt
});

// Проверяем, не зарегистрирована ли уже модель
export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema); 