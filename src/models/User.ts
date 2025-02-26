import mongoose from 'mongoose';

// Визначаємо інтерфейс для користувача
export interface IUser {
    username: string;
    password: string;
    isAdmin?: boolean;
}

// Визначаємо схему для користувача
const UserSchema = new mongoose.Schema<IUser>({
    username: {
        type: String,
        required: [true, 'Будь ласка, вкажіть ім\'я користувача'],
        unique: true,
        minlength: [3, 'Ім\'я користувача має бути не менше 3 символів']
    },
    password: {
        type: String,
        required: [true, 'Будь ласка, вкажіть пароль'],
        minlength: [3, 'Пароль має бути не менше 3 символів']
    },
    isAdmin: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true // Додає поля createdAt та updatedAt
});

// Перевіряємо, чи не зареєстрована вже модель
export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema); 