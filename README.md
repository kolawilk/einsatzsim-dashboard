# Dashboard Projekt: Mission Manager

## Ziel
Webapp zur Verwaltung und Erstellung von Einsatzsimulator-Missionen mit:
1. ElevenLabs TTS für fehlende Call-Sounds
2. KI-gestützte Mission-Erstellung (ollama/kimi-k2.5)
3. Modernes Dashboard mit shadcn/ui

## Setup

```bash
cd ~/team-share/projects/einsatzsim-dashboard
npm install
npm run dev
```

## Projekt-Struktur

```
einsatzsim-dashboard/
├── src/
│   ├── components/
│   │   └── ui/           # shadcn/ui components
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── input.tsx
│   │       ├── label.tsx
│   │       └── textarea.tsx
│   ├── pages/
│   │   ├── Dashboard.tsx
│   │   ├── MissionEditor.tsx
│   │   ├── SoundGenerator.tsx
│   │   └── MissionCreator.tsx
│   ├── hooks/
│   │   ├── useElevenLabs.ts
│   │   ├── useOllama.ts
│   │   └── useMissions.ts
│   ├── lib/
│   │   ├── elevenlabs.ts
│   │   ├── ollama.ts
│   │   ├── missions.ts
│   │   └── utils.ts
│   ├── types/
│   │   └── index.ts
│   ├── App.tsx
│   └── main.tsx
├── public/
├── docs/
│   └── BACKLOG.md
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
└── README.md
```

## Features (BACKLOG)

### FEAT-001: Mission-Liste anzeigen (aus missions.yaml)
- Anzeige aller gespeicherten Missionen
- Filter und Suche
- Pagination

### FEAT-002: Fehlende Sounds identifizieren
- Automatische Erkennung von fehlenden Sounds
- Liste aller pending/missing Sounds

### FEAT-003: ElevenLabs TTS Integration
- API-Integration für TTS
- Voice-Auswahl
- Sound-Download

### FEAT-004: Sound-Generator UI
- UI für Sound-Generation
- Batch-Generation
- Status-Anzeige

### FEAT-005: KI-Mission-Creator (ollama)
- Eingabefeld für Mission-Prompt
- KI-generierte Missionen
- YAML-Export

### FEAT-006: Mission-Editor
- Formular zur Bearbeitung von Missionen
- Sound-Zuweisung
- YAML-Export

### FEAT-007: YAML Export/Import
- Export von Missionen als YAML
- Import von YAML-Dateien

### FEAT-008: Dashboard-Layout mit shadcn
- Modernes Dashboard
- Karten-basierte UI
- Responsive Design

## Tech Stack

- **Framework**: React + TypeScript + Vite
- **UI**: shadcn/ui + Tailwind CSS
- **State**: React hooks + lokale State-Verwaltung
- **TTS**: ElevenLabs API
- **KI**: Ollama API

## Konfiguration

### ElevenLabs
```bash
export ELEVEN_LABS_API_KEY=your_api_key
```

### Ollama
```bash
export OLLAMA_BASE_URL=http://localhost:11434
```

## Entwicklung

```bash
npm run dev
npm run build
npm run preview
```
