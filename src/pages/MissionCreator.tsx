import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { useOllama } from "@/hooks/useOllama"
import type { GeneratedMission } from "@/lib/ollama"

export default function MissionCreator() {
  const [prompt, setPrompt] = useState("")
  const [generatedMission, setGeneratedMission] = useState<GeneratedMission | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const { isLoading, error, generateMission } = useOllama()

  const handleGenerateMission = async () => {
    if (!prompt.trim()) return
    
    const mission = await generateMission(prompt)
    if (mission) {
      setGeneratedMission(mission)
      setIsEditing(true)
    }
  }

  const handleSaveMission = () => {
    if (generatedMission) {
      console.log("Gespeicherte Mission:", generatedMission)
      // Hier könnte die Mission in die Datenbank gespeichert werden
      alert("Mission gespeichert!")
      setIsEditing(false)
    }
  }

  const handleFieldChange = (field: keyof GeneratedMission, value: string | string[]) => {
    if (!generatedMission) return
    
    setGeneratedMission(prev => {
      if (!prev) return null
      return { ...prev, [field]: value }
    })
  }

  return (
    <div className="container mx-auto py-8 max-w-3xl">
      <div className="mb-6">
        <h1 className="text-4xl font-bold tracking-tight">KI Mission Creator</h1>
        <p className="text-muted-foreground">Erstelle Missionen mit KI (Ollama)</p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>AI Prompt</CardTitle>
          <CardDescription>Beschreibe dein Szenario für die KI</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="prompt">Prompt</Label>
            <Textarea
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="z.B. 'Großbrand in einem Lagerhaus mit mehreren betroffenen Fahrzeugen und eingeklemmten Personen'"
              className="min-h-[100px]"
            />
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {error}
            </div>
          )}

          <Button onClick={handleGenerateMission} disabled={isLoading}>
            {isLoading ? "Generating..." : "Generate Mission"}
          </Button>
        </CardContent>
      </Card>

      {generatedMission && (
        <Card>
          <CardHeader>
            <CardTitle>{isEditing ? "Editiere Mission" : "Generierte Mission"}</CardTitle>
            <CardDescription>
              {isEditing 
                ? "Passe die KI-Vorschläge an und speichere deine Mission" 
                : "KI hat die Mission generiert. Klicke auf 'Editieren' zum Anpassen."}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {!isEditing ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Titel</Label>
                  <Input 
                    value={generatedMission.title} 
                    readOnly 
                    className="bg-muted"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Beschreibung</Label>
                  <div className="bg-muted p-4 rounded-lg min-h-[80px]">
                    {generatedMission.description}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Anrufertext</Label>
                  <div className="bg-muted p-4 rounded-lg min-h-[60px]">
                    {generatedMission.caller_text}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Vorgeschlagene Sounds</Label>
                  <div className="bg-muted p-3 rounded-lg flex flex-wrap gap-2">
                    {generatedMission.suggested_sounds.map((sound, index) => (
                      <span key={index} className="px-2 py-1 bg-background border rounded text-sm">
                        {sound}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Schwierigkeitsgrad</Label>
                  <Input 
                    value={generatedMission.difficulty} 
                    readOnly 
                    className="bg-muted capitalize"
                  />
                </div>
                <div className="flex justify-end gap-2 mt-4">
                  <Button onClick={() => setIsEditing(true)}>
                    Editieren
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Titel</Label>
                  <Input
                    id="title"
                    value={generatedMission.title}
                    onChange={(e) => handleFieldChange("title", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Beschreibung</Label>
                  <Textarea
                    id="description"
                    value={generatedMission.description}
                    onChange={(e) => handleFieldChange("description", e.target.value)}
                    className="min-h-[100px]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="caller_text">Anrufertext</Label>
                  <Textarea
                    id="caller_text"
                    value={generatedMission.caller_text}
                    onChange={(e) => handleFieldChange("caller_text", e.target.value)}
                    className="min-h-[80px]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="suggested_sounds">Vorgeschlagene Sounds (durch Komma getrennt)</Label>
                  <Input
                    id="suggested_sounds"
                    value={generatedMission.suggested_sounds.join(", ")}
                    onChange={(e) => handleFieldChange("suggested_sounds", e.target.value.split(",").map(s => s.trim()))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="difficulty">Schwierigkeitsgrad</Label>
                  <select
                    id="difficulty"
                    value={generatedMission.difficulty}
                    onChange={(e) => handleFieldChange("difficulty", e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="easy">easy</option>
                    <option value="medium">medium</option>
                    <option value="hard">hard</option>
                  </select>
                </div>
                <div className="flex justify-end gap-2 mt-4">
                  <Button variant="outline" onClick={() => setIsEditing(false)}>
                    Abbrechen
                  </Button>
                  <Button onClick={handleSaveMission}>
                    Speichern
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
