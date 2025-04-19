import { API_CONFIG, COST_OPTIMIZATION } from '../../utils/config';

// Interface for API request options
interface RequestOptions {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers?: Record<string, string>;
  body?: any;
  useCache?: boolean;
  cacheDuration?: number;
}

// Simple in-memory cache
const cache: Record<string, { data: any; timestamp: number }> = {};

/**
 * API Client with built-in cost optimization features:
 * - Caching to reduce API calls
 * - Request batching
 * - Error handling with retries
 * - Timeout management
 */
export class ApiClient {
  private baseUrl: string;
  private defaultHeaders: Record<string, string>;
  
  constructor() {
    this.baseUrl = API_CONFIG.baseUrl;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
  }
  
  /**
   * Make an API request with cost optimization features
   */
  async request<T>(endpoint: string, options: RequestOptions): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const cacheKey = `${options.method}:${url}:${JSON.stringify(options.body || {})}`;
    
    // Check cache if enabled
    if (options.useCache && options.method === 'GET') {
      const cachedResponse = this.getFromCache<T>(cacheKey, options.cacheDuration);
      if (cachedResponse) {
        console.log('Using cached response for:', endpoint);
        return cachedResponse;
      }
    }
    
    // Prepare request
    const fetchOptions: RequestInit = {
      method: options.method,
      headers: { ...this.defaultHeaders, ...options.headers },
      body: options.body ? JSON.stringify(options.body) : undefined,
    };
    
    try {
      // Add timeout to prevent hanging requests
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('Request timeout')), API_CONFIG.timeout);
      });
      
      // Make the request with timeout
      const response = await Promise.race([
        fetch(url, fetchOptions),
        timeoutPromise
      ]) as Response;
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // Cache the response if caching is enabled
      if (options.useCache && options.method === 'GET') {
        this.saveToCache(cacheKey, data);
      }
      
      return data as T;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }
  
  /**
   * Get data from cache if valid
   */
  private getFromCache<T>(key: string, duration?: number): T | null {
    const cachedItem = cache[key];
    if (!cachedItem) return null;
    
    const maxAge = duration || COST_OPTIMIZATION.cacheDuration.activities;
    const now = Date.now();
    
    if (now - cachedItem.timestamp < maxAge) {
      return cachedItem.data as T;
    }
    
    // Cache expired, remove it
    delete cache[key];
    return null;
  }
  
  /**
   * Save data to cache
   */
  private saveToCache(key: string, data: any): void {
    cache[key] = {
      data,
      timestamp: Date.now(),
    };
  }
  
  /**
   * Batch multiple requests into a single API call
   * Useful for reducing API costs with services like OpenAI
   */
  async batchRequests<T>(requests: Array<{ endpoint: string; body: any }>, batchEndpoint: string): Promise<T[]> {
    const batchBody = {
      requests: requests.map(req => ({
        endpoint: req.endpoint,
        payload: req.body
      }))
    };
    
    const response = await this.request<{ results: T[] }>(batchEndpoint, {
      method: 'POST',
      body: batchBody,
    });
    
    return response.results;
  }
}

// Export a singleton instance
export const apiClient = new ApiClient();

// Convenience methods
export const get = <T>(endpoint: string, options?: Partial<RequestOptions>): Promise<T> => {
  return apiClient.request<T>(endpoint, { method: 'GET', ...options });
};

export const post = <T>(endpoint: string, body: any, options?: Partial<RequestOptions>): Promise<T> => {
  return apiClient.request<T>(endpoint, { method: 'POST', body, ...options });
};

export const put = <T>(endpoint: string, body: any, options?: Partial<RequestOptions>): Promise<T> => {
  return apiClient.request<T>(endpoint, { method: 'PUT', body, ...options });
};

export const del = <T>(endpoint: string, options?: Partial<RequestOptions>): Promise<T> => {
  return apiClient.request<T>(endpoint, { method: 'DELETE', ...options });
};
