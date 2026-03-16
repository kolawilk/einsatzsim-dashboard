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

const store: MissionStore = {
  missions: [],
  
  getMission(id) {
    return this.missions.find(m => m.id === id)
  },
  
  addMission(mission) {
    this.missions.push(mission)
  },
  
  updateMission(mission) {
    const index = this.missions.findIndex(m => m.id === mission.id)
    if (index !== -1) {
      this.missions[index] = mission
    }
  },
  
  deleteMission(id) {
    this.missions = this.missions.filter(m => m.id !== id)
  },
  
  getMissingSounds() {
    const missing: MissionSound[] = []
    this.missions.forEach(mission => {
      mission.sounds.forEach(sound => {
        if (sound.status === "missing" || sound.status === "pending") {
          missing.push(sound)
        }
      })
    })
    return missing
  },
}

export default store
