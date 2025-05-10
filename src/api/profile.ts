import { Cache } from "../lib/cache";
import type { Tag, User } from "../types/model";
import { BASE_URL, CACHE_TTL, type BaseResponse } from "./common";

/**
 * Fetch all tags from the API
 * @returns Promise with array of Tag objects
 */
export async function getAvailableTags(): Promise<Tag[]> {
  try {
    const url = `${BASE_URL}/tags`;

    // Generate a cache key based on the URL
    const cacheKey = `tags_${url}`;

    // Try to get from cache first
    const cachedTags = Cache.get<Tag[]>(cacheKey);
    if (cachedTags) {
      return cachedTags;
    }

    // If not in cache, fetch from API
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const respJobs: BaseResponse<Tag[]> = await response.json();
    if (!respJobs.ok) {
      throw new Error(`API error: ${respJobs.error}`);
    }
    if (!respJobs.data) {
      throw new Error(`API error: ${respJobs.msg}`);
    }

    // Store in cache for next time
    Cache.set(cacheKey, respJobs.data, CACHE_TTL);

    return respJobs.data;
  } catch (error) {
    console.error("Error fetching tags:", error);
    throw error;
  }
}

/**
 * Get user profile
 * @param accessToken - Access token for authentication
 * @returns Promise with User object or null
 */
export const getUserProfile = async (accessToken: string): Promise<User | null> => {
  try {
    const url = `${BASE_URL}/profile`;

    // If not in cache, fetch from API
    const response = await fetch(
      url,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        }
      }
    );

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const respProfile: BaseResponse<User> = await response.json();
    if (!respProfile.ok) {
      throw new Error(`API error: ${respProfile.error}`);
    }
    if (!respProfile.data) {
      return null;
    }

    return respProfile.data;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error;
  }
};

interface SaveUserProfileInput {
  fullname: string;
  nickname: string;
  profile_picture: string;
  current_job: string;
  whatsapp_number: string;
  preferences_tags: string[];
}

/**
 * Save user profile
 * @param accessToken - Access token for authentication
 * @returns Promise with boolean indicating success
 */
export const saveUserProfile = async (accessToken: string, input: SaveUserProfileInput): Promise<boolean> => {
  try {
    const url = `${BASE_URL}/profile`;

    // If not in cache, fetch from API
    const response = await fetch(
      url,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify(input)
      }
    );

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const respProfile: BaseResponse<null> = await response.json();
    if (!respProfile.ok) {
      throw new Error(`API error: ${respProfile.error}`);
    }

    return true;
  } catch (error) {
    console.error("Error saving user profile:", error);
    throw error;
  }
};
