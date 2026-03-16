import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function MissionEditor() {
  const [missionName, setMissionName] = useState("")
  const [description, setDescription] = useState("")

  return (
    <div className="container mx-auto py-8 max-w-2xl">
      <div className="mb-6">
        <h1 className="text-4xl font-bold tracking-tight">Mission Editor</h1>
        <p className="text-muted-foreground">Erstelle oder bearbeite eine Mission</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Mission Details</CardTitle>
          <CardDescription>Gib grundlegende Informationen zur Mission ein</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="missionName">Mission Name</Label>
            <Input
              id="missionName"
              value={missionName}
              onChange={(e) => setMissionName(e.target.value)}
              placeholder="z.B. Brand in Werkstatt"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Beschreibung</Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Kurze Beschreibung des Szenarios"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline">Cancel</Button>
            <Button>Save Mission</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
