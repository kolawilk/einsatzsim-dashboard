# Einsatzsim Dashboard

Mission Manager für den Einsatzsimulator - Verwaltung, Erstellung und Bearbeitung von Feuerwehr-Missionen für Kinder.

## Features

| Feature | Status | Beschreibung |
|---------|--------|--------------|
| FEAT-001 | ✅ | Mission-Liste mit Filter und Suche |
| FEAT-002 | ✅ | Fehlende Sounds automatisch identifizieren |
| FEAT-003 | ✅ | ElevenLabs TTS Integration |
| FEAT-004 | ✅ | Sound-Generator UI |
| FEAT-005 | ✅ | KI-Mission-Creator (Ollama) |
| FEAT-006 | ✅ | Mission-Editor mit allen Feldern |
| FEAT-007 | ✅ | YAML Export/Import |
| FEAT-008 | ✅ | Modernes Dashboard (shadcn/ui) |
| FEAT-009 | ✅ | Freesound.org Integration |
| FEAT-010 | ✅ | Numerische Mission-IDs |
| FEAT-011 | ✅ | Einsatzstichwort-Verwaltung |
| FEAT-012 | ✅ | Mission-Tags |
| FEAT-013 | ✅ | Sound-Arranger (Drag & Drop) |
| FEAT-014 | ✅ | Sound-Bibliothek mit Upload |

## Quick Start

```bash
# Repository klonen
git clone https://github.com/kolawilk/einsatzsim-dashboard.git
cd einsatzsim-dashboard

# Dependencies installieren
npm install

# Development Server starten
npm run dev

# Öffne http://localhost:5173
```

## Konfiguration

### 1. ElevenLabs API Key (für TTS)

```bash
# .env.local erstellen
echo "VITE_ELEVENLABS_API_KEY=your_api_key_here" > .env.local
```

API Key bei [ElevenLabs](https://elevenlabs.io) erstellen.

### 2. Freesound API Key (optional)

```bash
# .env.local ergänzen
echo "VITE_FREESOUND_API_KEY=your_freesound_key" >> .env.local
```

API Key bei [Freesound](https://freesound.org/apiv2/apply/) beantragen.

### 3. Ollama Server (für KI-Missionen)

```bash
# Ollama installieren
curl -fsSL https://ollama.com/install.sh | sh

# Modell herunterladen
ollama pull kimi-k2.5

# Server starten (läuft auf Port 11434)
ollama serve
```

## Projekt-Struktur

```
einsatzsim-dashboard/
├── src/
│   ├── components/
│   │   ├── ui/              # shadcn/ui Komponenten
│   │   ├── TagInput.tsx     # Tag-Eingabe
│   │   └── SoundArranger.tsx # Sound-Editor
│   ├── pages/
│   │   ├── Dashboard.tsx    # Hauptübersicht
│   │   ├── MissionEditor.tsx # Mission bearbeiten
│   │   ├── SoundGenerator.tsx # TTS + Freesound
│   │   ├── MissionCreator.tsx # KI-Missionen
│   │   └── SoundLibrary.tsx  # Sound-Verwaltung
│   ├── hooks/
│   │   ├── useElevenLabs.ts # ElevenLabs API
│   │   ├── useFreesound.ts  # Freesound API
│   │   ├── useOllama.ts     # Ollama API
│   │   └── useMissions.ts   # Mission State
│   ├── lib/
│   │   ├── elevenlabs.ts    # ElevenLabs Service
│   │   ├── freesound.ts     # Freesound Service
│   │   ├── ollama.ts        # Ollama Service
│   │   ├── keywords.ts      # Stichwort-Verwaltung
│   │   ├── idGenerator.ts   # ID Generator
│   │   ├── yamlExport.ts    # YAML Export
│   │   └── yamlImport.ts    # YAML Import
│   └── types/
│       └── index.ts         # TypeScript Typen
├── public/
│   └── keywords.yaml        # Einsatzstichworte
├── docs/
│   ├── BACKLOG.md           # Feature-Backlog
│   └── TEST_REPORT.md       # Test-Report
└── package.json
```

## Nutzung

### Dashboard
- Übersicht aller Missionen
- Filter nach Tags und Kategorien
- Schnellzugriff auf Editoren

### Mission erstellen (KI)
1. "AI Creator" öffnen
2. Stichpunkte eingeben (z.B. "Brand in Lagerhalle")
3. "Mission generieren" klicken
4. Vorschlag bearbeiten
5. Speichern

### Sounds generieren
1. "Sound Generator" öffnen
2. Tab "ElevenLabs TTS" wählen
3. Text eingeben
4. Stimme wählen (männlich/weiblich)
5. "Generieren" klicken

### Oder Freesound durchsuchen:
1. Tab "Freesound.org" wählen
2. Suchbegriff eingeben
3. Sounds durchhören
4. Passenden auswählen

### Mission bearbeiten
1. "Missions" öffnen
2. Mission auswählen
3. Felder bearbeiten:
   - Name, Beschreibung
   - Schwierigkeit
   - Einsatzstichwort
   - Tags
   - Sounds pro State
4. "Speichern" klicken

### Sound-Bibliothek
1. "Sound Library" öffnen
2. Sounds per Drag & Drop hochladen
3. Kategorien zuweisen
4. Metadaten bearbeiten

## Tech Stack

- **Framework**: React 19 + TypeScript 5
- **Build**: Vite 6
- **UI**: shadcn/ui + Tailwind CSS 4
- **Routing**: React Router 7
- **State**: React Hooks + Zustand
- **TTS**: ElevenLabs API
- **KI**: Ollama (lokales LLM)
- **Sounds**: Freesound.org API

## Scripts

```bash
npm run dev      # Development Server
npm run build    # Production Build
npm run preview  # Build testen
npm run lint     # ESLint
```

## Deployment

```bash
# Build erstellen
npm run build

# Statische Dateien in dist/
# Auf beliebigem Webserver hosten
```

## Mitmachen

1. Fork erstellen
2. Feature-Branch: `git checkout -b feature/amazing-feature`
3. Committen: `git commit -m 'feat: add amazing feature'`
4. Pushen: `git push origin feature/amazing-feature`
5. Pull Request öffnen

## Lizenz

MIT License - siehe [LICENSE](LICENSE)

## Autor

Lars Wilke (@larskrachen)

---

**Built with ❤️ for little firefighters 🚒**
