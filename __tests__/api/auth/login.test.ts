import { createMocks } from 'node-mocks-http';
import type { NextApiRequest, NextApiResponse } from 'next';

// Мокируем mongoose полностью
jest.mock('mongoose', () => ({
    connect: jest.fn(),
    Schema: jest.fn(),
    model: jest.fn(),
    models: {
        User: {
            findOne: jest.fn()
        }
    }
}));

describe('Login API', () => {
    it('returns 405 for non-POST requests', async () => {
        const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
            method: 'GET',
        });

        const handler = require('../../../src/pages/api/auth/login').default;
        await handler(req, res);
        expect(res._getStatusCode()).toBe(405);
    });

    it('handles login attempt', async () => {
        const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
            method: 'POST',
            body: {
                username: 'testuser',
                password: 'password123'
            },
        });

        const handler = require('../../../src/pages/api/auth/login').default;
        await handler(req, res);
        expect(res._getStatusCode()).toBe(401);
    });
}); 