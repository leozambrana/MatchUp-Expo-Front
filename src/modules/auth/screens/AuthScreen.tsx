import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useAuth } from '@/context/AuthContext';
import { authService } from '@/modules/auth/services/AuthService';

export function AuthScreen() {
  const { signIn } = useAuth();
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [loading, setLoading] = useState(false);

  // Login fields
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register fields
  const [registerName, setRegisterName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');

  async function handleLogin() {
    if (!loginEmail || !loginPassword) {
      Alert.alert('Atenção', 'Preencha todos os campos');
      return;
    }
    setLoading(true);
    try {
      const { token } = await authService.login({ email: loginEmail, password: loginPassword });
      console.log('token recebido:', token);
      await signIn(token);
      router.replace('/(tabs)');
    } catch (e: any) {
      Alert.alert('Erro', e.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleRegister() {
    if (!registerName || !registerEmail || !registerPassword) {
      Alert.alert('Atenção', 'Preencha todos os campos');
      return;
    }
    setLoading(true);
    try {
      const { token } = await authService.register({
        name: registerName,
        email: registerEmail,
        password: registerPassword,
      });
      await signIn(token);
      router.replace('/(tabs)');
    } catch (e: any) {
      Alert.alert('Erro', e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-black justify-center px-6"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar barStyle="light-content" backgroundColor="#0a0a0a" />

      {/* Header */}
      <View className="items-center mb-9">
        <View className="mb-3">
          <View className="w-16 h-16 rounded-2xl bg-neutral-900 border-2 border-lime-400 items-center justify-center">
            <Text className="text-3xl">⚽</Text>
          </View>
        </View>
        <Text className="text-[42px] font-black text-white tracking-wider">RACHA<Text className="text-lime-400">FC</Text></Text>
        <Text className="text-xs text-neutral-500 mt-1 tracking-wide">Organiza o jogo, você só joga</Text>
      </View>

      {/* Card */}
      <View className="bg-neutral-900 rounded-2xl border border-neutral-800 overflow-hidden">
        {/* Tabs */}
        <View className="flex-row border-b border-neutral-800">
          <TouchableOpacity
            className={`flex-1 py-4 items-center ${tab === 'login' ? 'border-b-2 border-lime-400' : ''}`}
            onPress={() => setTab('login')}
            activeOpacity={0.8}
          >
            <Text className={`text-sm font-semibold tracking-wide ${tab === 'login' ? 'text-lime-400' : 'text-neutral-500'}`}>
              Entrar
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className={`flex-1 py-4 items-center ${tab === 'register' ? 'border-b-2 border-lime-400' : ''}`}
            onPress={() => setTab('register')}
            activeOpacity={0.8}
          >
            <Text className={`text-sm font-semibold tracking-wide ${tab === 'register' ? 'text-lime-400' : 'text-neutral-500'}`}>
              Criar conta
            </Text>
          </TouchableOpacity>
        </View>

        {/* Login Form */}
        {tab === 'login' && (
          <View className="p-6 gap-4">
            <View className="gap-1.5">
              <Text className="text-xs font-bold text-neutral-400 tracking-wider uppercase">Email</Text>
              <TextInput
                className="bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-3.5 text-white text-base"
                placeholder="seu@email.com"
                placeholderTextColor="#555"
                value={loginEmail}
                onChangeText={setLoginEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                returnKeyType="next"
              />
            </View>
            <View className="gap-1.5">
              <Text className="text-xs font-bold text-neutral-400 tracking-wider uppercase">Senha</Text>
              <TextInput
                className="bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-3.5 text-white text-base"
                placeholder="••••••••"
                placeholderTextColor="#555"
                value={loginPassword}
                onChangeText={setLoginPassword}
                secureTextEntry
                returnKeyType="done"
                onSubmitEditing={handleLogin}
              />
            </View>

            <TouchableOpacity
              className={`bg-lime-400 rounded-xl py-4 items-center mt-2 ${loading ? 'opacity-60' : ''}`}
              onPress={handleLogin}
              disabled={loading}
              activeOpacity={0.85}
            >
              {loading ? (
                <ActivityIndicator color="#0a0a0a" />
              ) : (
                <Text className="text-sm font-black text-black tracking-widest">ENTRAR</Text>
              )}
            </TouchableOpacity>
          </View>
        )}

        {/* Register Form */}
        {tab === 'register' && (
          <View className="p-6 gap-4">
            <View className="gap-1.5">
              <Text className="text-xs font-bold text-neutral-400 tracking-wider uppercase">Nome</Text>
              <TextInput
                className="bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-3.5 text-white text-base"
                placeholder="Seu nome"
                placeholderTextColor="#555"
                value={registerName}
                onChangeText={setRegisterName}
                autoCapitalize="words"
                returnKeyType="next"
              />
            </View>
            <View className="gap-1.5">
              <Text className="text-xs font-bold text-neutral-400 tracking-wider uppercase">Email</Text>
              <TextInput
                className="bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-3.5 text-white text-base"
                placeholder="seu@email.com"
                placeholderTextColor="#555"
                value={registerEmail}
                onChangeText={setRegisterEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                returnKeyType="next"
              />
            </View>
            <View className="gap-1.5">
              <Text className="text-xs font-bold text-neutral-400 tracking-wider uppercase">Senha</Text>
              <TextInput
                className="bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-3.5 text-white text-base"
                placeholder="mínimo 6 caracteres"
                placeholderTextColor="#555"
                value={registerPassword}
                onChangeText={setRegisterPassword}
                secureTextEntry
                returnKeyType="done"
                onSubmitEditing={handleRegister}
              />
            </View>

            <TouchableOpacity
              className={`bg-lime-400 rounded-xl py-4 items-center mt-2 ${loading ? 'opacity-60' : ''}`}
              onPress={handleRegister}
              disabled={loading}
              activeOpacity={0.85}
            >
              {loading ? (
                <ActivityIndicator color="#0a0a0a" />
              ) : (
                <Text className="text-sm font-black text-black tracking-widest">CRIAR CONTA</Text>
              )}
            </TouchableOpacity>
          </View>
        )}
      </View>

      <Text className="text-center text-neutral-600 text-xs mt-6">Bora jogar? 🏆</Text>
    </KeyboardAvoidingView>
  );
}
