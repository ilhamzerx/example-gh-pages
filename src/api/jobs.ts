import type { Job } from '../types/model';
import { Cache } from '../lib/cache';
import { BASE_URL, CACHE_TTL, type BaseResponse } from './common';

/**
 * Fetch all jobs from the API
 * @returns Promise with array of Job objects
 */
export async function fetchJobs(query?: string): Promise<Job[]> {
  try {
    const params = new URLSearchParams();
    if (query) {
      params.append('query', query);
    }
    const url = `${BASE_URL}/?${params.toString()}`;
    
    // Generate a cache key based on the URL
    const cacheKey = `jobs_${url}`;
    
    // Try to get from cache first
    const cachedJobs = Cache.get<Job[]>(cacheKey);
    if (cachedJobs) {
      return cachedJobs;
    }
    
    // If not in cache, fetch from API
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const respJobs: BaseResponse<Job[]> = await response.json()
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
    console.error('Error fetching jobs:', error);
    throw error;
  }
}

/**
 * Fetch a specific job by ID
 * @param id - The job ID to fetch
 * @returns Promise with Job object
 */
export async function fetchJobById(id: string): Promise<Job> {
  try {
    const url = `${BASE_URL}/vacancy/${id}`;
    
    // Generate a cache key
    const cacheKey = `job_${id}`;
    
    // Try to get from cache first
    const cachedJob = Cache.get<Job>(cacheKey);
    if (cachedJob) {
      return cachedJob;
    }
    
    // If not in cache, fetch from API
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const respJob: BaseResponse<Job> = await response.json();
    if (!respJob.ok) {
      throw new Error(`API error: ${respJob.error}`);
    }
    if (!respJob.data) {
      throw new Error(`API error: ${respJob.msg}`);
    }
    
    // Store in cache for next time
    Cache.set(cacheKey, respJob.data, CACHE_TTL);
  
    return respJob.data;
  } catch (error) {
    console.error(`Error fetching job with id ${id}:`, error);
    throw error;
  }
}