import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function SoundGenerator() {
  const [missingSounds, setMissingSounds] = useState([
    { id: 1, name: "Alarm 1", status: "pending" },
    { id: 2, name: "Meldung 3", status: "pending" },
    { id: 3, name: "Funk 5", status: "pending" },
  ])
  const [isGenerating, setIsGenerating] = useState(false)

  const handleGenerateAll = () => {
    setIsGenerating(true)
    setTimeout(() => {
      setMissingSounds(missingSounds.map(s => ({ ...s, status: "generated" })))
      setIsGenerating(false)
    }, 2000)
  }

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-4xl font-bold tracking-tight">Sound Generator</h1>
        <p className="text-muted-foreground">ElevenLabs TTS Integration</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Missing Sounds</CardTitle>
          <CardDescription>{missingSounds.filter(s => s.status === "pending").length} Sounds benötigen ElevenLabs TTS</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 mb-6">
            {missingSounds.map((sound) => (
              <div key={sound.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h3 className="font-semibold">{sound.name}</h3>
                  <p className={`text-sm ${
                    sound.status === "pending" ? "text-yellow-600" : "text-green-600"
                  }`}>
                    {sound.status === "pending" ? "Pending" : "Generated"}
                  </p>
                </div>
                <Button size="sm">Generate</Button>
              </div>
            ))}
          </div>

          <Button onClick={handleGenerateAll} disabled={isGenerating}>
            {isGenerating ? "Generating..." : "Generate All Sounds"}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
