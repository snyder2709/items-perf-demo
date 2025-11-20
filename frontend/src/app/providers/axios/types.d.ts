export interface ApiError extends Error {
  msgError?: string;
  msgObject?: Record<string, any>;
  config?: AxiosRequestConfig & { isMsgError?: boolean; isMsgSuccess?: boolean; isNotFound?: boolean };
  response?: AxiosResponse;
}

export interface ApiNotification {
  __type: 'success' | 'error' | 'warning';
  title: string;
  description?: string;
  duration?: number;
}

export interface RequestOptions extends AxiosRequestConfig {
  isMsgError?: boolean;
  isMsgSuccess?: boolean;
  isNotFound?: boolean;
}
