export interface Voice {
  voice_id: string
  name: string
  category: string
  labels?: {
    accent?: string
    description?: string
    gender?: string
    age?: string
  }
}

export interface ElevenLabsConfig {
  apiKey: string
  voiceId?: string
  modelId?: string
}

export interface ElevenLabsOptions {
  text: string
  voiceId?: string
  modelId?: string
  stability?: number
  similarityBoost?: number
}

export interface GenderVoiceFilter {
  gender: 'male' | 'female' | 'any'
  voices: Voice[]
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

  async getVoices(): Promise<Voice[]> {
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
      return data.voices || []
    } catch (error) {
      console.error("Error fetching voices:", error)
      return []
    }
  }

  /**
   * Filter voices by gender
   */
  filterVoicesByGender(voices: Voice[], gender: 'male' | 'female' | 'any'): Voice[] {
    if (gender === 'any') {
      return voices
    }
    
    return voices.filter(voice => {
      const voiceGender = voice.labels?.gender?.toLowerCase()
      if (!voiceGender) return true // Fallback: wenn keine Gender-Info vorhanden, stimme miteinschließen
      
      if (gender === 'male') {
        return voiceGender.includes('male') || voiceGender.includes('männlich') || voiceGender.includes('mann')
      }
      if (gender === 'female') {
        return voiceGender.includes('female') || voiceGender.includes('weiblich') || voiceGender.includes('frau')
      }
      return true
    })
  }

  /**
   * Get a random voice from filtered list
   */
  getRandomVoice(voices: Voice[], gender: 'male' | 'female' | 'any'): Voice | null {
    const filtered = this.filterVoicesByGender(voices, gender)
    if (filtered.length === 0) {
      return null
    }
    const randomIndex = Math.floor(Math.random() * filtered.length)
    return filtered[randomIndex]
  }
}

export default ElevenLabsService
