export interface OllamaConfig {
  baseUrl: string
  model: string
}

export interface OllamaOptions {
  prompt: string
  systemPrompt?: string
  temperature?: number
  maxTokens?: number
}

class OllamaService {
  private config: OllamaConfig

  constructor(config: OllamaConfig) {
    this.config = config
  }

  async generateMission(options: OllamaOptions): Promise<string | null> {
    const url = `${this.config.baseUrl}/api/generate`
    
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: this.config.model,
          prompt: options.systemPrompt 
            ? `${options.systemPrompt}\n\n${options.prompt}`
            : options.prompt,
          temperature: options.temperature ?? 0.7,
          stream: false,
        }),
      })

      if (!response.ok) {
        throw new Error(`Ollama API error: ${response.status}`)
      }

      const data = await response.json()
      return data.response
    } catch (error) {
      console.error("Error generating mission:", error)
      return null
    }
  }

  async generateMissionFromPrompt(prompt: string): Promise<string | null> {
    const systemPrompt = `Du bist ein Experte für Einsatzsimulator-Missionen. Erstelle detaillierte, realistische Missionen im YAML-Format für einen Rettungsdienst- oder Feuerwehreinsatzsimulator. 

Formatiere deine Antwort als valides YAML mit folgender Struktur:

# Mission: [Name]
## Szenario
[Beschreibung des Szenarios]

## Einsatzkräfte
[ Liste der Einsatzkräfte mit-personen ]

## Abarbeitung
1. [Schritt 1]
2. [Schritt 2]
3. [Schritt 3]

## Ausrüstung
- [Ausrüstung 1]
- [Ausrüstung 2]

Sei präzise und realistisch.`

    return this.generateMission({
      prompt,
      systemPrompt,
      temperature: 0.7,
    })
  }
}

export default OllamaService
