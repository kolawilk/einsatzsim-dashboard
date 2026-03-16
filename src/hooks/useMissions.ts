import { useState, useEffect, useCallback } from 'react';
import type { Mission } from '@/lib/missions';
import store, { loadMissionsFromYaml } from '@/lib/missions';

export function useMissions() {
  const [missions, setMissions] = useState<Mission[]>(store.missions);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        await loadMissionsFromYaml();
        setMissions(store.missions);
      } catch (err) {
        setError('Failed to load missions');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, []);

  const addMission = useCallback((mission: Mission) => {
    store.addMission(mission);
    setMissions(store.missions);
  }, []);

  const updateMission = useCallback((mission: Mission) => {
    store.updateMission(mission);
    setMissions(store.missions);
  }, []);

  const deleteMission = useCallback((id: string) => {
    store.deleteMission(id);
    setMissions(store.missions);
  }, []);

  const getMissingSounds = useCallback(() => {
    return store.getMissingSounds();
  }, []);

  const getMissingSoundsPerMission = useCallback(() => {
    return store.getMissingSoundsPerMission();
  }, []);

  const getSoundStatusCount = useCallback(() => {
    return store.getSoundStatusCount();
  }, []);

  return {
    missions,
    isLoading,
    error,
    addMission,
    updateMission,
    deleteMission,
    getMissingSounds,
    getMissingSoundsPerMission,
    getSoundStatusCount,
  };
}
