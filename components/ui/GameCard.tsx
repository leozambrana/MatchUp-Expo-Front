import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Game } from '../../services/api/types/game';

interface GameCardProps {
  game: Game;
  onPress?: (game: Game) => void;
  onJoin?: (gameId: string) => void;
  loading?: boolean;
}

export function GameCard({ game, onPress, onJoin, loading = false }: GameCardProps) {
  const getStatusColor = (status: Game['status']) => {
    switch (status) {
      case 'scheduled': return 'text-blue-400';
      case 'ongoing': return 'text-green-400';
      case 'finished': return 'text-gray-400';
      case 'cancelled': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusText = (status: Game['status']) => {
    switch (status) {
      case 'scheduled': return 'Agendado';
      case 'ongoing': return 'Em andamento';
      case 'finished': return 'Finalizado';
      case 'cancelled': return 'Cancelado';
      default: return status;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <TouchableOpacity
      className="bg-neutral-900 rounded-xl border border-neutral-800 p-4 mb-3"
      onPress={() => onPress?.(game)}
      activeOpacity={0.8}
      disabled={loading}
    >
      <View className="flex-row justify-between items-start mb-2">
        <View className="flex-1">
          <Text className="text-white font-semibold text-lg mb-1">{game.title}</Text>
          {game.description && (
            <Text className="text-neutral-400 text-sm mb-2" numberOfLines={2}>
              {game.description}
            </Text>
          )}
        </View>
        <View className={`px-2 py-1 rounded-full ${getStatusColor(game.status)}`}>
          <Text className="text-xs font-semibold">
            {getStatusText(game.status)}
          </Text>
        </View>
      </View>

      <View className="flex-row gap-4 mb-3">
        <View className="flex-row items-center gap-1">
          <Ionicons name="calendar" size={14} color="#9CA3AF" />
          <Text className="text-neutral-400 text-sm">
            {formatDate(game.dateTime)}
          </Text>
        </View>
      </View>

      <View className="flex-row items-center gap-1 mb-3">
        <Ionicons name="location" size={14} color="#9CA3AF" />
        <Text className="text-neutral-400 text-sm flex-1" numberOfLines={1}>
          {game.location}
        </Text>
      </View>

        {game.status === 'scheduled' && onJoin && (
          <TouchableOpacity
            className="bg-lime-400 px-3 py-1.5 rounded-lg"
            onPress={() => onJoin(game.id)}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#0a0a0a" />
            ) : (
              <Text className="text-black font-semibold text-xs">PARTICIPAR</Text>
            )}
          </TouchableOpacity>
        )}
    </TouchableOpacity>
  );
}
