import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { useOllama } from "@/hooks/useOllama"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function MissionCreator() {
  const [prompt, setPrompt] = useState("")
  const [editedMission, setEditedMission] = useState<any>(null)
  const { generate, isLoading, error, generatedMission, reset } = useOllama()

  const handleGenerate = async () => {
    const mission = await generate(prompt)
    if (mission) {
      setEditedMission(mission)
    }
  }

  const handleEdit = (field: string, value: string) => {
    setEditedMission({ ...editedMission, [field]: value })
  }

  const handleSave = () => {
    // TODO: Save to YAML
    console.log("Saving mission:", editedMission)
    alert("Mission saved! (Console log)")
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
            <Label htmlFor="prompt">Stichpunkte</Label>
            <Textarea
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="z.B. 'Großbrand in einem Lagerhaus mit mehreren betroffenen Fahrzeugen'"
              className="min-h-[100px]"
            />
          </div>

          <Button onClick={handleGenerate} disabled={isLoading || !prompt}>
            {isLoading ? "Generiere..." : "Mission generieren"}
          </Button>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {editedMission && (
        <Card>
          <CardHeader>
            <CardTitle>Generierte Mission (editierbar)</CardTitle>
            <CardDescription>Alle Felder können bearbeitet werden</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Titel</Label>
              <Input
                value={editedMission.title}
                onChange={(e) => handleEdit("title", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Beschreibung</Label>
              <Textarea
                value={editedMission.description}
                onChange={(e) => handleEdit("description", e.target.value)}
                className="min-h-[80px]"
              />
            </div>

            <div className="space-y-2">
              <Label>Anrufertext</Label>
              <Textarea
                value={editedMission.caller_text}
                onChange={(e) => handleEdit("caller_text", e.target.value)}
                className="min-h-[80px]"
              />
            </div>

            <div className="space-y-2">
              <Label>Schwierigkeit</Label>
              <select
                value={editedMission.difficulty}
                onChange={(e) => handleEdit("difficulty", e.target.value)}
                className="w-full p-2 border rounded"
              >
                <option value="easy">Einfach</option>
                <option value="medium">Mittel</option>
                <option value="hard">Schwer</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label>Vorgeschlagene Sounds</Label>
              <Input
                value={editedMission.suggested_sounds?.join(", ")}
                onChange={(e) => handleEdit("suggested_sounds", e.target.value.split(", "))}
                placeholder="Komma-getrennt"
              />
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={reset}>Zurücksetzen</Button>
              <Button onClick={handleSave}>Mission speichern</Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
