export interface Keyword {
  id: string;
  name: string;
  type: 'Feuerwehr' | 'THL' | 'Rettungsdienst';
  default_alerting_sound: string;
}

export interface KeywordsData {
  keywords: Keyword[];
}

export async function loadKeywords(): Promise<Keyword[]> {
  const response = await fetch('/keywords.yaml');
  if (!response.ok) {
    throw new Error('Failed to load keywords');
  }
  const yaml = await response.text();
  // Simple YAML parsing for keywords
  const lines = yaml.split('\n');
  const keywords: Keyword[] = [];
  let currentKeyword: Partial<Keyword> = {};
  
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('- id:')) {
      if (currentKeyword.id) {
        keywords.push(currentKeyword as Keyword);
      }
      currentKeyword = { id: trimmed.replace('- id:', '').trim() };
    } else if (trimmed.startsWith('name:')) {
      currentKeyword.name = trimmed.replace('name:', '').trim().replace(/"/g, '');
    } else if (trimmed.startsWith('type:')) {
      currentKeyword.type = trimmed.replace('type:', '').trim().replace(/"/g, '') as Keyword['type'];
    } else if (trimmed.startsWith('default_alerting_sound:')) {
      currentKeyword.default_alerting_sound = trimmed.replace('default_alerting_sound:', '').trim().replace(/"/g, '');
    }
  }
  
  if (currentKeyword.id) {
    keywords.push(currentKeyword as Keyword);
  }
  
  return keywords;
}

export function getKeywordsByType(keywords: Keyword[], type: Keyword['type']): Keyword[] {
  return keywords.filter(k => k.type === type);
}

export function getKeywordById(keywords: Keyword[], id: string): Keyword | undefined {
  return keywords.find(k => k.id === id);
}

export function getDefaultSoundForKeyword(keywords: Keyword[], id: string): string | undefined {
  const keyword = getKeywordById(keywords, id);
  return keyword?.default_alerting_sound;
}
