export interface SoundResult {
  id: number
  name: string
  description: string
  duration: number
  username: string
  license: string
  previews: {
    'high-quality': string
    'low-quality': string
  }
  tags: string[]
  type: string
}

export interface FreesoundSearchResponse {
  count: number
  next: string | null
  previous: string | null
  results: SoundResult[]
}

export interface FreesoundConfig {
  apiKey: string
}

export class FreesoundService {
  private config: FreesoundConfig
  private readonly apiUrl = 'https://freesound.org/apiv2'

  constructor(config: FreesoundConfig) {
    this.config = config
  }

  /**
   * Search sounds on Freesound.org
   * @param query Search query
   * @param page Page number (1-indexed)
   * @param pageSize Number of results per page
   * @returns Search results
   */
  async searchSounds(
    query: string,
    page: number = 1,
    pageSize: number = 12
  ): Promise<FreesoundSearchResponse> {
    const url = `${this.apiUrl}/search/text/`

    try {
      const response = await fetch(`${url}?query=${encodeURIComponent(query)}&page=${page}&page_size=${pageSize}&fields=id,name,description,duration,username,license,previews,tags,type`, {
        headers: {
          'Authorization': `Token ${this.config.apiKey}`,
        },
      })

      if (!response.ok) {
        throw new Error(`Freesound API error: ${response.status}`)
      }

      const data: FreesoundSearchResponse = await response.json()
      return data
    } catch (error) {
      console.error('Error searching sounds:', error)
      throw error
    }
  }

  /**
   * Get a sound by ID
   * @param soundId Sound ID
   * @returns Sound details
   */
  async getSound(soundId: number): Promise<SoundResult> {
    const url = `${this.apiUrl}/sounds/${soundId}/`

    try {
      const response = await fetch(url, {
        headers: {
          'Authorization': `Token ${this.config.apiKey}`,
        },
      })

      if (!response.ok) {
        throw new Error(`Freesound API error: ${response.status}`)
      }

      const data: SoundResult = await response.json()
      return data
    } catch (error) {
      console.error('Error getting sound:', error)
      throw error
    }
  }

  /**
   * Get preview URL for a sound
   * @param soundId Sound ID
   * @returns Preview URL
   */
  async getSoundPreview(soundId: number): Promise<string> {
    const sound = await this.getSound(soundId)
    return sound.previews['high-quality']
  }

  /**
   * Get preview URL for a sound (simplified)
   * @param soundId Sound ID
   * @returns Preview URL
   */
  async previewSound(soundId: string): Promise<string> {
    return this.getSoundPreview(parseInt(soundId))
  }
}

export default FreesoundService
