import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/context/AuthContext';
import { authService } from '@/modules/auth/services/AuthService';

export function ProfileScreen() {
  const { token, signOut } = useAuth();
  const [loading, setLoading] = React.useState(false);

  const handleLogout = async () => {
    Alert.alert(
      'Sair',
      'Tem certeza que deseja sair da sua conta?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sair',
          style: 'destructive',
          onPress: async () => {
            setLoading(true);
            try {
              await authService.logout();
              await signOut();
              Alert.alert('Sucesso', 'Você saiu da sua conta');
            } catch (error: any) {
              Alert.alert('Erro', error.message || 'Não foi possível sair');
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  const handleEditProfile = () => {
    Alert.alert('Editar Perfil', 'Funcionalidade em desenvolvimento!');
  };

  const handleMyGames = () => {
    Alert.alert('Meus Jogos', 'Você já está na tela de jogos!');
  };

  const handleSettings = () => {
    Alert.alert('Configurações', 'Funcionalidade em desenvolvimento!');
  };

  if (!token) {
    return (
      <View className="flex-1 bg-black justify-center items-center">
        <Text className="text-white text-lg">Faça login para ver seu perfil</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-black">
      {/* Header */}
      <View className="bg-neutral-900 border-b border-neutral-800 px-4 py-4">
        <View className="flex-row items-center gap-3">
          <Text className="text-white text-xl font-bold">Perfil</Text>
        </View>
      </View>

      <View className="flex-1 px-4 py-6">
        {/* Avatar */}
        <View className="items-center mb-6">
          <View className="w-24 h-24 rounded-full bg-neutral-800 border-2 border-neutral-700 items-center justify-center">
            <Ionicons name="person" size={40} color="#666" />
          </View>
          <TouchableOpacity 
            className="bg-lime-400 px-3 py-1 rounded-lg mt-2"
            onPress={handleEditProfile}
          >
            <Text className="text-black font-semibold text-xs">Editar Foto</Text>
          </TouchableOpacity>
        </View>

        {/* User Info */}
        <View className="bg-neutral-900 rounded-xl p-4 mb-6">
          <View className="items-center mb-4">
            <Text className="text-white text-2xl font-bold">Nome do Usuário</Text>
          </View>
          <View className="bg-neutral-800 rounded-lg px-4 py-2">
            <Text className="text-neutral-300 text-center">usuario@exemplo.com</Text>
          </View>
        </View>

        {/* Menu Options */}
        <View className="gap-4">
          <TouchableOpacity
            className="bg-neutral-900 rounded-xl p-4 flex-row items-center justify-between"
            onPress={handleMyGames}
          >
            <View className="flex-row items-center gap-3">
              <View className="w-10 h-10 rounded-lg bg-neutral-800 items-center justify-center">
                <Ionicons name="football" size={20} color="#9CA3AF" />
              </View>
              <Text className="text-white font-semibold">Meus Jogos</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#666" />
          </TouchableOpacity>

          <TouchableOpacity
            className="bg-neutral-900 rounded-xl p-4 flex-row items-center justify-between"
            onPress={handleEditProfile}
          >
            <View className="flex-row items-center gap-3">
              <View className="w-10 h-10 rounded-lg bg-neutral-800 items-center justify-center">
                <Ionicons name="person" size={20} color="#9CA3AF" />
              </View>
              <Text className="text-white font-semibold">Editar Perfil</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#666" />
          </TouchableOpacity>

          <TouchableOpacity
            className="bg-neutral-900 rounded-xl p-4 flex-row items-center justify-between"
            onPress={handleSettings}
          >
            <View className="flex-row items-center gap-3">
              <View className="w-10 h-10 rounded-lg bg-neutral-800 items-center justify-center">
                <Ionicons name="settings" size={20} color="#9CA3AF" />
              </View>
              <Text className="text-white font-semibold">Configurações</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#666" />
          </TouchableOpacity>
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          className="bg-red-500 rounded-xl py-4 items-center mt-6"
          onPress={handleLogout}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <View className="flex-row items-center gap-2">
              <Ionicons name="log-out" size={20} color="#ffffff" />
              <Text className="text-white font-bold text-lg">Sair da Conta</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
