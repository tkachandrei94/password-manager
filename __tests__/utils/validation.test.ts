import { validateEmail, validatePassword } from '../../src/utils/validation';

describe('Validation Utils', () => {
    describe('validateEmail', () => {
        it('validates correct email', () => {
            expect(validateEmail('test@example.com')).toBe(true);
        });

        it('invalidates incorrect email', () => {
            expect(validateEmail('invalid-email')).toBe(false);
        });
    });

    describe('validatePassword', () => {
        it('validates correct password', () => {
            expect(validatePassword('Password123!')).toBe(true);
        });

        it('invalidates weak password', () => {
            expect(validatePassword('pa')).toBe(false);
        });
    });
}); 