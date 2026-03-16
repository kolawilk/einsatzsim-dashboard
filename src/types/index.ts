export interface Mission {
  id: string
  name: string
  description: string
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
