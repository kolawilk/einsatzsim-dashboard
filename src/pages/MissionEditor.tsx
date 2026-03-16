import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MultiSelect } from "@/components/ui/multi-select"
import { useMissions } from "@/hooks/useMissions"
import type { Mission, MissionSound, MissionStates, MissionState } from "@/types"
import store, { loadMissionsFromYaml } from "@/lib/missions"

const TOY_OPTIONS = [
  { label: "Feuerwehr", value: "feuerwehr" },
  { label: "Rettungsdienst", value: "rettung" },
  { label: "Polizei", value: "polizei" },
  { label: "THW", value: "thw" },
  { label: "Bundespolizei", value: "bundespolizei" },
  { label: "Werkfeuerwehr", value: "werkfeuerwehr" },
  { label: "Krankenhaus", value: "krankenhaus" },
  { label: "Sonstige", value: "sonstige" },
]

const DIFFICULTY_OPTIONS = [
  { label: "Easy", value: "easy" },
  { label: "Medium", value: "medium" },
  { label: "Hard", value: "hard" },
  { label: "Critical", value: "critical" },
]

const GENDER_OPTIONS = [
  { label: "Male", value: "male" },
  { label: "Female", value: "female" },
  { label: "Any", value: "any" },
]

const STATE_CONFIG = [
  { id: "calling", label: "Calling" },
  { id: "alerting", label: "Alerting" },
  { id: "deploying", label: "Deploying" },
  { id: "arrived", label: "Arrived" },
  { id: "returning", label: "Returning" },
]

// Initial state template
const INITIAL_STATES: MissionStates = {
  calling: {
    sound_in: "",
    sound_out: "",
    sound_floor: "",
    sound_sequence: "",
  },
  alerting: {
    sound_in: "",
    sound_out: "",
    sound_floor: "",
    sound_sequence: "",
  },
  deploying: {
    sound_in: "",
    sound_out: "",
    sound_floor: "",
    sound_sequence: "",
  },
  arrived: {
    sound_in: "",
    sound_out: "",
    sound_floor: "",
    sound_sequence: "",
  },
  returning: {
    sound_in: "",
    sound_out: "",
    sound_floor: "",
    sound_sequence: "",
  },
}

