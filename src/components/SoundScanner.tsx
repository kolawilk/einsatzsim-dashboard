import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, CheckCircle2, FileAudio } from 'lucide-react';
import { scanMissingSounds, type MissingSound } from '@/lib/soundScanner';
import store from '@/lib/missions';

export default function SoundScanner() {
  const [missingSounds, setMissingSounds] = useState<MissingSound[]>([]);
  const [availableSounds, setAvailableSounds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    scanMissingSoundsFromStore();
  }, []);

  const scanMissingSoundsFromStore = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const missions = store.missions;
      if (missions.length === 0) {
        setMissingSounds([]);
        setAvailableSounds([]);
        return;
      }
      
      const result = await scanMissingSounds(missions);
      setMissingSounds(result.missingSounds);
      setAvailableSounds(result.availableSounds);
    } catch (err) {
      setError('Fehler beim Scannen der Sounds');
      console.error('Scan error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Group missing sounds by mission
  const missingByMission = missingSounds.reduce((acc, sound) => {
    if (!acc[sound.missionId]) {
      acc[sound.missionId] = {
        missionName: sound.missionName,
        sounds: []
      };
    }
    acc[sound.missionId].sounds.push(sound);
    return acc;
  }, {} as { [missionId: string]: { missionName: string; sounds: MissingSound[] } });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Sound Scanner</h2>
          <p className="text-muted-foreground">Prüft fehlende Sounds in Missionen</p>
        </div>
        <button
          onClick={scanMissingSoundsFromStore}
          className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 py-2"
        >
          <FileAudio className="w-4 h-4 mr-2" />
          Neuer Scan
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>fehlende Sounds</CardTitle>
            <CardDescription>{missingSounds.length} Sound-Dateien fehlen</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-red-600">{missingSounds.length}</div>
            <p className="text-sm text-muted-foreground mt-2">
              {missingSounds.length === 1 
                ? '1 Sound Datei ist nicht im Ordner' 
                : `${missingSounds.length} Sound Dateien fehlen`}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>verfügbare Sounds</CardTitle>
            <CardDescription>{availableSounds.length} Sound-Dateien gefunden</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-green-600">{availableSounds.length}</div>
            <p className="text-sm text-muted-foreground mt-2">
              {availableSounds.length === 1 
                ? '1 Sound Datei im Ordner' 
                : `${availableSounds.length} Sound Dateien gefunden`}
            </p>
          </CardContent>
        </Card>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {missingSounds.length === 0 && !error && (
        <Alert className="bg-green-50 border-green-200">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-600">
            Alle Sounds sind vorhanden! 🎉
          </AlertDescription>
        </Alert>
      )}

      {/* Detailed Missing Sounds List */}
      {missingSounds.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Details zu fehlenden Sounds</h3>
          
          {Object.entries(missingByMission).map(([missionId, data]) => (
            <Card key={missionId} className="overflow-hidden">
              <div className="bg-muted/50 px-4 py-3 border-b">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium">{data.missionName}</h4>
                    <p className="text-sm text-muted-foreground">{missionId}</p>
                  </div>
                  <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    {data.sounds.length} fehlend
                  </span>
                </div>
              </div>
              <CardContent className="p-4">
                <ul className="space-y-2">
                  {data.sounds.map((sound, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-sm">
                      <FileAudio className="w-4 h-4 text-muted-foreground mt-0.5" />
                      <div>
                        <div className="font-medium">{sound.filename}</div>
                        <div className="text-muted-foreground">
                          Status: {sound.state} • Typ: {sound.soundType}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
