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

  private isCloudUrl(): boolean {
    // Cloud URLs contain 'api.ollama.com' in the domain
    try {
      const urlObj = new URL(this.url)
      return urlObj.hostname === 'api.ollama.com'
    } catch {
      return this.url.includes('api.ollama.com')
    }
  }

  async generateMissionFromPrompt(prompt: string): Promise<GeneratedMission> {
    // Detect if using Ollama Cloud or local
    const isCloud = this.isCloudUrl()
    
    // Build headers
    const headers: Record<string, string> = { 'Content-Type': 'application/json' }
    
    // For Cloud API: Add API key from headers
    if (isCloud) {
      const keys = getApiKeys()
      if (keys.ollamaApiKey) {
        headers['Authorization'] = `Bearer ${keys.ollamaApiKey}`
      }
    }
    
    // Determine endpoint
    // For Cloud: the URL already contains /v1, append /chat/completions
    // For Local: the URL should already include /api/generate
    const endpoint = isCloud 
      ? `${this.url}/chat/completions`
      : this.url

    // Build body based on API type
    const body = {
      model: this.model,
      messages: [{
        role: 'user',
        content: `Erstelle eine Feuerwehr-Mission für Kinder (unter 6 Jahre) basierend auf: ${prompt}

Antworte NUR im JSON-Format:
{
  "title": "Kurzer Titel (max 5 Wörter)",
  "description": "Beschreibung für Kinder (2-3 Sätze)",
  "caller_text": "Anrufertext für die Feuerwehr (1-2 Sätze, einfache Sprache)",
  "suggested_sounds": ["sound1", "sound2"],
  "difficulty": "easy"
}`
      }],
      stream: false
    }

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(body)
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Ollama error: ${response.status} ${errorText}`)
    }

    const data = await response.json()
    
    // Parse JSON from response
    try {
      // Cloud API returns { choices: [{ message: { content: '...' } }] }
      // Local API returns { response: '...' }
      const content = isCloud 
        ? data.choices[0]?.message?.content
        : data.response
      
      if (!content) {
        throw new Error('No content in response')
      }
      
      const mission = JSON.parse(content)
      return mission
    } catch (parseError: any) {
      throw new Error(`Invalid JSON response: ${parseError.message}`)
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
