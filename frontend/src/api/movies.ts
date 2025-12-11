import { apiClient } from './client';
import type { ApiResponse, Movie } from '../types';

export interface PublicPreview {
  id: string;
  title: string;
  thumbnailUrl: string;
  previewUrl: string;
  embedUrl: string;
  duration?: number;
}

export const fetchMovies = async (): Promise<Movie[]> => {
  const { data } = await apiClient.get<ApiResponse<Movie[]>>('/api/movies');
  return data.data;
};

export const fetchFreePreviews = async (): Promise<Movie[]> => {
  const { data } = await apiClient.get<ApiResponse<Movie[]>>('/api/movies/free-previews');
  return data.data;
};

/**
 * Fetch previews from the PUBLIC Bunny library
 * These are directly from Bunny.net, no MongoDB
 */
export const fetchPublicPreviews = async (): Promise<PublicPreview[]> => {
  const { data } = await apiClient.get<ApiResponse<PublicPreview[]>>('/api/public/previews');
  return data.data;
};
