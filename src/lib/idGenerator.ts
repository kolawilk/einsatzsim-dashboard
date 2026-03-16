let lastId = 0;

export function generateMissionId(): string {
  lastId++;
  return `mission_${String(lastId).padStart(4, '0')}`;
}

export function setLastId(id: number): void {
  lastId = id;
}

export function getLastId(): number {
  return lastId;
}

export function migrateExistingIds(missions: any[]): any[] {
  return missions.map((mission) => ({
    ...mission,
    id: mission.id || generateMissionId(),
    legacy_id: mission.id // Keep old ID as reference
  }));
}