export default function MissionEditor() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const { updateMission } = useMissions()
  
  // Form state
  const [missionId, setMissionId] = useState("")
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard" | "critical" | "">("")
  const [category, setCategory] = useState("")
  const [callerGender, setCallerGender] = useState<"male" | "female" | "any" | "">("")
  const [toys, setToys] = useState<string[]>([])
  const [states, setStates] = useState<MissionStates>(INITIAL_STATES)
  const [sounds, setSounds] = useState<MissionSound[]>([])
  
  // Loading state
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Load mission if editing existing one
  useEffect(() => {
    const loadMission = async () => {
      setIsLoading(true)
      setError(null)
      
      try {
        // Ensure missions are loaded
        if (store.missions.length === 0) {
          await loadMissionsFromYaml()
        }
        
        if (id) {
          const mission = store.missions.find(m => m.id === id)
          if (mission) {
            setMissionId(mission.id)
            setName(mission.name)
            setDescription(mission.description)
            setDifficulty(mission.difficulty)
            setCategory(mission.category)
            setCallerGender(mission.caller_gender)
            setToys(mission.toys)
            setStates(mission.states || INITIAL_STATES)
            setSounds(mission.sounds)
          }
        } else {
          // Create new mission
          setMissionId(`mission-${Date.now()}`)
          setStates(INITIAL_STATES)
        }
      } catch (err) {
        setError("Fehler beim Laden der Mission")
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }
    
    loadMission()
  }, [id])

  const handleStateChange = (stateId: keyof MissionStates, field: keyof MissionState, value: string) => {
    setStates(prev => ({
      ...prev,
      [stateId]: {
        ...prev[stateId],
        [field]: value,
      },
    }))
  }

  const handleSave = async () => {
    if (!name.trim()) {
      setError("Bitte geben Sie einen Mission-Namen ein")
      return
    }

    if (!category.trim()) {
      setError("Bitte wählen Sie eine Kategorie aus")
      return
    }

    const mission: Mission = {
      id: missionId,
      name,
      description,
      difficulty: difficulty as "easy" | "medium" | "hard" | "critical",
      category,
      caller_gender: callerGender as "male" | "female" | "any",
      toys,
      states,
      sounds: sounds.length > 0 ? sounds : [
        { id: `sound-${Date.now()}`, name: "Alarm 1", status: "pending" as const }
      ],
      createdAt: id ? (store.missions.find(m => m.id === id)?.createdAt || new Date().toISOString()) : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    try {
      updateMission(mission)
      navigate("/")
    } catch (err) {
      setError("Fehler beim Speichern")
      console.error(err)
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Mission lädt...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="pt-6">
            <p className="text-red-500">{error}</p>
            <Button onClick={() => setError(null)} className="mt-4">
              Erneut versuchen
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <div className="mb-6">
        <Button 
          variant="ghost" 
          onClick={() => navigate("/")}
          className="mb-4"
        >
          ← Zurück zum Dashboard
        </Button>
        <h1 className="text-4xl font-bold tracking-tight">Mission Editor</h1>
        <p className="text-muted-foreground">
          {id ? "Bearbeite Mission" : "Erstelle neue Mission"}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Mission Details</CardTitle>
          <CardDescription>Gib alle relevanten Informationen zur Mission ein</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2">Grundlegende Informationen</h3>
            
            <div className="space-y-2">
              <Label htmlFor="missionId">Mission ID (read-only)</Label>
              <Input
                id="missionId"
                value={missionId}
                readOnly
                className="bg-muted font-mono text-sm"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Mission Name *</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="z.B. Brand in Werkstatt"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Beschreibung *</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Kurze Beschreibung des Szenarios"
                className="min-h-[80px]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Kategorie *</Label>
                <Input
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="z.B. Feuerwehr, Rettungsdienst"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="difficulty">Schwierigkeitsgrad</Label>
                <Select
                  value={difficulty}
                  onValueChange={(value) => setDifficulty(value as any)}
                >
                  <SelectTrigger id="difficulty">
                    <SelectValue placeholder="Wähle Schwierigkeit" />
                  </SelectTrigger>
                  <SelectContent>
                    {DIFFICULTY_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Caller Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2">Anruferinformation</h3>
            
            <div className="space-y-2">
              <Label htmlFor="callerGender">Anrufer Geschlecht</Label>
              <Select
                value={callerGender}
                onValueChange={(value) => setCallerGender(value as any)}
              >
                <SelectTrigger id="callerGender">
                  <SelectValue placeholder="Wähle Geschlecht" />
                </SelectTrigger>
                <SelectContent>
                  {GENDER_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Toys */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2">Einsatzfahrzeuge / Toyes</h3>
            
            <div className="space-y-2">
              <Label htmlFor="toys">Auswahl möglich</Label>
              <MultiSelect
                options={TOY_OPTIONS}
                selected={toys}
                onChange={setToys}
                placeholder="Fahrzeuge auswählen..."
              />
              <p className="text-xs text-muted-foreground">
                Ausgewählte Fahrzeuge werden für die Soundauswahl verwendet
              </p>
            </div>
          </div>

          {/* State Editor */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2">State Editor</h3>
            <p className="text-sm text-muted-foreground">
              Für jeden Status können Sounddateien konfiguriert werden
            </p>
            
            <div className="space-y-4">
              {STATE_CONFIG.map((state) => (
                <div key={state.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <Label className="font-semibold text-base">{state.label}</Label>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`state-${state.id}-in`}>Sound In</Label>
                      <Input
                        id={`state-${state.id}-in`}
                        value={states[state.id as keyof MissionStates]?.sound_in || ""}
                        onChange={(e) => handleStateChange(state.id as keyof MissionStates, "sound_in", e.target.value)}
                        placeholder="z.B. alarm.mp3"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor={`state-${state.id}-out`}>Sound Out</Label>
                      <Input
                        id={`state-${state.id}-out`}
                        value={states[state.id as keyof MissionStates]?.sound_out || ""}
                        onChange={(e) => handleStateChange(state.id as keyof MissionStates, "sound_out", e.target.value)}
                        placeholder="z.B. Einsatzende.mp3"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor={`state-${state.id}-floor`}>Sound Floor</Label>
                      <Input
                        id={`state-${state.id}-floor`}
                        value={states[state.id as keyof MissionStates]?.sound_floor || ""}
                        onChange={(e) => handleStateChange(state.id as keyof MissionStates, "sound_floor", e.target.value)}
                        placeholder="z.B. im Einsatz.mp3"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor={`state-${state.id}-sequence`}>Sound Sequence</Label>
                      <Input
                        id={`state-${state.id}-sequence`}
                        value={states[state.id as keyof MissionStates]?.sound_sequence || ""}
                        onChange={(e) => handleStateChange(state.id as keyof MissionStates, "sound_sequence", e.target.value)}
                        placeholder="z.B. sequence_1.mp3"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sound List */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2">Sounds ({sounds.length})</h3>
            
            <div className="border rounded-lg p-4">
              {sounds.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">
                  Noch keine Sounds konfiguriert
                </p>
              ) : (
                <div className="space-y-2">
                  {sounds.map((sound) => (
                    <div key={sound.id} className="flex items-center justify-between p-2 bg-muted/30 rounded">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm text-muted-foreground">{sound.id}</span>
                        <span>{sound.name}</span>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        sound.status === 'generated' ? 'bg-green-100 text-green-800' :
                        sound.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {sound.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
              
              <Button variant="outline" size="sm" className="mt-4">
                + Sound hinzufügen
              </Button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {error}
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={() => navigate("/")}>
              Abbrechen
            </Button>
            <Button onClick={handleSave}>
              Speichern
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
