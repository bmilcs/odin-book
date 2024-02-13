import { API_BASE_URL } from '@/utils/env';

/**
 * HTTP methods supported by the API.
 */
type Method = 'GET' | 'POST' | 'DELETE' | 'PATCH' | 'PUT';

/**
 * Calls the API with the specified HTTP method, path and data.
 * @param method The HTTP method to use.
 * @param path The path to the API endpoint.
 * @param data Optional data to send with the request.
 * @returns A Promise that resolves to the response data.
 * @throws An error if the API request fails.
 */
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

/**
 * Object containing functions to make API requests using different HTTP methods.
 */
const api = {
  /**
   * Sends a GET request to the specified API endpoint.
   * @param path The path to the API endpoint.
   * @returns A Promise that resolves to the response data.
   */
  get: <T>(path: string): Promise<T> => callApi<T>('GET', path),

  /**
   * Sends a POST request to the specified API endpoint with the specified data.
   * @param path The path to the API endpoint.
   * @param data The data to send with the request.
   * @returns A Promise that resolves to the response data.
   */
  post: <T>(
    path: string,
    data: FormData | Record<string, unknown> | undefined,
  ): Promise<T> => callApi<T>('POST', path, data),

  /**
   * Sends a DELETE request to the specified API endpoint.
   * @param path The path to the API endpoint.
   * @returns A Promise that resolves to the response data.
   */
  del: <T>(path: string): Promise<T> => callApi<T>('DELETE', path),

  /**
   * Sends a PATCH request to the specified API endpoint with the specified data.
   * @param path The path to the API endpoint.
   * @param data The data to send with the request.
   * @returns A Promise that resolves to the response data.
   */
  patch: <T>(
    path: string,
    data: FormData | Record<string, unknown> | undefined,
  ): Promise<T> => callApi<T>('PATCH', path, data),

  /**
   * Sends a PUT request to the specified API endpoint with the specified data.
   * @param path The path to the API endpoint.
   * @param data The data to send with the request.
   * @returns A Promise that resolves to the response data.
   * @throws An error if the API request fails.
   **/
  put: <T>(
    path: string,
    data: FormData | Record<string, unknown> | undefined,
  ): Promise<T> => callApi<T>('PUT', path, data),
};

export default api;
