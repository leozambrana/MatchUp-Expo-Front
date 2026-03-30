import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { gameService } from '../services/api/services';
import { CreateGameRequest } from '../services/api/types/game';

export default function CreateGameScreen() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<CreateGameRequest>({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    maxPlayers: 10,
    price: 0,
  });

  const handleInputChange = (field: keyof CreateGameRequest, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCreateGame = async () => {
    if (!formData.title || !formData.date || !formData.time || !formData.location) {
      Alert.alert('Atenção', 'Preencha todos os campos obrigatórios');
      return;
    }

    if (formData.maxPlayers < 2) {
      Alert.alert('Atenção', 'O número mínimo de jogadores é 2');
      return;
    }

    setLoading(true);
    try {
      await gameService.createGame(formData);
      Alert.alert('Sucesso', 'Jogo criado com sucesso!');
      router.back();
    } catch (error: any) {
      Alert.alert('Erro', error.message || 'Não foi possível criar o jogo');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView className="flex-1 bg-black">
      <View className="bg-neutral-900 border-b border-neutral-800 px-4 py-4">
        <View className="flex-row items-center gap-3">
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#C8F135" />
          </TouchableOpacity>
          <Text className="text-white text-xl font-bold">Criar Novo Jogo</Text>
        </View>
      </View>

      <View className="flex-1 px-4 py-6">
        <View className="gap-6">
          <View className="gap-2">
            <Text className="text-white font-semibold mb-2">Título *</Text>
            <TextInput
              className="bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-3 text-white"
              placeholder="Ex: Racha de Sexta"
              placeholderTextColor="#666"
              value={formData.title}
              onChangeText={(value) => handleInputChange('title', value)}
            />
          </View>

          <View className="gap-2">
            <Text className="text-white font-semibold mb-2">Descrição</Text>
            <TextInput
              className="bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-3 text-white h-20"
              placeholder="Detalhes do jogo (opcional)"
              placeholderTextColor="#666"
              multiline
              textAlignVertical="top"
              value={formData.description}
              onChangeText={(value) => handleInputChange('description', value)}
            />
          </View>

          <View className="flex-row gap-4">
            <View className="flex-1 gap-2">
              <Text className="text-white font-semibold mb-2">Data *</Text>
              <TextInput
                className="bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-3 text-white"
                placeholder="DD/MM/AAAA"
                placeholderTextColor="#666"
                value={formData.date}
                onChangeText={(value) => handleInputChange('date', value)}
              />
            </View>
            <View className="flex-1 gap-2">
              <Text className="text-white font-semibold mb-2">Horário *</Text>
              <TextInput
                className="bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-3 text-white"
                placeholder="HH:MM"
                placeholderTextColor="#666"
                value={formData.time}
                onChangeText={(value) => handleInputChange('time', value)}
              />
            </View>
          </View>

          <View className="gap-2">
            <Text className="text-white font-semibold mb-2">Local *</Text>
            <TextInput
              className="bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-3 text-white"
              placeholder="Ex: Campo do Sindicato"
              placeholderTextColor="#666"
              value={formData.location}
              onChangeText={(value) => handleInputChange('location', value)}
            />
          </View>

          <View className="flex-row gap-4">
            <View className="flex-1 gap-2">
              <Text className="text-white font-semibold mb-2">Máx. Jogadores *</Text>
              <TextInput
                className="bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-3 text-white"
                placeholder="10"
                placeholderTextColor="#666"
                keyboardType="numeric"
                value={formData.maxPlayers.toString()}
                onChangeText={(value) => handleInputChange('maxPlayers', parseInt(value) || 0)}
              />
            </View>
            <View className="flex-1 gap-2">
              <Text className="text-white font-semibold mb-2">Preço (R$)</Text>
              <TextInput
                className="bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-3 text-white"
                placeholder="0.00"
                placeholderTextColor="#666"
                keyboardType="numeric"
                value={formData.price.toString()}
                onChangeText={(value) => handleInputChange('price', parseFloat(value) || 0)}
              />
            </View>
          </View>
        </View>

        <TouchableOpacity
          className="bg-lime-400 rounded-xl py-4 items-center mt-8"
          onPress={handleCreateGame}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#0a0a0a" />
          ) : (
            <Text className="text-black font-bold text-lg">Criar Jogo</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
