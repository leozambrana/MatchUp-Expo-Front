import { storage } from "@/utils/secure";
import React, { createContext, useContext, useEffect, useState } from "react";
import { DeviceEventEmitter, Platform } from "react-native";

interface AuthContextData {
  token: string | null;
  isLoading: boolean;
  signIn: (token: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Na web, lê o localStorage de forma síncrona no useState
  const [token, setToken] = useState<string | null>(() => {
    if (Platform.OS === "web" && typeof window !== "undefined") {
      return localStorage.getItem("auth_token");
    }
    return null;
  });

  // Na web já temos o token de forma síncrona, não precisa de loading
  const [isLoading, setIsLoading] = useState(Platform.OS !== "web");

  useEffect(() => {
    // Só carrega async no nativo (iOS/Android)
    if (Platform.OS === "web") return;

    async function loadToken() {
      try {
        const stored = await storage.getItem("auth_token");
        if (stored) setToken(stored);
      } catch (e) {
        console.error("Erro ao carregar token", e);
      } finally {
        setIsLoading(false);
      }
    }
    loadToken();
  }, []);

  async function signIn(newToken: string) {
    try {
      await storage.setItem("auth_token", newToken);
      setToken(newToken);
    } catch (e) {
      console.error("Error saving token:", e);
      throw new Error("Não foi possível salvar o token de autenticação");
    }
  }

  async function signOut() {
    await storage.removeItem("auth_token");
    setToken(null);
  }

  // 🔑 Listener para token expirado (web + mobile)
  useEffect(() => {
    function handleExpired() {
      console.warn("Token expirado, forçando signOut");
      signOut();
    }

    if (Platform.OS === "web") {
      window.addEventListener("auth:expired", handleExpired);
      return () => window.removeEventListener("auth:expired", handleExpired);
    } else {
      const subscription = DeviceEventEmitter.addListener(
        "auth:expired",
        handleExpired,
      );
      return () => subscription.remove();
    }
  }, []);

  return (
    <AuthContext.Provider value={{ token, isLoading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
