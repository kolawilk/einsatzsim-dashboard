import { useState, useCallback } from 'react';
import { Upload, Play, Pause, Trash2, Music } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface SoundFile {
  id: string;
  name: string;
  category: 'alarm' | 'effects' | 'calls';
  duration?: number;
  size?: number;
}

export default function SoundLibrary() {
  const [sounds, setSounds] = useState<SoundFile[]>([
    { id: '1', name: 'brand_1.mp3', category: 'alarm', duration: 3.5 },
    { id: '2', name: 'brand_2.mp3', category: 'alarm', duration: 4.0 },
    { id: '3', name: 'sirene.mp3', category: 'effects', duration: 5.2 },
    { id: '4', name: 'anruf_1.mp3', category: 'calls', duration: 8.1 },
  ]);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files).filter(f => 
      f.type.startsWith('audio/')
    );
    
    files.forEach(file => {
      const newSound: SoundFile = {
        id: crypto.randomUUID(),
        name: file.name,
        category: 'effects',
        size: file.size,
      };
      setSounds(prev => [...prev, newSound]);
    });
  }, []);

  const togglePlay = (id: string) => {
    setPlayingId(playingId === id ? null : id);
  };

  const deleteSound = (id: string) => {
    setSounds(sounds.filter(s => s.id !== id));
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'alarm': return 'bg-red-500';
      case 'effects': return 'bg-blue-500';
      case 'calls': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="mb-6">
        <h1 className="text-4xl font-bold tracking-tight">Sound-Bibliothek</h1>
        <p className="text-muted-foreground">Verwalte alle Sound-Dateien</p>
      </div>

      <Card
        className={`mb-6 border-2 border-dashed transition-colors ${
          isDragging ? 'border-primary bg-primary/5' : 'border-muted'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <CardContent className="py-12 text-center">
          <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-lg font-medium">Sounds per Drag & Drop hochladen</p>
          <p className="text-sm text-muted-foreground">Unterstützt: MP3, WAV, OGG</p>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {sounds.map((sound) => (
          <Card key={sound.id}>
            <CardContent className="flex items-center gap-4 py-4">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getCategoryColor(sound.category)}`}>
                <Music className="h-5 w-5 text-white" />
              </div>

              <div className="flex-1">
                <p className="font-medium">{sound.name}</p>
                <div className="flex gap-2 mt-1">
                  <Badge variant="secondary">{sound.category}</Badge>
                  {sound.duration && <span className="text-sm text-muted-foreground">{sound.duration}s</span>}
                </div>
              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => togglePlay(sound.id)}
              >
                {playingId === sound.id ? (
                  <Pause className="h-4 w-4" />
                ) : (
                  <Play className="h-4 w-4" />
                )}
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => deleteSound(sound.id)}
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
