import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
} from 'react';
import type { User } from '../services/authService';
import {
  getToken,
  getStoredUser,
  logout as authLogout,
  INACTIVITY_MS,
} from '../services/authService';

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
}

interface AuthContextValue extends AuthState {
  loginSuccess: (user: User, token: string) => void;
  logout: () => void;
  setUser: (user: User | null) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: null,
    isLoading: true,
  });
  const inactivityRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastActivityRef = useRef<number>(Date.now());

  const logout = useCallback(() => {
    authLogout();
    setState({ user: null, token: null, isLoading: false });
  }, []);

  const resetInactivityTimer = useCallback(() => {
    lastActivityRef.current = Date.now();
    if (inactivityRef.current) clearTimeout(inactivityRef.current);
    inactivityRef.current = setTimeout(() => {
      const token = getToken();
      if (token && Date.now() - lastActivityRef.current >= INACTIVITY_MS) {
        logout();
      }
      inactivityRef.current = null;
    }, INACTIVITY_MS);
  }, [logout]);

  useEffect(() => {
    const token = getToken();
    const user = getStoredUser();
    setState({
      user: user ?? null,
      token: token ?? null,
      isLoading: false,
    });
  }, []);

  useEffect(() => {
    if (!state.token) return;
    const onActivity = () => resetInactivityTimer();
    resetInactivityTimer();
    window.addEventListener('mousedown', onActivity);
    window.addEventListener('keydown', onActivity);
    window.addEventListener('scroll', onActivity);
    return () => {
      if (inactivityRef.current) clearTimeout(inactivityRef.current);
      window.removeEventListener('mousedown', onActivity);
      window.removeEventListener('keydown', onActivity);
      window.removeEventListener('scroll', onActivity);
    };
  }, [state.token, resetInactivityTimer]);

  const loginSuccess = useCallback((user: User, token: string) => {
    setState({ user, token, isLoading: false });
  }, []);

  const setUser = useCallback((user: User | null) => {
    setState((s) => ({ ...s, user }));
  }, []);

  const value: AuthContextValue = {
    ...state,
    loginSuccess,
    logout,
    setUser,
  };

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
