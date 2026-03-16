import { getApiKeys } from './apiKeys';

export interface GeneratedMission {
  title: string
  description: string
  caller_text: string
  suggested_sounds: string[]
  difficulty: 'easy' | 'medium' | 'hard'
}

export interface OllamaResponse {
  response: string
}

export class OllamaService {
  private model: string
  private url: string

  constructor(config: { model?: string; url?: string } = { model: 'kimi-k2.5' }) {
    this.model = config.model || 'kimi-k2.5'
    this.url = config.url || 'http://localhost:11434/api/generate'
  }

  getUrl(): string {
    return this.url
  }

  setUrl(url: string): void {
    this.url = url
  }

  async generateMissionFromPrompt(prompt: string): Promise<GeneratedMission> {
    const response = await fetch(this.url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: this.model,
        prompt: `Erstelle eine Feuerwehr-Mission für Kinder (unter 6 Jahre) basierend auf: ${prompt}

Antworte NUR im JSON-Format:
{
  "title": "Kurzer Titel (max 5 Wörter)",
  "description": "Beschreibung für Kinder (2-3 Sätze)",
  "caller_text": "Anrufertext für die Feuerwehr (1-2 Sätze, einfache Sprache)",
  "suggested_sounds": ["sound1", "sound2"],
  "difficulty": "easy"
}`,
        stream: false
      })
    })

    if (!response.ok) {
      throw new Error(`Ollama error: ${response.status}`)
    }

    const data = await response.json()
    
    // Parse JSON from response
    try {
      const mission = JSON.parse(data.response)
      return mission
    } catch {
      throw new Error('Invalid JSON response from Ollama')
    }
  }
}

// Convenience function for simple usage
export async function generateMission(stichpunkte: string): Promise<GeneratedMission> {
  const service = new OllamaService()
  return service.generateMissionFromPrompt(stichpunkte)
}

// Convenience function with saved config
export async function generateMissionWithSavedConfig(stichpunkte: string): Promise<GeneratedMission> {
  const keys = getApiKeys()
  const service = new OllamaService({ 
    model: 'kimi-k2.5',
    url: keys.ollamaUrl || 'http://localhost:11434/api/generate'
  })
  return service.generateMissionFromPrompt(stichpunkte)
}
