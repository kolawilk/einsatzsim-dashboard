import type { MissionSound } from './missions';

export interface MissingSound {
  missionId: string;
  missionName: string;
  state: string;
  soundType: 'in' | 'out' | 'floor' | 'sequence' | 'random';
  filename: string;
}

export interface SoundScannerResult {
  missingSounds: MissingSound[];
  totalMissing: number;
  perMission: { [missionId: string]: MissingSound[] };
  availableSounds: string[];
}

/**
 * Scans the public/sounds directory and compares with mission definitions
 * to identify missing sound files.
 */
export async function scanMissingSounds(missions: { id: string; name: string; sounds: MissionSound[] }[]): Promise<SoundScannerResult> {
  const missingSounds: MissingSound[] = [];
  const availableSounds: string[] = [];
  const perMission: { [missionId: string]: MissingSound[] } = {};

  try {
    // Try to load sounds manifest first
    const manifestFiles: string[] = [];
    try {
      const manifestResponse = await fetch('/sounds/sounds.json');
      if (manifestResponse.ok) {
        const manifest = await manifestResponse.json();
        if (Array.isArray(manifest.files)) {
          (manifest.files as string[]).forEach((file: string) => {
            manifestFiles.push(file);
            availableSounds.push(file);
          });
        }
      }
    } catch {
      // Manifest not available, will check files individually
    }

    // Check each mission's sounds
    missions.forEach(mission => {
      const missionMissing: MissingSound[] = [];
      
      mission.sounds.forEach(sound => {
        // Generate filename based on mission and sound IDs
        const filename = `mission-${mission.id}-${sound.id}.mp3`;
        
        // Check if file exists
        let exists = false;
        if (manifestFiles.length > 0) {
          exists = manifestFiles.includes(filename);
        }
        
        // If status is 'missing' or 'pending' OR file doesn't exist, mark as missing
        const isMissingStatus = sound.status === 'missing' || sound.status === 'pending';
        
        if (isMissingStatus || !exists) {
          const missing: MissingSound = {
            missionId: mission.id,
            missionName: mission.name,
            state: sound.name,
            soundType: 'in', // Default - would need to determine based on actual sound type
            filename: filename
          };
          
          missingSounds.push(missing);
          missionMissing.push(missing);
        }
      });
      
      if (missionMissing.length > 0) {
        perMission[mission.id] = missionMissing;
      }
    });
    
  } catch (error) {
    console.error('Error scanning sounds:', error);
  }
  
  return {
    missingSounds,
    totalMissing: missingSounds.length,
    perMission,
    availableSounds
  };
}

/**
 * Check if a specific sound file exists
 */
export async function checkSoundExists(filename: string): Promise<boolean> {
  try {
    // Use HEAD request to check existence without downloading
    const response = await fetch(`/sounds/${filename}`, { method: 'HEAD' });
    return response.ok;
  } catch {
    return false;
  }
}

/**
 * Get all available sound files in the sounds directory
 */
export async function getAvailableSounds(): Promise<string[]> {
  try {
    // Try manifest first
    const response = await fetch('/sounds/sounds.json');
    if (response.ok) {
      const data = await response.json();
      return data.files || [];
    }
    
    // Fallback: return empty array
    return [];
  } catch (error) {
    console.error('Error getting available sounds:', error);
    return [];
  }
}

/**
 * Create a sounds manifest file
 */
export async function createSoundsManifest(sounds: string[]): Promise<void> {
  try {
    const response = await fetch('/sounds/sounds.json', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ files: sounds, generatedAt: new Date().toISOString() })
    });
    
    if (!response.ok) {
      console.error('Failed to create sounds manifest:', response.statusText);
    }
  } catch (error) {
    console.error('Error creating sounds manifest:', error);
  }
}
