import * as yaml from 'js-yaml';
import type { MissingSound } from './soundScanner';

export interface MissionState {
  sound_in?: string;
  sound_out?: string;
  sound_floor?: string;
  sound_sequence?: string;
}

export interface MissionStates {
  calling: MissionState;
  alerting: MissionState;
  deploying: MissionState;
  arrived: MissionState;
  returning: MissionState;
}

export interface Mission {
  id: string;
  name: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard' | 'critical';
  description: string;
  caller_gender: 'male' | 'female' | 'any';
  toys: string[];
  states: MissionStates;
  sounds: MissionSound[];
  createdAt: string;
  updatedAt: string;
}

export interface MissionSound {
  id: string;
  name: string;
  status: 'pending' | 'generated' | 'missing';
  elevenLabsVoice?: string;
}

export interface MissionStore {
  missions: Mission[];
  getMission: (id: string) => Mission | undefined;
  addMission: (mission: Mission) => void;
  updateMission: (mission: Mission) => void;
  deleteMission: (id: string) => void;
  getMissingSounds: () => MissionSound[];
  getSoundStatusCount: () => { pending: number; generated: number; missing: number };
  getMissingSoundFiles: () => MissingSound[];
  scanSoundFiles: () => Promise<MissingSound[]>;
  getMissingSoundsPerMission: () => { [missionId: string]: number };
}

const INITIAL_STATES: MissionStates = {
  calling: {},
  alerting: {},
  deploying: {},
  arrived: {},
  returning: {},
};

const store: MissionStore = {
  missions: [],
  
  getMission(id) {
    return this.missions.find(m => m.id === id);
  },
  
  addMission(mission) {
    // Ensure states exist with defaults
    if (!mission.states) {
      mission.states = INITIAL_STATES;
    }
    this.missions.push(mission);
  },
  
  updateMission(mission) {
    const index = this.missions.findIndex(m => m.id === mission.id);
    if (index !== -1) {
      // Ensure states exist with defaults
      if (!mission.states) {
        mission.states = INITIAL_STATES;
      }
      this.missions[index] = mission;
    }
  },
  
  deleteMission(id) {
    this.missions = this.missions.filter(m => m.id !== id);
  },
  
  getMissingSounds() {
    const missing: MissionSound[] = [];
    this.missions.forEach(mission => {
      mission.sounds.forEach(sound => {
        if (sound.status === 'missing' || sound.status === 'pending') {
          missing.push(sound);
        }
      });
    });
    return missing;
  },
  
  getSoundStatusCount() {
    let pending = 0;
    let generated = 0;
    let missing = 0;
    
    this.missions.forEach(mission => {
      mission.sounds.forEach(sound => {
        switch (sound.status) {
          case 'pending': pending++; break;
          case 'generated': generated++; break;
          case 'missing': missing++; break;
        }
      });
    });
    
    return { pending, generated, missing };
  },
  
  getMissingSoundFiles() {
    // This would be populated by scanSoundFiles
    return [];
  },
  
  async scanSoundFiles() {
    // Placeholder - would actually scan the filesystem
    // For now, return empty array
    return [];
  },
  
  getMissingSoundsPerMission() {
    const counts: { [missionId: string]: number } = {};
    this.missions.forEach(mission => {
      const count = mission.sounds.filter(
        sound => sound.status === 'missing' || sound.status === 'pending'
      ).length;
      if (count > 0) {
        counts[mission.id] = count;
      }
    });
    return counts;
  },
};

export async function loadMissionsFromYaml(): Promise<void> {
  try {
    const response = await fetch('/missions.yaml');
    if (!response.ok) {
      throw new Error(`Failed to load missions.yaml: ${response.status}`);
    }
    
    const yamlText = await response.text();
    const data = yaml.load(yamlText) as { missions: Mission[] };
    
    if (data && Array.isArray(data.missions)) {
      // Ensure all missions have states with defaults
      store.missions = data.missions.map(mission => ({
        ...mission,
        states: mission.states || INITIAL_STATES,
      }));
    }
  } catch (error) {
    console.error('Error loading missions from YAML:', error);
    // Fallback to empty array on error
    store.missions = [];
  }
}

export default store;
