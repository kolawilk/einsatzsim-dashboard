import { useState, useEffect, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Play, 
  Upload, 
  FileAudio, 
  Search,
  Trash2,
  Volume2
} from 'lucide-react';
import { getSoundLibrary, uploadSound, deleteSound, updateSoundMetadata, filterByCategory, searchSounds } from '@/lib/soundLibrary';
import type { SoundMetadata, Category } from '@/lib/soundLibrary';
import { toast } from 'sonner';

// Sound visualization component
function Waveform({ duration }: { duration: number }) {
  return (
    <div className="flex items-center gap-0.5 h-8">
      {Array.from({ length: Math.min(duration * 2, 20) }).map((_, i) => (
        <div
          key={i}
          className="w-1 bg-primary rounded-full transition-all"
          style={{
            height: `${20 + Math.random() * 40}%`,
            opacity: 0.5 + Math.random() * 0.5
          }}
        />
      ))}
    </div>
  );
}

export default function SoundLibrary() {
  const [sounds, setSounds] = useState<SoundMetadata[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingSound, setEditingSound] = useState<SoundMetadata | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [audioPreview, setAudioPreview] = useState<HTMLAudioElement | null>(null);

  // Load sounds on mount
  useEffect(() => {
    const loadSounds = async () => {
      try {
        const soundsData = await getSoundLibrary();
        setSounds(soundsData);
      } catch (error) {
        console.error('Error loading sounds:', error);
        toast.error('Fehler beim Laden der Sound-Bibliothek');
      }
    };
    loadSounds();
  }, []);

  // Handle file upload
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    // Determine category based on filename or let user select
    const category = detectCategoryFromFilename(acceptedFiles[0].name) || 'effects';

    for (const file of acceptedFiles) {
      try {
        const response = await uploadSound(file, category as Category);
        
        if (response.success && response.sound) {
          setSounds(prev => [...prev, response.sound!]);
          toast.success(`Sound "${response.sound.name}" erfolgreich hochgeladen`);
        } else {
          toast.error(`Fehler beim Upload von ${file.name}: ${response.message}`);
        }
      } catch (error) {
        console.error('Error uploading file:', error);
        toast.error(`Upload fehlgeschlagen: ${file.name}`);
      }
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'audio/mpeg': ['.mp3'],
      'audio/wav': ['.wav'],
      'audio/ogg': ['.ogg']
    },
    maxFiles: 10
  });

  const detectCategoryFromFilename = (filename: string): Category | null => {
    const lower = filename.toLowerCase();
    if (lower.includes('alarm') || lower.includes('siren') || lower.includes('alert')) {
      return 'alarm';
    } else if (lower.includes('call') || lower.includes('voice') || lower.includes('radio')) {
      return 'calls';
    }
    return null;
  };

  // Filter sounds
  const filteredSounds = searchQuery
    ? searchSounds(sounds, searchQuery)
    : sounds;

  // Group sounds by category
  const alarmSounds = filterByCategory(filteredSounds, 'alarm');
  const effectSounds = filterByCategory(filteredSounds, 'effects');
  const callSounds = filterByCategory(filteredSounds, 'calls');

  // Play/pause sound
  const playSound = (sound: SoundMetadata) => {
    if (audioPreview) {
      audioPreview.pause();
      audioPreview.currentTime = 0;
    }

    const audio = new Audio(`/sounds/${sound.filename}`);
    audio.play().catch(e => {
      console.error('Error playing sound:', e);
      toast.error('Konnte Sound nicht abspielen');
    });

    setAudioPreview(audio);

    audio.onended = () => {
      setAudioPreview(null);
    };
  };

  // Delete sound
  const handleDelete = async (id: string) => {
    if (!window.confirm('Wirklich löschen?')) return;

    const success = await deleteSound(id);
    if (success) {
      setSounds(prev => prev.filter(s => s.id !== id));
      toast.success('Sound erfolgreich gelöscht');
    } else {
      toast.error('Löschen fehlgeschlagen');
    }
  };

  // Update sound metadata
  const handleUpdateMetadata = async (id: string, metadata: Partial<SoundMetadata>) => {
    const success = await updateSoundMetadata(id, metadata);
    if (success) {
      setSounds(prev => prev.map(s => s.id === id ? { ...s, ...metadata } : s));
      setEditingSound(null);
      setIsEditDialogOpen(false);
      toast.success('Metadaten aktualisiert');
    } else {
      toast.error('Aktualisierung fehlgeschlagen');
    }
  };

  // Close audio on unmount
  useEffect(() => {
    return () => {
      if (audioPreview) {
        audioPreview.pause();
      }
    };
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Sound-Bibliothek</h1>
        <p className="text-muted-foreground">
          Verwalten Sie alle Sound-Dateien für den Einsatzsimulator
        </p>
      </div>

      {/* Upload Area */}
      <Card className="mb-8">
        <CardContent className="pt-6">
          <div
            {...getRootProps()}
            className={`
              border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
              ${isDragActive ? 'border-primary bg-primary/10' : 'border-input hover:border-primary'}
            `}
          >
            <input {...getInputProps()} />
            <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-lg font-medium">
              {isDragActive ? 'Drop files here' : 'Drag & Drop sounds here or click to upload'}
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Supported formats: MP3, WAV, OGG
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Sounds suchen..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Tabs by Category */}
      <Tabs defaultValue="alarm" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="alarm">
            Alarm <Badge variant="secondary" className="ml-2">{alarmSounds.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="effects">
            Effekte <Badge variant="secondary" className="ml-2">{effectSounds.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="calls">
            Calls <Badge variant="secondary" className="ml-2">{callSounds.length}</Badge>
          </TabsTrigger>
        </TabsList>

        {/* Alarm Sounds */}
        <TabsContent value="alarm">
          <SoundTable 
            title="Alarm Sounds" 
            sounds={alarmSounds} 
            onPlay={playSound} 
            onDelete={handleDelete}
            onEdit={(sound) => {
              setEditingSound(sound);
              setIsEditDialogOpen(true);
            }}
            audioPreview={audioPreview}
          />
        </TabsContent>

        {/* Effects */}
        <TabsContent value="effects">
          <SoundTable 
            title="Effekt-Sounds" 
            sounds={effectSounds} 
            onPlay={playSound} 
            onDelete={handleDelete}
            onEdit={(sound) => {
              setEditingSound(sound);
              setIsEditDialogOpen(true);
            }}
            audioPreview={audioPreview}
          />
        </TabsContent>

        {/* Calls */}
        <TabsContent value="calls">
          <SoundTable 
            title="Call-Sounds" 
            sounds={callSounds} 
            onPlay={playSound} 
            onDelete={handleDelete}
            onEdit={(sound) => {
              setEditingSound(sound);
              setIsEditDialogOpen(true);
            }}
            audioPreview={audioPreview}
          />
        </TabsContent>
      </Tabs>

      {/* Edit Sound Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sound bearbeiten</DialogTitle>
          </DialogHeader>
          {editingSound && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={editingSound.name}
                  onChange={(e) => setEditingSound({ ...editingSound, name: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="tags">Tags (durch Komma getrennt)</Label>
                <Input
                  id="tags"
                  value={editingSound.tags.join(', ')}
                  onChange={(e) => setEditingSound({ 
                    ...editingSound, 
                    tags: e.target.value.split(',').map(t => t.trim()) 
                  })}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button 
                  variant="destructive" 
                  onClick={() => {
                    handleDelete(editingSound.id);
                    setIsEditDialogOpen(false);
                  }}
                  className="mr-auto"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Löschen
                </Button>
                <Button onClick={() => handleUpdateMetadata(editingSound.id, editingSound)}>
                  Speichern
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Sound table component
function SoundTable({
  title,
  sounds,
  onPlay,
  onDelete,
  onEdit,
  audioPreview
}: {
  title: string;
  sounds: SoundMetadata[];
  onPlay: (sound: SoundMetadata) => void;
  onDelete: (id: string) => void;
  onEdit: (sound: SoundMetadata) => void;
  audioPreview: HTMLAudioElement | null;
}) {
  if (sounds.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6 text-center">
          <FileAudio className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
          <p className="text-muted-foreground">Keine Sounds in dieser Kategorie</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Dauer</TableHead>
                <TableHead>Tags</TableHead>
                <TableHead className="text-right">Aktionen</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sounds.map((sound) => (
                <TableRow key={sound.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => onPlay(sound)}
                      >
                        {audioPreview?.src === `/sounds/${sound.filename}` ? (
                          <Volume2 className="w-4 h-4 text-primary animate-pulse" />
                        ) : (
                          <Play className="w-4 h-4" />
                        )}
                      </Button>
                      <span>{sound.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Waveform duration={sound.duration || 5} />
                      <span className="text-sm text-muted-foreground">
                        {sound.duration ? `${sound.duration}s` : '-'}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {sound.tags.length > 0 ? (
                        sound.tags.map((tag, i) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-sm text-muted-foreground italic">Keine Tags</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => onEdit(sound)}
                      >
                        <FileAudio className="w-4 h-4 text-muted-foreground" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive"
                        onClick={() => onDelete(sound.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
