import { Ionicons } from '@expo/vector-icons';
import { Redirect, Tabs } from 'expo-router';
import React from 'react';

// Coloque esse componente no _layout.tsx de (tabs)
// para proteger todas as rotas autenticadas


import { ActivityIndicator, View } from 'react-native';
import { useAuth } from '../../context/AuthContext';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { token, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator color="#a3e635" />
      </View>
    );
  }

  if (!token) {
    return <Redirect href="/auth" />;
  }

  return <>{children}</>;
}

export default function TabLayout() {
  return (
    <ProtectedRoute>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: '#C8F135',
          tabBarInactiveTintColor: '#666',
          tabBarStyle: {
            backgroundColor: '#141414',
            borderTopColor: '#222',
          },
          headerShown: false,
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            title: 'Início',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="home" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Perfil',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="person" size={size} color={color} />
            ),
          }}
        />
        
        {/* Telas sem tab - estas serão modais */}
        <Tabs.Screen
          name="create-game"
          options={{
            headerShown: false,
            href: '/create-game',
            // Esta tela será acessada via modal
            // Não precisa de presentation pois não é uma tab
            // O router.push('/create-game') vai funcionar
            // como uma modal sobre as tabs
            // quando implementado corretamente no futuro
            // Por enquanto, vamos deixar assim
            // e testar se funciona
          }}
        />
      </Tabs>
    </ProtectedRoute>
  );
}
