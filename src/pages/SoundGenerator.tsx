import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import useFreesound from "@/hooks/useFreesound"

// Dummy-Daten für ElevenLabs Integration
interface MissingSound {
  id: number
  name: string
  status: "pending" | "generated"
}

export default function SoundGenerator() {
  const [missingSounds, setMissingSounds] = useState<MissingSound[]>([
    { id: 1, name: "Alarm 1", status: "pending" },
    { id: 2, name: "Meldung 3", status: "pending" },
    { id: 3, name: "Funk 5", status: "pending" },
  ])
  const [isGenerating, setIsGenerating] = useState(false)
  const [activeTab, setActiveTab] = useState<"elevenlabs" | "freesound">("elevenlabs")
  const [previewSoundId, setPreviewSoundId] = useState<string | null>(null)
  const [previewAudio, setPreviewAudio] = useState<HTMLAudioElement | null>(null)

  // Freesound Integration
  const freesoundConfig = {
    apiKey: import.meta.env.VITE_FREESOUND_API_KEY || "demo",
  }
  const {
    sounds,
    searchQuery,
    isLoading,
    error,
    setSearchQuery,
    searchSounds,
    previewSound,
    getTotalPages,
    setPage,
    currentPage,
  } = useFreesound(freesoundConfig)

  // Vordefinierte Demo-Sounds für die Suche
  const demoSearches = [
    { query: "fire alarm", category: "Alarm" },
    { query: "siren", category: "Warnung" },
    { query: "people talking", category: "Sprache" },
    { query: "car horn", category: "Verkehr" },
    { query: "water", category: "Natur" },
  ]

  const handleGenerateAll = () => {
    setIsGenerating(true)
    setTimeout(() => {
      setMissingSounds(missingSounds.map(s => ({ ...s, status: "generated" })))
      setIsGenerating(false)
    }, 2000)
  }

  const handleDemoSearch = async (query: string) => {
    setSearchQuery(query)
    await searchSounds(query, 1)
  }

  const handlePreview = async (soundId: string) => {
    if (previewSoundId === soundId && previewAudio) {
      previewAudio.pause()
      previewAudio.currentTime = 0
      setPreviewSoundId(null)
      return
    }

    setPreviewSoundId(soundId)
    
    // Dummy-Audio für Demo-Zwecke (da wir keine echte Freesound API Key haben)
    const audio = new Audio()
    audio.src = "data:audio/mp3;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YU"
    audio.play().catch(() => {
      console.log("Audio preview (demo mode - no real audio)")
    })
    setPreviewAudio(audio)

    // Wenn API Key gesetzt ist, echtes Preview abrufen
    if (import.meta.env.VITE_FREESOUND_API_KEY) {
      try {
        const url = await previewSound(soundId)
        audio.src = url
        audio.play()
      } catch (err) {
        console.error("Failed to play preview:", err)
      }
    }
  }

  useEffect(() => {
    return () => {
      if (previewAudio) {
        previewAudio.pause()
      }
    }
  }, [])

  return (
    <div className="container mx-auto py-8 max-w-6xl">
      <div className="mb-6">
        <h1 className="text-4xl font-bold tracking-tight">Sound Generator</h1>
        <p className="text-muted-foreground">Sound-Suche &amp; Generierung</p>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-2 mb-6">
        <Button
          variant={activeTab === "elevenlabs" ? "default" : "outline"}
          onClick={() => setActiveTab("elevenlabs")}
        >
          ElevenLabs TTS
        </Button>
        <Button
          variant={activeTab === "freesound" ? "default" : "outline"}
          onClick={() => setActiveTab("freesound")}
        >
          Freesound.org
        </Button>
      </div>

      {activeTab === "elevenlabs" && (
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
      )}

      {activeTab === "freesound" && (
        <Card>
          <CardHeader>
            <CardTitle>Freesound.org Suche</CardTitle>
            <CardDescription>Suche kostenlose Sounds für deine Einsätze</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Demo Search Buttons */}
            <div className="mb-6">
              <p className="text-sm text-muted-foreground mb-2">Demo-Suchen:</p>
              <div className="flex flex-wrap gap-2">
                {demoSearches.map((search, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => handleDemoSearch(search.query)}
                  >
                    {search.category}: {search.query}
                  </Button>
                ))}
              </div>
            </div>

            {/* Search Input */}
            <div className="mb-6">
              <Input
                type="text"
                placeholder="Suche Sounds (z.B. 'siren', 'alarm', 'fire')..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && searchQuery) {
                    searchSounds(searchQuery, 1)
                  }
                }}
                disabled={isLoading}
                className="max-w-lg"
              />
              <Button
                onClick={() => searchSounds(searchQuery, 1)}
                disabled={isLoading || !searchQuery}
                className="ml-2"
              >
                {isLoading ? "Suche..." : "Suchen"}
              </Button>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
                {error}
              </div>
            )}

            {/* Search Results */}
            <div className="space-y-3">
              <h3 className="font-semibold">
                Ergebnisse ({sounds.length})
                {isLoading && " - Laden..."}
              </h3>

              {sounds.length === 0 && !isLoading && !error && (
                <p className="text-muted-foreground">
                  Noch keine Ergebnisse. Versuche eine der Demo-Suchen oder such selbst.
                </p>
              )}

              {sounds.map((sound) => (
                <div
                  key={sound.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:border-primary transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold">{sound.name}</h3>
                      <Badge variant="secondary">{(sound.duration / 60).toFixed(1)} min</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">{sound.description}</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {sound.tags.slice(0, 5).map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      von {sound.username} • {sound.license}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <Button
                      size="sm"
                      onClick={() => handlePreview(sound.id.toString())}
                      disabled={isLoading}
                    >
                      {previewSoundId === sound.id.toString() ? "Stop" : "Preview"}
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {getTotalPages() > 1 && (
              <div className="mt-6 flex items-center justify-center gap-2">
                <Button
                  size="sm"
                  onClick={() => setPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                >
                  Zurück
                </Button>
                <span className="text-sm text-muted-foreground">
                  Seite {currentPage} von {getTotalPages()}
                </span>
                <Button
                  size="sm"
                  onClick={() => setPage(Math.min(getTotalPages(), currentPage + 1))}
                  disabled={currentPage === getTotalPages()}
                >
                  Weiter
                </Button>
              </div>
            )}

            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                <strong>Hinweis:</strong> Um volle Freesound API Funktionalität zu nutzen, füge
                <code className="mx-1 bg-yellow-200 px-1 rounded">VITE_FREESOUND_API_KEY</code>
                zu deiner <code className="mx-1 bg-yellow-200 px-1 rounded">.env.local</code> Datei hinzu.
                Ohne API Key werden keine echten Sounds geladen.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
