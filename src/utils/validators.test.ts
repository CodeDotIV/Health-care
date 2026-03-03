import { describe, it, expect } from 'vitest';
import {
  validateEmail,
  validatePassword,
  validateFullName,
  validateConfirmPassword,
  PASSWORD_REGEX,
  sanitizeInput,
} from './validators';

describe('validators', () => {
  describe('validateEmail', () => {
    it('rejects empty', () => {
      expect(validateEmail('').valid).toBe(false);
      expect(validateEmail('   ').valid).toBe(false);
    });
    it('rejects invalid format', () => {
      expect(validateEmail('abc').valid).toBe(false);
      expect(validateEmail('a@').valid).toBe(false);
      expect(validateEmail('@b.com').valid).toBe(false);
    });
    it('accepts valid email', () => {
      expect(validateEmail('a@b.co').valid).toBe(true);
      expect(validateEmail('user@example.com').valid).toBe(true);
    });
  });

  describe('validatePassword', () => {
    it('rejects empty', () => {
      expect(validatePassword('').valid).toBe(false);
    });
    it('rejects short password', () => {
      expect(validatePassword('1234567').valid).toBe(false);
    });
    it('accepts 8 chars with upper, lower, number, special', () => {
      expect(validatePassword('Abcdef1!').valid).toBe(true);
      expect(validatePassword('Pass123@').valid).toBe(true);
    });
    it('rejects weak password (no special)', () => {
      expect(validatePassword('Abcdef12').valid).toBe(false);
    });
    it('PASSWORD_REGEX matches valid', () => {
      expect(PASSWORD_REGEX.test('Abcdef1!')).toBe(true);
    });
    it('rejects 7 chars', () => {
      expect(validatePassword('Abcde1!').valid).toBe(false);
    });
  });

  describe('validateFullName', () => {
    it('rejects empty', () => {
      expect(validateFullName('').valid).toBe(false);
    });
    it('rejects 2 chars', () => {
      expect(validateFullName('ab').valid).toBe(false);
    });
    it('accepts 3 chars', () => {
      expect(validateFullName('abc').valid).toBe(true);
      expect(validateFullName('John Doe').valid).toBe(true);
    });
  });

  describe('validateConfirmPassword', () => {
    it('rejects mismatch', () => {
      expect(validateConfirmPassword('abc', 'abd').valid).toBe(false);
    });
    it('accepts match', () => {
      expect(validateConfirmPassword('Pass1!', 'Pass1!').valid).toBe(true);
    });
    it('rejects empty confirm', () => {
      expect(validateConfirmPassword('Pass1!', '').valid).toBe(false);
    });
  });

  describe('sanitizeInput', () => {
    it('trims whitespace', () => {
      expect(sanitizeInput('  foo  ')).toBe('foo');
    });
    it('strips script tags', () => {
      expect(sanitizeInput('hello <script>alert(1)</script> world')).not.toContain('script');
    });
  });
});
