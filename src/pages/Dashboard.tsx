import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useMissions } from '@/hooks/useMissions';

// Status Badge Component
function StatusBadge({ status }: { status: 'pending' | 'generated' | 'missing' }) {
  const colors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    generated: 'bg-green-100 text-green-800',
    missing: 'bg-red-100 text-red-800',
  };

  const labels: Record<string, string> = {
    pending: 'Pending',
    generated: 'Generated',
    missing: 'Missing',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[status]}`}>
      {labels[status]}
    </span>
  );
}

// Difficulty Badge Component
function DifficultyBadge({ difficulty }: { difficulty: string }) {
  const colors: Record<string, string> = {
    low: 'bg-blue-100 text-blue-800',
    medium: 'bg-purple-100 text-purple-800',
    high: 'bg-orange-100 text-orange-800',
    critical: 'bg-red-100 text-red-800',
  };

  const labels: Record<string, string> = {
    low: 'Low',
    medium: 'Medium',
    high: 'High',
    critical: 'Critical',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[difficulty] || colors.medium}`}>
      {labels[difficulty] || difficulty}
    </span>
  );
}

// Edit Button Component
function EditButton({ id }: { id: string }) {
  return (
    <Link to={`/missions/${id}`} className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2">
      Bearbeiten
    </Link>
  );
}

export default function Dashboard() {
  const { missions, isLoading, error, getSoundStatusCount } = useMissions();
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    setHasLoaded(!isLoading);
  }, [isLoading]);

  const soundCounts = getSoundStatusCount();

  if (isLoading && !hasLoaded) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading missions...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="pt-6">
            <p className="text-red-500">Error loading missions: {error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Mission Manager</h1>
          <p className="text-muted-foreground">Verwalte deine Einsatzsimulator-Missionen</p>
        </div>
        <Link 
          to="/ai-creator" 
          className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
        >
          Create Mission
        </Link>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle>Missionen</CardTitle>
            <CardDescription>Gesamtanzahl</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{missions.length}</p>
            <p className="text-sm text-muted-foreground mt-1">
              {missions.length === 1 ? '1 Mission' : `${missions.length} Missionen`}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Aktive Missionen</CardTitle>
            <CardDescription>Missionen mit Sounds</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {missions.filter((m) => m.sounds.length > 0).length}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              {missions.filter((m) => m.sounds.length > 0).length === 1
                ? '1 Mission mit Sounds'
                : `${missions.filter((m) => m.sounds.length > 0).length} Missionen mit Sounds`}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Generierte Sounds</CardTitle>
            <CardDescription>ElevenLabs TTS</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-600">{soundCounts.generated}</p>
            <p className="text-sm text-muted-foreground mt-1">
              {soundCounts.generated === 1 ? '1 Sound generiert' : `${soundCounts.generated} Sounds generiert`}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Offene Sounds</CardTitle>
            <CardDescription>Benötigen TTS</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-orange-500">
              {soundCounts.pending + soundCounts.missing}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              {soundCounts.pending + soundCounts.missing === 1
                ? '1 Sound benötigt TTS'
                : `${soundCounts.pending + soundCounts.missing} Sounds benötigen TTS`}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Missions Table */}
      <Card>
        <CardHeader>
          <CardTitle>Alle Missionen</CardTitle>
          <CardDescription>Übersicht aller gespeicherten Missionen</CardDescription>
        </CardHeader>
        <CardContent>
          {missions.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">Noch keine Missionen gespeichert</p>
              <p className="text-sm text-muted-foreground mt-2">
                Erstellen Sie eine neue Mission über den AI Creator
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="p-3 font-semibold">ID</th>
                    <th className="p-3 font-semibold">Name</th>
                    <th className="p-3 font-semibold">Kategorie</th>
                    <th className="p-3 font-semibold">Schwierigkeit</th>
                    <th className="p-3 font-semibold">Sounds</th>
                    <th className="p-3 font-semibold">Erstellt</th>
                    <th className="p-3 font-semibold">Aktionen</th>
                  </tr>
                </thead>
                <tbody>
                  {missions.map((mission) => (
                    <tr key={mission.id} className="border-b hover:bg-muted/50">
                      <td className="p-3 font-mono text-sm">{mission.id}</td>
                      <td className="p-3">
                        <div className="font-medium">{mission.name}</div>
                        <div className="text-sm text-muted-foreground mt-1 line-clamp-1">
                          {mission.description}
                        </div>
                      </td>
                      <td className="p-3">
                        <span className="text-sm">{mission.category}</span>
                      </td>
                      <td className="p-3">
                        <DifficultyBadge difficulty={mission.difficulty} />
                      </td>
                      <td className="p-3">
                        <div className="flex flex-wrap gap-1">
                          {mission.sounds.map((sound) => (
                            <StatusBadge key={sound.id} status={sound.status} />
                          ))}
                        </div>
                        <div className="text-xs text-muted-foreground mt-2">
                          {mission.sounds.length} Sounds insgesamt
                        </div>
                      </td>
                      <td className="p-3 text-sm text-muted-foreground">
                        {new Date(mission.createdAt).toLocaleDateString('de-DE')}
                      </td>
                      <td className="p-3">
                        <EditButton id={mission.id} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
