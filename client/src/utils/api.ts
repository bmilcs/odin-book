import { API_BASE_URL } from '@/utils/env';

type Method = 'GET' | 'POST' | 'DELETE' | 'PATCH' | 'PUT';

// returns a Promise that resolves to the response data
async function callApi<T>(
  method: Method,
  path: string,
  data?: FormData | Record<string, unknown> | undefined,
): Promise<T> {
  const url = `${API_BASE_URL}${path}`;

  const options: RequestInit = {
    method,
    credentials: 'include',
    body:
      data instanceof FormData ? data : data ? JSON.stringify(data) : undefined,
  };

  if (!(data instanceof FormData)) {
    options.headers = {
      'Content-Type': 'application/json',
    };
  }

  try {
    const response = await fetch(url, options);
    const responseData = await response.json();
    return responseData as T;
  } catch (error) {
    console.error(error);

    throw new Error('Something went wrong with the API request');
  }
}

// API methods
const api = {
  get: <T>(path: string): Promise<T> => callApi<T>('GET', path),

  post: <T>(
    path: string,
    data: FormData | Record<string, unknown> | undefined,
  ): Promise<T> => callApi<T>('POST', path, data),

  del: <T>(path: string): Promise<T> => callApi<T>('DELETE', path),

  patch: <T>(
    path: string,
    data: FormData | Record<string, unknown> | undefined,
  ): Promise<T> => callApi<T>('PATCH', path, data),

  put: <T>(
    path: string,
    data: FormData | Record<string, unknown> | undefined,
  ): Promise<T> => callApi<T>('PUT', path, data),
};

export default api;
