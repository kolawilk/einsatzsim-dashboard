import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

export default function MissionCreator() {
  const [prompt, setPrompt] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [generatedMission, setGeneratedMission] = useState<string | null>(null)

  const handleGenerateMission = () => {
    setIsLoading(true)
    // Simuliere KI-generierte Mission
    setTimeout(() => {
      setGeneratedMission(`
# Mission: Waldbrand an der Autobahn

## Szenario
Es ist ein großer Waldbrand an der Autobahn ausgebrochen. Die Flammen greifen auf mehrere Hektar um sich. Mehrere Fahrzeuge stehen in der Gefahr, vom Feuer eingeholt zu werden.

## Einsatzkräfte
- LF 20: 12 Mann
- DLK 23: 3 Mann
- RW: 6 Mann
- Einsatzleitung: 2 Mann

## Abarbeitung
1. Aufbau einer Wassertransportleitung
2. Rettung der Fahrzeuge
3. Flugsicherung einschalten
5. Bekämpfung des Brandes von beiden Seiten

## Ausrüstung
- Atemschutzgeräte
- Schaummittel
- Leitungen 40mm
- Strömungsrohre
`)
      setIsLoading(false)
    }, 2500)
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

          <Button onClick={handleGenerateMission} disabled={isLoading}>
            {isLoading ? "Generating..." : "Generate Mission"}
          </Button>
        </CardContent>
      </Card>

      {generatedMission && (
        <Card>
          <CardHeader>
            <CardTitle>Generated Mission</CardTitle>
            <CardDescription>KI generierte Mission</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-muted p-4 rounded-lg font-mono text-sm whitespace-pre-wrap">
              {generatedMission}
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline">Copy</Button>
              <Button>Edit</Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
