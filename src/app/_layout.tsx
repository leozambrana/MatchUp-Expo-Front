import { AuthProvider, useAuth } from "@/context/AuthContext";
import { useServiceWorker } from "@/hooks/useServiceWorker";
import { Stack, useRouter } from "expo-router";
import { useEffect } from "react";
import "../../global.css";

export default function RootLayout() {
  useServiceWorker();
  const router = useRouter();

  const { token, isLoading } = useAuth();
  useEffect(() => {
    if (!isLoading) {
      if (!token) {
        // só navega depois que o layout está pronto
        setTimeout(() => {
          router.replace("/auth");
        }, 0);
      }
    }
  }, [isLoading, token]);

  return (
    <AuthProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="auth" />
        <Stack.Screen name="modal" options={{ presentation: "modal" }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
    </AuthProvider>
  );
}
