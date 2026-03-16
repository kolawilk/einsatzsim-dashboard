import { useState, useEffect, useCallback } from 'react';
import type { GeneratedMission } from '@/lib/ollama';
import { OllamaService } from '@/lib/ollama';

interface UseOllamaReturn {
  isLoading: boolean;
  error: string | null;
  generateMission: (prompt: string) => Promise<GeneratedMission | null>;
}

export function useOllama(): UseOllamaReturn {
  const [service, setService] = useState<OllamaService | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const serviceInstance = new OllamaService();
    setService(serviceInstance);
  }, []);

  const generateMission = useCallback(async (prompt: string): Promise<GeneratedMission | null> => {
    if (!service) return null;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const mission = await service.generateMissionFromPrompt(prompt);
      return mission;
    } catch (err) {
      setError('Fehler beim Generieren der Mission. Ist Ollama gestartet?');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [service]);

  return {
    isLoading,
    error,
    generateMission,
  };
}
