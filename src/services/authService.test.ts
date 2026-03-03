import { describe, it, expect, beforeEach } from 'vitest';
import {
  signup,
  login,
  logout,
  getToken,
  getStoredUser,
  createToken,
  parseToken,
  checkLoginLockout,
  clearLoginLockout,
} from './authService';

describe('authService', () => {
  beforeEach(() => {
    logout();
    clearLoginLockout();
    try {
      localStorage.clear();
      sessionStorage.clear();
    } catch {
      // ignore
    }
  });

  it('signup creates user and returns token', () => {
    const { user, token } = signup({
      fullName: 'Test User',
      email: 'test@example.com',
      password: 'Password1!',
    });
    expect(user.fullName).toBe('Test User');
    expect(user.email).toBe('test@example.com');
    expect(token).toBeTruthy();
    expect(getToken()).toBe(token);
  });

  it('signup throws when email already exists', () => {
    signup({
      fullName: 'First',
      email: 'same@example.com',
      password: 'Password1!',
    });
    expect(() =>
      signup({
        fullName: 'Second',
        email: 'same@example.com',
        password: 'Other1!',
      })
    ).toThrow(/already exists/);
  });

  it('login with valid credentials returns user and token', () => {
    signup({
      fullName: 'Login Test',
      email: 'login@example.com',
      password: 'Password1!',
    });
    logout();
    const { user, token } = login('login@example.com', 'Password1!');
    expect(user.email).toBe('login@example.com');
    expect(token).toBeTruthy();
  });

  it('login is case-insensitive for email', () => {
    signup({
      fullName: 'Case Test',
      email: 'Case@Example.com',
      password: 'Password1!',
    });
    logout();
    const { user } = login('case@example.com', 'Password1!');
    expect(user.email).toBe('case@example.com');
  });

  it('login throws when email not registered', () => {
    expect(() => login('nobody@example.com', 'Password1!')).toThrow(/No account/);
  });

  it('login throws when password wrong', () => {
    signup({
      fullName: 'Wrong',
      email: 'wrong@example.com',
      password: 'Password1!',
    });
    logout();
    expect(() => login('wrong@example.com', 'WrongPass1!')).toThrow(/Invalid password/);
  });

  it('logout clears token', () => {
    const { token } = signup({
      fullName: 'Logout',
      email: 'logout@example.com',
      password: 'Password1!',
    });
    expect(getToken()).toBe(token);
    logout();
    expect(getToken()).toBeNull();
  });

  it('getStoredUser returns user when token valid', () => {
    const { user } = signup({
      fullName: 'Stored',
      email: 'stored@example.com',
      password: 'Password1!',
    });
    const stored = getStoredUser();
    expect(stored?.email).toBe(user.email);
  });

  it('createToken and parseToken roundtrip', () => {
    const user = {
      id: 'u1',
      fullName: 'T',
      email: 't@t.com',
      role: 'user' as const,
      createdAt: 0,
    };
    const token = createToken(user);
    const payload = parseToken(token);
    expect(payload?.userId).toBe('u1');
    expect(payload?.email).toBe('t@t.com');
  });

  it('checkLoginLockout returns not locked initially', () => {
    const { locked } = checkLoginLockout();
    expect(locked).toBe(false);
  });
});
