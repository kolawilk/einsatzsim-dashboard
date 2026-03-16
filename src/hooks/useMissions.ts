import { useState, useEffect, useCallback } from "react"
import { Mission, MissionStore } from "@/lib/missions"

const store = MissionStore

export function useMissions() {
  const [missions, setMissions] = useState<Mission[]>(store.missions)

  useEffect(() => {
    setMissions(store.missions)
  }, [])

  const addMission = useCallback((mission: Mission) => {
    store.addMission(mission)
    setMissions(store.missions)
  }, [])

  const updateMission = useCallback((mission: Mission) => {
    store.updateMission(mission)
    setMissions(store.missions)
  }, [])

  const deleteMission = useCallback((id: string) => {
    store.deleteMission(id)
    setMissions(store.missions)
  }, [])

  const getMissingSounds = useCallback(() => {
    return store.getMissingSounds()
  }, [])

  return {
    missions,
    addMission,
    updateMission,
    deleteMission,
    getMissingSounds,
  }
}
