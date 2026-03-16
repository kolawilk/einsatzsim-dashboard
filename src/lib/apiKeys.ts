const STORAGE_KEY = 'einsatzsim_api_keys';

export interface ApiKeys {
  elevenLabs?: string;
  freesound?: string;
  ollamaUrl: string;
  ollamaApiKey?: string;
}

export function saveApiKeys(keys: ApiKeys): void {
  try {
    const serialized = JSON.stringify(keys);
    const encoded = btoa(serialized);
    localStorage.setItem(STORAGE_KEY, encoded);
  } catch (error) {
    console.error('Error saving API keys:', error);
    throw new Error('Failed to save API keys');
  }
}

export function getApiKeys(): ApiKeys {
  try {
    const encoded = localStorage.getItem(STORAGE_KEY);
    if (!encoded) {
      return { ollamaUrl: 'http://localhost:11434' };
    }
    const serialized = atob(encoded);
    const keys = JSON.parse(serialized);
    // Ensure ollamaUrl always has a default
    if (!keys.ollamaUrl) {
      keys.ollamaUrl = 'http://localhost:11434';
    }
    return keys;
  } catch (error) {
    console.error('Error loading API keys:', error);
    return { ollamaUrl: 'http://localhost:11434' };
  }
}

export function maskApiKey(key: string): string {
  if (!key || key.length < 4) {
    return '••••';
  }
  return '••••' + key.slice(-4);
}
