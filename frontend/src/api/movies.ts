import { apiClient } from './client';
import type { ApiResponse, Movie } from '../types';

export const fetchMovies = async (): Promise<Movie[]> => {
  const { data } = await apiClient.get<ApiResponse<Movie[]>>('/api/movies');
  return data.data;
};
