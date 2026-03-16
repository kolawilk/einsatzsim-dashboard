import { useState, useEffect, useCallback } from 'react';
import type { ElevenLabsConfig, ElevenLabsOptions, Voice } from '@/lib/elevenlabs';
import ElevenLabsService from '@/lib/elevenlabs';

export interface UseElevenLabsReturn {
  voices: Voice[]
  isLoading: boolean
  error: string | null
  fetchVoices: () => Promise<void>
  generateSound: (options: ElevenLabsOptions) => Promise<Blob | null>
  generateMissionCall: (missionId: string, text: string, gender: 'male' | 'female' | 'any') => Promise<Blob | null>
  previewVoice: (voiceId: string, text: string) => Promise<Blob | null>
  getVoiceByGender: (gender: 'male' | 'female' | 'any') => Voice | null
}

export function useElevenLabs(config: ElevenLabsConfig): UseElevenLabsReturn {
  const [service, setService] = useState<ElevenLabsService | null>(null);
  const [voices, setVoices] = useState<Voice[]>([]);
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

  /**
   * Generate mission call with gender-based voice selection
   */
  const generateMissionCall = useCallback(async (
    _missionId: string,
    text: string,
    gender: 'male' | 'female' | 'any'
  ): Promise<Blob | null> => {
    if (!service) return null;
    
    // Wenn keine voices geladen sind, versuchen wir es mit der Default-voiceId
    if (voices.length === 0 && config.voiceId) {
      return generateSound({
        text,
        voiceId: config.voiceId,
      });
    }
    
    // Voice anhand des Genders auswählen
    const selectedVoice = service.getRandomVoice(voices, gender);
    
    if (!selectedVoice) {
      setError(`No voice found for gender: ${gender}`);
      return null;
    }
    
    return generateSound({
      text,
      voiceId: selectedVoice.voice_id,
    });
  }, [service, voices, config.voiceId, generateSound]);

  /**
   * Preview a specific voice by ID
   */
  const previewVoice = useCallback(async (
    voiceId: string,
    text: string
  ): Promise<Blob | null> => {
    if (!service) return null;
    
    return generateSound({
      text,
      voiceId,
    });
  }, [service, generateSound]);

  /**
   * Get a voice that matches the gender
   */
  const getVoiceByGender = useCallback((gender: 'male' | 'female' | 'any'): Voice | null => {
    if (voices.length === 0) return null;
    return service?.getRandomVoice(voices, gender) || null;
  }, [voices, service]);

  return {
    voices,
    isLoading,
    error,
    fetchVoices,
    generateSound,
    generateMissionCall,
    previewVoice,
    getVoiceByGender,
  };
}

export default useElevenLabs
