require('@testing-library/jest-dom');

const { TextEncoder, TextDecoder } = require('util');
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Добавляем переменные окружения для тестов
process.env.MONGODB_URI = 'mongodb://localhost:27017/test-db';
process.env.JWT_SECRET = 'test-secret-key';
process.env.NODE_ENV = 'test';

const mockRouter = {
    push: jest.fn(),
    prefetch: jest.fn(),
    query: {}
};

jest.mock('next/router', () => ({
    useRouter: () => mockRouter
}));

Object.defineProperty(window, 'localStorage', {
    value: {
        getItem: jest.fn(),
        setItem: jest.fn(),
        clear: jest.fn(),
        removeItem: jest.fn(),
    },
});

jest.mock('src/lib/dbConnect', () => jest.fn()); 