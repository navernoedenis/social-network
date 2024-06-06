import { createOtpPassword } from './passwords';

describe('test passwords helpers', () => {
  describe('create-otp-password', () => {
    test('should give 6 numbers by default', () => {
      const otp = createOtpPassword();
      expect(`${otp}`).toHaveLength(6);
    });

    test('first number is not 0', () => {
      for (let i = 0; i < 50; i++) {
        const otp = createOtpPassword();
        expect(`${otp}`[0]).not.toBe('0');
      }
    });
  });
});
