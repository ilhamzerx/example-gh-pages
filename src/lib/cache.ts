/**
 * Cache entry containing the data and expiration timestamp
 */
interface CacheEntry<T> {
  data: T;
  expiry: number;
}

/**
 * Simple localStorage-based cache with expiration
 */
export class Cache {
  /**
   * Get a value from cache
   * @param key - Cache key
   * @returns The cached value or null if not found or expired
   */
  static get<T>(key: string): T | null {
    try {
      // Try to get the item from localStorage
      const item = localStorage.getItem(`cache_${key}`);
      if (!item) {
        return null;
      }
      
      // Parse the stored JSON
      const entry: CacheEntry<T> = JSON.parse(item);
      
      // Check if entry is expired
      if (Date.now() > entry.expiry) {
        this.remove(key);
        return null;
      }
      
      return entry.data;
    } catch (error) {
      console.error('Error retrieving from cache:', error);
      return null;
    }
  }
  
  /**
   * Set a value in cache with expiration
   * @param key - Cache key
   * @param value - Value to cache
   * @param ttlMs - Time to live in milliseconds (default: 1 hour)
   */
  static set<T>(key: string, value: T, ttlMs: number = 3600000): void {
    try {
      const entry: CacheEntry<T> = {
        data: value,
        expiry: Date.now() + ttlMs
      };
      
      localStorage.setItem(`cache_${key}`, JSON.stringify(entry));
    } catch (error) {
      console.error('Error storing in cache:', error);
    }
  }
  
  /**
   * Remove a value from cache
   * @param key - Cache key
   */
  static remove(key: string): void {
    localStorage.removeItem(`cache_${key}`);
  }
}