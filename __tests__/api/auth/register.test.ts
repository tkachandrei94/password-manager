import { createMocks } from 'node-mocks-http';
import handler from '../../../src/pages/api/auth/register';
import User from '../../../src/models/User';

jest.mock('../../../src/models/User');
jest.mock('../../../src/lib/dbConnect', () => jest.fn());

describe('Register API', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('returns 405 for non-POST requests', async () => {
        const { req, res } = createMocks({
            method: 'GET',
        });

        await handler(req, res);

        expect(res._getStatusCode()).toBe(405);
        expect(JSON.parse(res._getData())).toEqual({
            message: 'Method not allowed',
        });
    });

    it('returns 201 for successful registration', async () => {
        const { req, res } = createMocks({
            method: 'POST',
            body: {
                username: 'testuser',
                password: 'password123',
            },
        });

        await handler(req, res);

        expect(res._getStatusCode()).toBe(201);
        expect(JSON.parse(res._getData())).toMatchObject({
            message: 'Користувача успішно створено',
            token: expect.any(String),
        });
    });

    it('returns 400 for invalid input', async () => {
        const { req, res } = createMocks({
            method: 'POST',
            body: {
                username: 'te',  // слишком короткое имя
                password: '123', // слишком короткий пароль
            },
        });

        await handler(req, res);

        expect(res._getStatusCode()).toBe(400);
        expect(JSON.parse(res._getData())).toMatchObject({
            message: 'Невірне ім\'я користувача або пароль',
        });
    });
}); 