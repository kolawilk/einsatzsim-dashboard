import { useState } from 'react';
import { GripVertical, Plus, Trash2, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface SoundItem {
  id: string;
  type: 'sound_in' | 'sound_out' | 'sound_floor' | 'sound_sequence';
  file: string;
  volume: number;
  pitch: number;
}

interface SoundArrangerProps {
  sounds: SoundItem[];
  onChange: (sounds: SoundItem[]) => void;
}

const soundTypes = [
  { value: 'sound_in', label: 'Sound In' },
  { value: 'sound_out', label: 'Sound Out' },
  { value: 'sound_floor', label: 'Sound Floor' },
  { value: 'sound_sequence', label: 'Sound Sequence' },
];

export function SoundArranger({ sounds, onChange }: SoundArrangerProps) {
  const [newSound, setNewSound] = useState<Partial<SoundItem>>({
    type: 'sound_in',
    file: '',
    volume: 100,
    pitch: 1,
  });

  const addSound = () => {
    if (newSound.file) {
      const sound: SoundItem = {
        id: crypto.randomUUID(),
        type: newSound.type || 'sound_in',
        file: newSound.file,
        volume: newSound.volume || 100,
        pitch: newSound.pitch || 1,
      };
      onChange([...sounds, sound]);
      setNewSound({ type: 'sound_in', file: '', volume: 100, pitch: 1 });
    }
  };

  const removeSound = (id: string) => {
    onChange(sounds.filter(s => s.id !== id));
  };

  const updateSound = (id: string, updates: Partial<SoundItem>) => {
    onChange(sounds.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  const moveSound = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index > 0) {
      const newSounds = [...sounds];
      [newSounds[index], newSounds[index - 1]] = [newSounds[index - 1], newSounds[index]];
      onChange(newSounds);
    } else if (direction === 'down' && index < sounds.length - 1) {
      const newSounds = [...sounds];
      [newSounds[index], newSounds[index + 1]] = [newSounds[index + 1], newSounds[index]];
      onChange(newSounds);
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Sound Arrangement</label>
        
        {sounds.map((sound, index) => (
          <div key={sound.id} className="flex items-center gap-2 p-3 border rounded-lg bg-muted/50">
            <div className="flex flex-col gap-1">
              <button
                onClick={() => moveSound(index, 'up')}
                disabled={index === 0}
                className="text-muted-foreground hover:text-foreground disabled:opacity-30"
              >
                ▲
              </button>
              <button
                onClick={() => moveSound(index, 'down')}
                disabled={index === sounds.length - 1}
                className="text-muted-foreground hover:text-foreground disabled:opacity-30"
              >
                ▼
              </button>
            </div>

            <Select
              value={sound.type}
              onValueChange={(v) => updateSound(sound.id, { type: v as SoundItem['type'] })}
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {soundTypes.map(t => (
                  <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Input
              value={sound.file}
              onChange={(e) => updateSound(sound.id, { file: e.target.value })}
              placeholder="Sound-Datei"
              className="flex-1"
            />

            <div className="flex items-center gap-2 w-[120px]">
              <Volume2 className="h-4 w-4 text-muted-foreground" />
              <Slider
                value={[sound.volume]}
                onValueChange={([v]) => updateSound(sound.id, { volume: v })}
                max={100}
                step={5}
                className="w-20"
              />
              <span className="text-xs w-8">{sound.volume}%</span>
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => removeSound(sound.id)}
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        ))}
      </div>

      <div className="flex gap-2 items-end">
        <Select
          value={newSound.type}
          onValueChange={(v) => setNewSound({ ...newSound, type: v as SoundItem['type'] })}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Typ" />
          </SelectTrigger>
          <SelectContent>
            {soundTypes.map(t => (
              <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Input
          value={newSound.file}
          onChange={(e) => setNewSound({ ...newSound, file: e.target.value })}
          placeholder="Sound-Datei (z.B. alarm/brand_1.mp3)"
          className="flex-1"
        />

        <Button onClick={addSound}>
          <Plus className="h-4 w-4 mr-2" />
          Hinzufügen
        </Button>
      </div>
    </div>
  );
}
