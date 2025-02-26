require('@testing-library/jest-dom');

const { TextEncoder, TextDecoder } = require('util');
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

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