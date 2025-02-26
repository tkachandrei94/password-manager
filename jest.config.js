const nextJest = require('next/jest');

const createJestConfig = nextJest({
    dir: './',
});

const customJestConfig = {
    moduleDirectories: ['node_modules', '<rootDir>/'],
    testEnvironment: 'jest-environment-jsdom',
    setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
    moduleNameMapper: {
        '^models/(.*)$': '<rootDir>/src/models/$1',
    },
    testEnvironmentOptions: {
        env: {
            MONGODB_URI: 'mongodb://localhost:27017/test-db',
            JWT_SECRET: 'test-secret-key',
            NODE_ENV: 'test'
        }
    }
};

module.exports = createJestConfig(customJestConfig); 