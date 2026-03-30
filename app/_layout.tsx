import "../global.css";

import { useEffect } from 'react';
import { Stack , router, useSegments } from 'expo-router';
import { AuthProvider, useAuth } from '../context/AuthContext';

function AuthGuard() {
  const { token, isLoading } = useAuth();
  const segments = useSegments();

  useEffect(() => {
    if (isLoading) return;

    const inAuthScreen = segments[0] === 'auth';

    if (!token && !inAuthScreen) {
      // Não autenticado → manda para login
      router.replace('/auth');
    } else if (token && inAuthScreen) {
      // Já autenticado → manda para as tabs (index.tsx vai redirecionar para home)
      router.replace('/(tabs)');
    }
  }, [token, isLoading, segments]);

  return null;
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <AuthGuard />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="auth" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
      </Stack>
    </AuthProvider>
  );
}
