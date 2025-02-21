declare global {
    namespace NodeJS {
        interface Global {
            mongo: {
                conn: any;
                promise: Promise<any> | null;
            };
        }
    }
}

export const mongoose = global.mongoose || new Connection()

if (process.env.NODE_ENV !== 'production') global.mongoose = mongoose

export {};