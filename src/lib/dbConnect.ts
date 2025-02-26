import mongoose from 'mongoose';

if (!process.env.MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable inside .env');
}

const MONGODB_URI = process.env.MONGODB_URI;

// Визначаємо типи
type GlobalMongoose = {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
};

// Глобальний тип для mongoose
declare global {
    var mongoose: GlobalMongoose | undefined;
}

let cached: GlobalMongoose;

if (!global.mongoose) {
    cached = {
        conn: null,
        promise: null
    };
    global.mongoose = cached;
} else {
    cached = global.mongoose;
}

async function dbConnect(): Promise<typeof mongoose> {
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        const opts = {
            bufferCommands: false,
        };

        cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
            return mongoose;
        });
    }

    try {
        cached.conn = await cached.promise;
    } catch (e) {
        cached.promise = null;
        throw e;
    }

    return cached.conn;
}

export default dbConnect; 