import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

/**
 * Storage unificado:
 * - Native (iOS/Android): usa SecureStore (seguro)
 * - Web (PWA):            usa localStorage (fallback)
 */
export const storage = {
  async getItem(key: string): Promise<string | null> {
    if (Platform.OS === 'web') {
      return localStorage.getItem(key);
    }
    return SecureStore.getItemAsync(key);
  },

  async setItem(key: string, value: string): Promise<void> {
    console.log('plataform', Platform.OS);
    console.log('chegou');
    
    if (Platform.OS === 'web') {
      localStorage.setItem(key, value);
      return;
    }
    await SecureStore.setItemAsync(key, value);
  },

  async removeItem(key: string): Promise<void> {
    if (Platform.OS === 'web') {
      localStorage.removeItem(key);
      return;
    }
    await SecureStore.deleteItemAsync(key);
  },
};