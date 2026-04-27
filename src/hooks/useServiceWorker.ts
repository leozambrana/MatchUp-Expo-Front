import { useEffect } from 'react';
import { Platform } from 'react-native';

export function useServiceWorker() {
  useEffect(() => {
    if (Platform.OS !== 'web') return;
    if (typeof window === 'undefined') return;
    if (!('serviceWorker' in navigator)) return;

    navigator.serviceWorker
      .register('/service-worker.js')
      .then((registration) => {
        console.log('[PWA] Service Worker registrado:', registration.scope);
      })
      .catch((error) => {
        console.error('[PWA] Falha ao registrar Service Worker:', error);
      });
  }, []);
}