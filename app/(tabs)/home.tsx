import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Alert,
  ActivityIndicator,
  RefreshControl,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { gameService } from '../../services/api/services';
import { Game, GameFilters } from '../../services/api/types/game';
import { GameCard } from '../../components/ui/GameCard';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeFilter, setActiveFilter] = useState<Game['status'] | 'all'>('all');

  useEffect(() => {
    loadGames();
  }, []);

  const loadGames = async (filters?: GameFilters) => {
    try {
      setLoading(true);
      const response = await gameService.getMyGames(filters);
      console.log('aqui vem os jogos', response.games);
      setGames(response.games);
    
    } catch (error: any) {
      Alert.alert('Erro', error.message || 'Não foi possível carregar seus jogos');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadGames();
    setRefreshing(false);
  };

  const handleFilterPress = (filter: Game['status'] | 'all') => {
    setActiveFilter(filter);
    if (filter === 'all') {
      loadGames();
    } else {
      loadGames({ status: filter });
    }
  };

  const handleGamePress = (game: Game) => {
    // Por enquanto, vamos só mostrar os detalhes básicos
    Alert.alert(
      game.title,
      `📍 ${game.location}\n📅 ${new Date(game.dateTime).toLocaleDateString('pt-BR')}\n⏰ ${game.dateTime}\n`
    );
  };

  const handleCreateGame = () => {
    Alert.alert('Criar Jogo', 'Funcionalidade de criar jogo será implementada!');
    // router.push('/create-game');
  };

  const renderGameItem = ({ item }: { item: Game }) => (
    <GameCard
      game={item}
      onPress={() => handleGamePress(item)}
      onJoin={undefined} // Home não tem botão de participar
    />
  );

  const renderEmptyState = () => (
    <View className="flex-1 justify-center items-center px-8">
      <View className="w-20 h-20 rounded-full bg-neutral-800 items-center justify-center mb-4">
        <Ionicons name="football" size={40} color="#666" />
      </View>
      <Text className="text-white text-lg font-semibold mb-2">Nenhum jogo encontrado</Text>
      <Text className="text-neutral-400 text-center text-sm">
        Crie seu primeiro jogo e comece a organizar suas peladas!
      </Text>
    </View>
  );

  return (
    <View className="flex-1 bg-black" style={{ paddingTop: insets.top }}>
      <StatusBar barStyle="light-content" backgroundColor="#0a0a0a" />
      
      {/* Header */}
      <View className="bg-neutral-900 border-b border-neutral-800 px-4 py-4">
        <View className="flex-row items-center justify-between">
          <Text className="text-white text-xl font-bold">Meus Jogos</Text>
          <TouchableOpacity className="w-10 h-10 rounded-lg bg-neutral-800 items-center justify-center">
            <Ionicons name="search" size={20} color="#666" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Filters */}
      <View className="bg-neutral-900 border-b border-neutral-800 px-4 py-3">
        <View className="flex-row gap-2">
          {[
            { key: 'all', label: 'Todos' },
            { key: 'scheduled', label: 'Agendados' },
            { key: 'ongoing', label: 'Em andamento' },
            { key: 'finished', label: 'Finalizados' },
            { key: 'cancelled', label: 'Cancelados' },
          ].map((filter) => (
            <TouchableOpacity
              key={filter.key}
              className={`px-4 py-2 rounded-full ${
                activeFilter === filter.key
                  ? 'bg-lime-400'
                  : 'bg-neutral-800'
              }`}
              onPress={() => handleFilterPress(filter.key as Game['status'] | 'all')}
            >
              <Text
                className={`text-sm font-semibold ${
                  activeFilter === filter.key ? 'text-black' : 'text-neutral-400'
                }`}
              >
                {filter.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Content */}
      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#C8F135" />
          <Text className="text-neutral-400 mt-3">Carregando jogos...</Text>
        </View>
      ) : games.length === 0 ? (
        renderEmptyState()
      ) : (
        <FlatList
          data={games}
          renderItem={renderGameItem}
          keyExtractor={(item) => item.id}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor="#C8F135"
              colors={["#C8F135"]}
            />
          }
          contentContainerStyle={{ padding: 16 }}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={
            <View className="py-4">
              <TouchableOpacity
                className="bg-lime-400 rounded-xl py-4 items-center"
                onPress={handleCreateGame}
              >
                <View className="flex-row items-center gap-2">
                  <Ionicons name="add-circle" size={20} color="#0a0a0a" />
                  <Text className="text-black font-bold text-lg">Criar Novo Jogo</Text>
                </View>
              </TouchableOpacity>
            </View>
          }
        />
      )}
    </View>
  );
}
