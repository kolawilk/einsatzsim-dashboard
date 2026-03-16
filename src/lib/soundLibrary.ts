/**
 * Sound Library Management
 * Verwaltung aller Sound-Dateien (alarm/, effects/, calls/)
 */

export interface SoundMetadata {
  id: string;
  filename: string;
  category: 'alarm' | 'effects' | 'calls';
  name: string;
  duration: number; // in seconds
  tags: string[];
  size: number; // in bytes
  uploadedAt: string;
}

export interface SoundLibraryState {
  sounds: SoundMetadata[];
  isLoading: boolean;
  error: string | null;
}

export interface UploadResponse {
  success: boolean;
  sound?: SoundMetadata;
  message: string;
}

const CATEGORIES = ['alarm', 'effects', 'calls'] as const;
export type Category = typeof CATEGORIES[number];

/**
 * Scans the public/sounds directory and returns all sound files with metadata
 */
export async function scanSounds(): Promise<SoundMetadata[]> {
  try {
    // Try to load sounds manifest first
    try {
      const manifestResponse = await fetch('/sounds/sounds.json');
      if (manifestResponse.ok) {
        const manifest = await manifestResponse.json();
        if (Array.isArray(manifest.files)) {
          return manifest.files.map((filename: string) => ({
            id: filename,
            filename,
            category: detectCategory(filename),
            name: parseSoundName(filename),
            duration: 0, // Would need to determine from file or metadata
            tags: [],
            size: 0,
            uploadedAt: manifest.generatedAt || new Date().toISOString()
          }));
        }
      }
    } catch {
      // Manifest not available
    }

    // Fallback: scan each category directory
    const sounds: SoundMetadata[] = [];
    
    for (const category of CATEGORIES) {
      try {
        const response = await fetch(`/sounds/${category}/`);
        if (response.ok) {
          // In browser environment, we can't actually list directory contents
          // This would need server-side or manifest-based approach
          console.warn(`Directory listing not available for ${category}, using manifest approach`);
        }
      } catch {
        // Category directory doesn't exist or is empty
      }
    }

    return sounds;
  } catch (error) {
    console.error('Error scanning sounds:', error);
    return [];
  }
}

/**
 * Detects the category of a sound file based on its filename
 */
export function detectCategory(filename: string): Category {
  const lower = filename.toLowerCase();
  
  if (lower.includes('alarm') || lower.includes('siren') || lower.includes('alert')) {
    return 'alarm';
  } else if (lower.includes('call') || lower.includes('voice') || lower.includes('radio')) {
    return 'calls';
  }
  return 'effects';
}

/**
 * Parses the sound name from a filename (removes extension and prefix)
 */
export function parseSoundName(filename: string): string {
  // Remove extension
  const nameWithoutExt = filename.replace(/\.(mp3|wav|ogg)$/i, '');
  
  // Remove common prefixes
  const cleanName = nameWithoutExt
    .replace(/^alarm-/, '')
    .replace(/^effects-/, '')
    .replace(/^calls-/, '')
    .replace(/^mission-\d+-/, '');
  
  // Convert kebab-case to readable text
  return cleanName.replace(/-/g, ' ');
}

/**
 * Get all available sound files with metadata
 */
export async function getSoundLibrary(): Promise<SoundMetadata[]> {
  try {
    // Try manifest first
    const response = await fetch('/sounds/sounds.json');
    if (response.ok) {
      const data = await response.json();
      return (data.files || []).map((filename: string) => ({
        id: filename,
        filename,
        category: detectCategory(filename),
        name: parseSoundName(filename),
        duration: 0,
        tags: [],
        size: 0,
        uploadedAt: data.generatedAt || new Date().toISOString()
      }));
    }
  } catch (error) {
    console.error('Error getting sound library:', error);
  }
  
  return [];
}

/**
 * Upload a sound file to the server
 */
export async function uploadSound(file: File, category: Category): Promise<UploadResponse> {
  try {
    // Create FormData for upload
    const formData = new FormData();
    formData.append('file', file);
    formData.append('category', category);
    
    // In a real implementation, this would upload to a server endpoint
    // For now, we'll simulate the upload and return a mock response
    
    const sound: SoundMetadata = {
      id: `${category}-${Date.now()}-${file.name}`,
      filename: file.name,
      category,
      name: parseSoundName(file.name),
      duration: 0, // Would need to read from file metadata
      tags: [],
      size: file.size,
      uploadedAt: new Date().toISOString()
    };
    
    // In production: POST to /api/sounds/upload
    // const response = await fetch('/api/sounds/upload', { method: 'POST', body: formData });
    
    return {
      success: true,
      sound,
      message: 'Sound uploaded successfully'
    };
  } catch (error) {
    console.error('Error uploading sound:', error);
    return {
      success: false,
      message: 'Upload failed'
    };
  }
}

/**
 * Deletes a sound file
 */
export async function deleteSound(id: string): Promise<boolean> {
  try {
    // In production: DELETE /api/sounds/:id
    // For now, simulate success
    console.log(`Deleting sound: ${id}`);
    return true;
  } catch (error) {
    console.error('Error deleting sound:', error);
    return false;
  }
}

/**
 * Update sound metadata (tags, name, etc.)
 */
export async function updateSoundMetadata(id: string, metadata: Partial<SoundMetadata>): Promise<boolean> {
  try {
    // In production: PATCH /api/sounds/:id
    console.log(`Updating sound ${id}:`, metadata);
    
    // Get current library, update, and save
    const library = await getSoundLibrary();
    const sound = library.find(s => s.id === id);
    
    if (sound) {
      const updatedSound = { ...sound, ...metadata };
      // Save updated library
      await saveSoundLibrary(library.map(s => s.id === id ? updatedSound : s));
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Error updating sound metadata:', error);
    return false;
  }
}

/**
 * Save sound library to manifest
 */
export async function saveSoundLibrary(sounds: SoundMetadata[]): Promise<void> {
  try {
    const response = await fetch('/sounds/sounds.json', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        files: sounds.map(s => s.filename),
        sounds: sounds,
        generatedAt: new Date().toISOString()
      })
    });
    
    if (!response.ok) {
      throw new Error('Failed to save sound library');
    }
  } catch (error) {
    console.error('Error saving sound library:', error);
    throw error;
  }
}

/**
 * Filter sounds by category
 */
export function filterByCategory(sounds: SoundMetadata[], category: Category): SoundMetadata[] {
  return sounds.filter(s => s.category === category);
}

/**
 * Search sounds by name or tags
 */
export function searchSounds(sounds: SoundMetadata[], query: string): SoundMetadata[] {
  const lowerQuery = query.toLowerCase();
  return sounds.filter(s => 
    s.name.toLowerCase().includes(lowerQuery) ||
    s.filename.toLowerCase().includes(lowerQuery) ||
    s.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
  );
}
