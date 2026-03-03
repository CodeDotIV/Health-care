/**
 * Frontend-only auth: LocalStorage (mock DB), JWT-like fake token, no backend.
 */

const USERS_KEY = 'health_claim_users';
const TOKEN_KEY = 'health_claim_token';
const REMEMBER_KEY = 'health_claim_remember';
const TOKEN_EXPIRY_MINUTES = 60;
const INACTIVITY_LOGOUT_MINUTES = 10;

export interface User {
  id: string;
  fullName: string;
  email: string;
  companyName?: string;
  role: 'user' | 'analyst' | 'admin';
  createdAt: number;
}

export interface StoredUser extends User {
  passwordHash: string; // in real app hashed; here we store a simple hash for demo
}

export interface AuthTokenPayload {
  userId: string;
  email: string;
  exp: number;
  iat: number;
}

function simpleHash(str: string): string {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    const c = str.charCodeAt(i);
    h = (h << 5) - h + c;
    h |= 0;
  }
  return String(h);
}

function b64Encode(obj: object): string {
  return btoa(JSON.stringify(obj));
}

function b64Decode<T>(str: string): T | null {
  try {
    return JSON.parse(atob(str)) as T;
  } catch {
    return null;
  }
}

export function createToken(user: User): string {
  const now = Math.floor(Date.now() / 1000);
  const payload: AuthTokenPayload = {
    userId: user.id,
    email: user.email,
    iat: now,
    exp: now + TOKEN_EXPIRY_MINUTES * 60,
  };
  return b64Encode(payload);
}

export function parseToken(token: string): AuthTokenPayload | null {
  const payload = b64Decode<AuthTokenPayload>(token);
  if (!payload || !payload.userId || !payload.exp) return null;
  if (payload.exp < Math.floor(Date.now() / 1000)) return null;
  return payload;
}

function getUsers(): StoredUser[] {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function setUsers(users: StoredUser[]): void {
  try {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  } catch (e) {
    throw new Error('Storage full or unavailable. Please free some space.');
  }
}

export function signup(params: {
  fullName: string;
  email: string;
  password: string;
  companyName?: string;
}): { user: User; token: string } {
  const email = params.email.trim().toLowerCase();
  const fullName = params.fullName.trim();
  const users = getUsers();
  if (users.some((u) => u.email.toLowerCase() === email)) {
    throw new Error('An account with this email already exists.');
  }
  const id = `user_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
  const passwordHash = simpleHash(params.password);
  const user: User = {
    id,
    fullName,
    email,
    companyName: params.companyName?.trim() || undefined,
    role: 'user',
    createdAt: Date.now(),
  };
  const stored: StoredUser = { ...user, passwordHash };
  setUsers([...users, stored]);
  const token = createToken(user);
  setToken(token, true);
  return { user, token };
}

export function login(
  email: string,
  password: string,
  rememberMe?: boolean
): { user: User; token: string } {
  const { locked, remainingMs } = checkLoginLockout();
  if (locked) {
    throw new Error(`Too many attempts. Try again in ${Math.ceil(remainingMs / 1000)} seconds.`);
  }
  const normalizedEmail = email.trim().toLowerCase();
  const users = getUsers();
  const stored = users.find((u) => u.email.toLowerCase() === normalizedEmail);
  if (!stored) {
    recordFailedLogin();
    throw new Error('No account found with this email.');
  }
  const passwordHash = simpleHash(password);
  if (stored.passwordHash !== passwordHash) {
    recordFailedLogin();
    throw new Error('Invalid password.');
  }
  clearLoginLockout();
  const user: User = {
    id: stored.id,
    fullName: stored.fullName,
    email: stored.email,
    companyName: stored.companyName,
    role: stored.role,
    createdAt: stored.createdAt,
  };
  const token = createToken(user);
  setToken(token, rememberMe ?? false);
  return { user, token };
}

export function setToken(token: string, remember: boolean): void {
  try {
    sessionStorage.setItem(TOKEN_KEY, token);
    if (remember) {
      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(REMEMBER_KEY, '1');
    } else {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(REMEMBER_KEY);
    }
  } catch (e) {
    throw new Error('Storage full or unavailable.');
  }
}

export function getToken(): string | null {
  const fromSession = sessionStorage.getItem(TOKEN_KEY);
  if (fromSession) return fromSession;
  return localStorage.getItem(TOKEN_KEY);
}

export function logout(): void {
  sessionStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REMEMBER_KEY);
}

export function getStoredUser(): User | null {
  const token = getToken();
  if (!token) return null;
  const payload = parseToken(token);
  if (!payload) return null;
  const users = getUsers();
  const stored = users.find((u) => u.id === payload.userId);
  if (!stored) return null;
  return {
    id: stored.id,
    fullName: stored.fullName,
    email: stored.email,
    companyName: stored.companyName,
    role: stored.role,
    createdAt: stored.createdAt,
  };
}

export const INACTIVITY_MS = INACTIVITY_LOGOUT_MINUTES * 60 * 1000;

const LOGIN_LOCKOUT_MS = 30 * 1000;
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_KEY = 'health_claim_login_lockout';

function getLockoutState(): { attempts: number; lockedUntil: number } {
  try {
    const raw = sessionStorage.getItem(LOCKOUT_KEY);
    if (!raw) return { attempts: 0, lockedUntil: 0 };
    return JSON.parse(raw);
  } catch {
    return { attempts: 0, lockedUntil: 0 };
  }
}

function setLockoutState(attempts: number, lockedUntil: number): void {
  sessionStorage.setItem(LOCKOUT_KEY, JSON.stringify({ attempts, lockedUntil }));
}

export function checkLoginLockout(): { locked: boolean; remainingMs: number } {
  const state = getLockoutState();
  if (state.lockedUntil > Date.now()) {
    return { locked: true, remainingMs: state.lockedUntil - Date.now() };
  }
  if (state.lockedUntil > 0) {
    setLockoutState(0, 0);
  }
  return { locked: false, remainingMs: 0 };
}

export function recordFailedLogin(): void {
  const state = getLockoutState();
  if (state.lockedUntil > Date.now()) return;
  const attempts = state.attempts + 1;
  if (attempts >= MAX_LOGIN_ATTEMPTS) {
    setLockoutState(MAX_LOGIN_ATTEMPTS, Date.now() + LOGIN_LOCKOUT_MS);
  } else {
    setLockoutState(attempts, 0);
  }
}

export function clearLoginLockout(): void {
  sessionStorage.removeItem(LOCKOUT_KEY);
}
