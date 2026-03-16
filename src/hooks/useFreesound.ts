import { useState, useEffect, useCallback } from 'react';
import type { FreesoundConfig, SoundResult, FreesoundSearchResponse } from '@/lib/freesound';
import FreesoundService from '@/lib/freesound';

export interface UseFreesoundReturn {
  sounds: SoundResult[]
  searchQuery: string
  isLoading: boolean
  error: string | null
  setPage: (page: number) => void
  setSearchQuery: (query: string) => void
  searchSounds: (query: string, page?: number) => Promise<void>
  previewSound: (soundId: string) => Promise<string>
  getTotalPages: () => number
  currentPage: number
}

export function useFreesound(config: FreesoundConfig): UseFreesoundReturn {
  const [service, setService] = useState<FreesoundService | null>(null);
  const [sounds, setSounds] = useState<SoundResult[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalResults, setTotalResults] = useState(0);

  useEffect(() => {
    const serviceInstance = new FreesoundService(config);
    setService(serviceInstance);
  }, [config]);

  const searchSounds = useCallback(async (
    query: string,
    page: number = 1
  ): Promise<void> => {
    if (!service) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response: FreesoundSearchResponse = await service.searchSounds(query, page);
      setSounds(response.results);
      setTotalResults(response.count);
      setSearchQuery(query);
      setCurrentPage(page);
    } catch (err) {
      setError('Failed to search sounds');
      setSounds([]);
    } finally {
      setIsLoading(false);
    }
  }, [service]);

  const previewSound = useCallback(async (soundId: string): Promise<string> => {
    if (!service) return '';
    
    setIsLoading(true);
    setError(null);
    
    try {
      const previewUrl = await service.previewSound(soundId);
      return previewUrl;
    } catch (err) {
      setError('Failed to get sound preview');
      return '';
    } finally {
      setIsLoading(false);
    }
  }, [service]);

  const setPage = useCallback((page: number) => {
    if (searchQuery) {
      searchSounds(searchQuery, page);
    }
    setCurrentPage(page);
  }, [searchQuery, searchSounds]);

  const getTotalPages = useCallback((): number => {
    return Math.ceil(totalResults / 12); // 12 results per page
  }, [totalResults]);

  return {
    sounds,
    searchQuery,
    isLoading,
    error,
    setPage,
    setSearchQuery,
    searchSounds,
    previewSound,
    getTotalPages,
    currentPage,
  };
}

export default useFreesound
