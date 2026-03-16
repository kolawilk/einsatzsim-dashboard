export interface Mission {
  id: string
  name: string
  description: string
  difficulty: "easy" | "medium" | "hard" | "critical"
  category: string
  caller_gender: "male" | "female" | "any"
  toys: string[]
  states: MissionStates
  sounds: MissionSound[]
  createdAt: string
  updatedAt: string
}

export interface MissionSound {
  id: string
  name: string
  status: "pending" | "generated" | "missing"
  elevenLabsVoice?: string
}

export interface MissionState {
  sound_in?: string
  sound_out?: string
  sound_floor?: string
  sound_sequence?: string
}

export interface MissionStates {
  calling: MissionState
  alerting: MissionState
  deploying: MissionState
  arrived: MissionState
  returning: MissionState
}

export interface MissionStore {
  missions: Mission[]
  getMission: (id: string) => Mission | undefined
  addMission: (mission: Mission) => void
  updateMission: (mission: Mission) => void
  deleteMission: (id: string) => void
  getMissingSounds: () => MissionSound[]
}

export interface ElevenLabsConfig {
  apiKey: string
  voiceId: string
  modelId?: string
}

export interface OllamaConfig {
  baseUrl: string
  model: string
}

export interface FreesoundConfig {
  apiKey: string
}

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
