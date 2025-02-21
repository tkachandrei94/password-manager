import mongoose from 'mongoose';

const PasswordSchema = new mongoose.Schema({
    name: { type: String, required: true },
    password: { type: String, required: true },
});

export default mongoose.models.Password || mongoose.model('Password', PasswordSchema); 