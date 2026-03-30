import React, { createContext, useContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';

interface AuthContextData {
  token: string | null;
  isLoading: boolean;
  signIn: (token: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadToken() {
      try {
        const stored = await SecureStore.getItemAsync('auth_token');
        if (stored) setToken(stored);
      } catch (e) {
        console.error('Erro ao carregar token', e);
      } finally {
        setIsLoading(false);
      }
    }
    loadToken();
  }, []);

  async function signIn(newToken: string) {
    await SecureStore.setItemAsync('auth_token', newToken);
    setToken(newToken);
  }

  async function signOut() {
    await SecureStore.deleteItemAsync('auth_token');
    setToken(null);
  }

  return (
    <AuthContext.Provider value={{ token, isLoading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
