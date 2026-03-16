import { useState, useCallback } from "react"
import OllamaService, { OllamaConfig, OllamaOptions } from "@/lib/ollama"

export function useOllama(config: OllamaConfig) {
  const [service, setService] = useState<OllamaService | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const serviceInstance = new OllamaService(config)
    setService(serviceInstance)
  }, [config])

  const generateMission = useCallback(async (prompt: string): Promise<string | null> => {
    if (!service) return null
    
    setIsLoading(true)
    setError(null)
    
    try {
      const mission = await service.generateMissionFromPrompt(prompt)
      return mission
    } catch (err) {
      setError("Failed to generate mission")
      return null
    } finally {
      setIsLoading(false)
    }
  }, [service])

  return {
    isLoading,
    error,
    generateMission,
  }
}
