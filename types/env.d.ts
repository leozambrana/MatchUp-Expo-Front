/// <reference types="expo-env" />

declare global {
  namespace Expo {
    interface Config {
      extra?: {
        eas?: {
          projectId?: string;
        };
      };
    }
  }

  namespace ExpoEnv {
    interface Env {
      EXPO_PUBLIC_API_URL: string;
      EXPO_PUBLIC_APP_NAME: string;
      EXPO_PUBLIC_APP_VERSION: string;
    }
  }
}

export {};
