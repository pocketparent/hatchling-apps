import AsyncStorage from '@react-native-async-storage/async-storage';
import { COST_OPTIMIZATION } from '../../utils/config';

/**
 * Storage service with cost optimization features:
 * - Efficient data storage and retrieval
 * - Caching mechanisms
 * - Batch operations
 */
class StorageClient {
  /**
   * Store data with a key
   */
  async setItem(key: string, value: any): Promise<void> {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, jsonValue);
    } catch (error) {
      console.error('Error storing data:', error);
      throw error;
    }
  }

  /**
   * Retrieve data by key
   */
  async getItem<T>(key: string): Promise<T | null> {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (error) {
      console.error('Error retrieving data:', error);
      throw error;
    }
  }

  /**
   * Remove data by key
   */
  async removeItem(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing data:', error);
      throw error;
    }
  }

  /**
   * Store multiple items in a batch operation
   * More efficient than individual setItem calls
   */
  async multiSet(keyValuePairs: [string, any][]): Promise<void> {
    try {
      const pairs = keyValuePairs.map(([key, value]) => [
        key,
        JSON.stringify(value),
      ]);
      await AsyncStorage.multiSet(pairs as [string, string][]);
    } catch (error) {
      console.error('Error storing multiple items:', error);
      throw error;
    }
  }

  /**
   * Get multiple items in a batch operation
   */
  async multiGet<T>(keys: string[]): Promise<Array<[string, T | null]>> {
    try {
      const pairs = await AsyncStorage.multiGet(keys);
      return pairs.map(([key, value]) => [
        key,
        value ? JSON.parse(value) as T : null,
      ]);
    } catch (error) {
      console.error('Error retrieving multiple items:', error);
      throw error;
    }
  }

  /**
   * Clear all storage (use with caution)
   */
  async clear(): Promise<void> {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error('Error clearing storage:', error);
      throw error;
    }
  }

  /**
   * Get all keys
   */
  async getAllKeys(): Promise<string[]> {
    try {
      return await AsyncStorage.getAllKeys();
    } catch (error) {
      console.error('Error getting all keys:', error);
      throw error;
    }
  }

  /**
   * Cache data with expiration
   */
  async cacheData<T>(key: string, data: T, duration?: number): Promise<void> {
    const expiry = Date.now() + (duration || COST_OPTIMIZATION.cacheDuration.activities);
    await this.setItem(key, {
      data,
      expiry,
    });
  }

  /**
   * Get cached data if not expired
   */
  async getCachedData<T>(key: string): Promise<T | null> {
    const cached = await this.getItem<{ data: T; expiry: number }>(key);
    
    if (!cached) return null;
    
    if (Date.now() > cached.expiry) {
      await this.removeItem(key);
      return null;
    }
    
    return cached.data;
  }
}

// Export a singleton instance
export const storageClient = new StorageClient();
