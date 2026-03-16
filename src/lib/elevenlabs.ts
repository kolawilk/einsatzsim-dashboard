export interface ElevenLabsConfig {
  apiKey: string
  voiceId: string
  modelId?: string
}

export interface ElevenLabsOptions {
  text: string
  voiceId?: string
  modelId?: string
  stability?: number
  similarityBoost?: number
}

class ElevenLabsService {
  private config: ElevenLabsConfig

  constructor(config: ElevenLabsConfig) {
    this.config = config
  }

  async generateSpeech(options: ElevenLabsOptions): Promise<Blob | null> {
    const url = `https://api.elevenlabs.io/v1/text-to-speech/${options.voiceId || this.config.voiceId}`
    
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "xi-api-key": this.config.apiKey,
        },
        body: JSON.stringify({
          text: options.text,
          model_id: options.modelId || this.config.modelId,
          voice_settings: {
            stability: options.stability ?? 0.5,
            similarity_boost: options.similarityBoost ?? 0.75,
          },
        }),
      })

      if (!response.ok) {
        throw new Error(`ElevenLabs API error: ${response.status}`)
      }

      const blob = await response.blob()
      return blob
    } catch (error) {
      console.error("Error generating speech:", error)
      return null
    }
  }

  async getVoices() {
    try {
      const response = await fetch("https://api.elevenlabs.io/v1/voices", {
        headers: {
          "xi-api-key": this.config.apiKey,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch voices")
      }

      const data = await response.json()
      return data.voices
    } catch (error) {
      console.error("Error fetching voices:", error)
      return []
    }
  }
}

export default ElevenLabsService
