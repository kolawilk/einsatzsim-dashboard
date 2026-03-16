import { useState } from 'react'
import { generateMission, GeneratedMission } from '@/lib/ollama'

export function useOllama() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [generatedMission, setGeneratedMission] = useState<GeneratedMission | null>(null)

  const generate = async (stichpunkte: string) => {
    setIsLoading(true)
    setError(null)
    
    try {
      const mission = await generateMission(stichpunkte)
      setGeneratedMission(mission)
      return mission
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      return null
    } finally {
      setIsLoading(false)
    }
  }

  const reset = () => {
    setGeneratedMission(null)
    setError(null)
  }

  return {
    generate,
    reset,
    isLoading,
    error,
    generatedMission
  }
}
