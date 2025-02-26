import { createMocks } from 'node-mocks-http';
import type { NextApiRequest, NextApiResponse } from 'next';

// Мокируем mongoose и его методы
jest.mock('mongoose', () => ({
    connect: jest.fn().mockResolvedValue(true),
    Schema: jest.fn(),
    model: jest.fn(),
    models: {
        User: {
            findOne: jest.fn().mockResolvedValue(null),
            create: jest.fn().mockResolvedValue({ _id: 'test-id' })
        }
    },
    set: jest.fn(),
    connections: [{ readyState: 1 }]
}));

// Мокируем bcrypt
jest.mock('bcryptjs', () => ({
    hash: jest.fn().mockResolvedValue('hashed_password'),
    compare: jest.fn().mockResolvedValue(true)
}));

// Мокируем валидацию
jest.mock('../../../src/utils/validation', () => ({
    validatePassword: jest.fn().mockReturnValue(false),
    validateUsername: jest.fn().mockReturnValue(false)
}));

describe('Register API', () => {
    it('returns 405 for non-POST requests', async () => {
        const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
            method: 'GET',
        });

        const handler = require('../../../src/pages/api/auth/register').default;
        await handler(req, res);
        expect(res._getStatusCode()).toBe(405);
    });

    it('returns 200', async () => {
        const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
            method: 'POST',
            body: {
                username: 'test',
                password: 'weak'
            },
        });

        const handler = require('../../../src/pages/api/auth/register').default;
        await handler(req, res);
        expect(res._getStatusCode()).toBe(200);
    });
}); 