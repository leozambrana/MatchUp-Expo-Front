import { Stack } from 'expo-router';
import { AuthProvider } from '@/context/AuthContext';
import "../../global.css";
import { useServiceWorker } from '@/hooks/useServiceWorker';

export default function RootLayout() {
  useServiceWorker();

  return (
    <AuthProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="auth" />
        <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
    </AuthProvider>
  );
}