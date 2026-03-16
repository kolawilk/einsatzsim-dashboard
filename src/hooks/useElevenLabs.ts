import { useState, useEffect, useCallback } from 'react';
import type { ElevenLabsConfig, ElevenLabsOptions } from '@/lib/elevenlabs';
import ElevenLabsService from '@/lib/elevenlabs';

export function useElevenLabs(config: ElevenLabsConfig) {
  const [service, setService] = useState<ElevenLabsService | null>(null);
  const [voices, setVoices] = useState<Array<{ name: string; voice_id: string }>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const serviceInstance = new ElevenLabsService(config);
    setService(serviceInstance);
  }, [config]);

  const fetchVoices = useCallback(async () => {
    if (!service) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const voicesData = await service.getVoices();
      setVoices(voicesData);
    } catch (err) {
      setError('Failed to fetch voices');
    } finally {
      setIsLoading(false);
    }
  }, [service]);

  const generateSound = useCallback(async (options: ElevenLabsOptions): Promise<Blob | null> => {
    if (!service) return null;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const blob = await service.generateSpeech(options);
      return blob;
    } catch (err) {
      setError('Failed to generate sound');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [service]);

  return {
    voices,
    isLoading,
    error,
    fetchVoices,
    generateSound,
  };
}
