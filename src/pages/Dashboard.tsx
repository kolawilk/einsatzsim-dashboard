import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function Dashboard() {
  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Mission Manager</h1>
          <p className="text-muted-foreground">Verwalte deine Einsatzsimulator-Missionen</p>
        </div>
        <Button>Create Mission</Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Active Missions</CardTitle>
            <CardDescription>Laufende Missionen</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">12</p>
            <p className="text-sm text-muted-foreground mt-1">2 this week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total Sounds</CardTitle>
            <CardDescription>Alle Sounds</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">156</p>
            <p className="text-sm text-muted-foreground mt-1">8 missing</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Missing Sounds</CardTitle>
            <CardDescription>Needs ElevenLabs TTS</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-red-500">8</p>
            <p className="text-sm text-muted-foreground mt-1">Ready to generate</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Missions</CardTitle>
          <CardDescription>Neueste Missionen</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h3 className="font-semibold">Mission {i}</h3>
                  <p className="text-sm text-muted-foreground">Created 2h ago</p>
                </div>
                <Button variant="outline" size="sm">Edit</Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
