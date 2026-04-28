import { storage } from "@/utils/secure";
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { NativeEventEmitter, NativeModules } from "react-native";

// Types para API
export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  status: number;
}

export interface ApiError {
  message: string;
  status?: number;
  code?: string;
}

// Configuração base da API
class ApiClient {
  private instance: AxiosInstance;
  private static apiClient: ApiClient;

  private constructor() {
    const baseURL =
      process.env.EXPO_PUBLIC_API_URL || "http://192.168.7.8:8080";

    this.instance = axios.create({
      baseURL,
      timeout: 15000,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    this.setupInterceptors();
  }

  public static getInstance(): ApiClient {
    if (!ApiClient.apiClient) {
      ApiClient.apiClient = new ApiClient();
    }
    return ApiClient.apiClient;
  }

  private setupInterceptors() {
    // Request interceptor - adiciona token de autenticação
    this.instance.interceptors.request.use(
      async (config) => {
        console.log("🚀 API Request:", {
          method: config.method?.toUpperCase(),
          url: config.url,
          baseURL: config.baseURL,
          fullUrl: `${config.baseURL}${config.url}`,
          data: config.data,
          hasAuth: !!config.headers.Authorization,
        });

        // Adiciona token se existir (precisamos pegar do SecureStore)
        try {
          const token = await storage.getItem("auth_token");

          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        } catch (error) {
          console.warn("Could not retrieve auth token:", error);
        }

        return config;
      },
      (error) => {
        console.error("❌ Request Error:", error);
        return Promise.reject(error);
      },
    );

    // Response interceptor - tratamento de erros e logging
    this.instance.interceptors.response.use(
      (response: AxiosResponse) => {
        console.log("✅ API Response:", {
          status: response.status,
          statusText: response.statusText,
          url: response.config.url,
          hasData: !!response.data,
        });

        return response;
      },
      async (error) => {
        console.error("❌ Response Error:", {
          message: error.message,
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          url: error.config?.url,
          code: error.code,
        });

        // Tratamento de token expirado
        if (error.response?.status === 401 || error.response?.status === 403) {
          try {
            await storage.removeItem("auth_token");
            if (typeof window !== "undefined") {
              window.dispatchEvent(new Event("auth:expired"));
            }
            const emitter = new NativeEventEmitter(
              NativeModules.DeviceEventManager || {},
            );
            emitter.emit("auth:expired");

            // Redirecionar para login (precisamos do router)
            console.warn("Token expired, redirecting to login");
            // Aqui você pode implementar lógica de redirecionamento
          } catch (secureError) {
            console.error("Error handling token expiration:", secureError);
          }
        }

        return Promise.reject(this.handleError(error));
      },
    );
  }

  private handleError(error: any): ApiError {
    if (error.response) {
      // Erro do servidor (4xx, 5xx)
      return {
        message:
          error.response.data?.message ||
          this.getDefaultErrorMessage(error.response.status),
        status: error.response.status,
        code: error.code,
      };
    } else if (error.request) {
      // Erro de rede
      return {
        message: "Falha na conexão. Verifique sua internet.",
        code: error.code || "NETWORK_ERROR",
      };
    } else {
      // Erro desconhecido
      return {
        message: error.message || "Erro desconhecido. Tente novamente.",
        code: error.code || "UNKNOWN_ERROR",
      };
    }
  }

  private getDefaultErrorMessage(status: number): string {
    switch (status) {
      case 400:
        return "Dados inválidos. Verifique as informações enviadas.";
      case 401:
        return "Não autorizado. Faça login novamente.";
      case 403:
        return "Acesso negado. Você não tem permissão para esta ação.";
      case 404:
        return "Recurso não encontrado.";
      case 409:
        return "Conflito de dados. O recurso já existe.";
      case 422:
        return "Dados inválidos. Verifique os campos obrigatórios.";
      case 429:
        return "Muitas tentativas. Aguarde um momento e tente novamente.";
      case 500:
        return "Erro interno do servidor. Tente novamente mais tarde.";
      case 502:
        return "Servidor indisponível. Tente novamente em alguns minutos.";
      case 503:
        return "Serviço temporariamente indisponível.";
      default:
        return "Ocorreu um erro. Tente novamente.";
    }
  }

  // Métodos HTTP
  public async get<T>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<ApiResponse<T>> {
    const response = await this.instance.get<T>(url, config);
    return {
      data: response.data,
      status: response.status,
    };
  }

  public async post<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<ApiResponse<T>> {
    const response = await this.instance.post<T>(url, data, config);
    return {
      data: response.data,
      status: response.status,
    };
  }

  public async put<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<ApiResponse<T>> {
    const response = await this.instance.put<T>(url, data, config);
    return {
      data: response.data,
      status: response.status,
    };
  }

  public async patch<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<ApiResponse<T>> {
    const response = await this.instance.patch<T>(url, data, config);
    return {
      data: response.data,
      status: response.status,
    };
  }

  public async delete<T>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<ApiResponse<T>> {
    const response = await this.instance.delete<T>(url, config);
    return {
      data: response.data,
      status: response.status,
    };
  }

  // Método para upload de arquivos
  public async upload<T>(
    url: string,
    formData: FormData,
    config?: AxiosRequestConfig,
  ): Promise<ApiResponse<T>> {
    const response = await this.instance.post<T>(url, formData, {
      ...config,
      headers: {
        "Content-Type": "multipart/form-data",
        ...config?.headers,
      },
    });
    return {
      data: response.data,
      status: response.status,
    };
  }
}

// Export singleton instance
export const apiClient = ApiClient.getInstance();

// Exportar instância axios para casos específicos
export const api = apiClient["instance"];
