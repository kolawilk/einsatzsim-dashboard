# BACKLOG - Mission Manager Dashboard

## Features (Priorisiert)

### FEAT-001: Mission-Liste anzeigen (aus missions.yaml)
**Status**: 🟡 In Progress  
**Beschreibung**: Anzeige aller gespeicherten Missionen mit Filter und Suche  
**Abhängigkeiten**: None  
**Assignee**: dashboard-feat-001

### FEAT-002: Fehlende Sounds identifizieren
**Status**: 🔴 To Do  
**Beschreibung**: Automatische Erkennung von fehlenden Sounds in Missionen  
**Abhängigkeiten**: FEAT-001  

### FEAT-003: ElevenLabs TTS Integration
**Status**: 🔴 To Do  
**Beschreibung**: API-Integration für Text-to-Speech mit ElevenLabs  
**Details**:
- Multilingual Modell verwenden
- Geschlecht-Auswahl: männlich/weiblich/egal
- Bei "egal": Zufällige passende Stimme auswählen
- Voice-Preview vor Generierung
- **Gender-Feld in YAML**: `caller_gender: "male" | "female" | "any"`
**Abhängigkeiten**: None  

### FEAT-004: Sound-Generator UI
**Status**: 🔴 To Do  
**Beschreibung**: Benutzeroberfläche für Sound-Generation mit Status-Anzeige  
**Abhängigkeiten**: FEAT-003  

### FEAT-005: KI-Mission-Creator (ollama)
**Status**: 🔴 To Do  
**Beschreibung**: KI-gestützte Erstellung von Missionen via Ollama API  
**Details**:
- Stichpunkte eingeben → KI generiert Titel, Anrufertext, Sounds
- KI schlägt passende Sounds vor
- Direkt editierbar im Dashboard
**Abhängigkeiten**: None  

### FEAT-006: Mission-Editor
**Status**: 🔴 To Do  
**Beschreibung**: Formular zur Bearbeitung von Missionen  
**Details**:
- Alle Felder editierbar: id, name, description, difficulty, toys, states
- **Gender-Auswahl für Anruf**: männlich/weiblich/egal
- State-Editor mit Sound-Auswahl
- Live-Preview von Anrufertexten
**Abhängigkeiten**: FEAT-001  

### FEAT-007: YAML Export/Import
**Status**: 🔴 To Do  
**Beschreibung**: Export/Import von Missionen als YAML-Dateien  
**Abhängigkeiten**: FEAT-001  

### FEAT-008: Dashboard-Layout mit shadcn
**Status**: 🟢 Done  
**Beschreibung**: Modernes Dashboard mit shadcn/ui Komponenten  
**Abhängigkeiten**: None  

### FEAT-009: Freesound.org Integration
**Status**: 🔴 To Do  
**Beschreibung**: Automatische Sound-Suche bei freesound.org  
**Details**:
- KI schlägt Sounds vor (aus FEAT-005)
- Prüfung ob Sound lokal vorhanden
- Falls nicht: Anfrage an freesound.org
- Im Dashboard anhören und auswählen
- Download und Speicherung
**Abhängigkeiten**: FEAT-005  

### FEAT-010: Neue ID-Struktur für Missionen
**Status**: 🔴 To Do  
**Beschreibung**: Numerische IDs statt Einsatzstichwort-basiert  
**Details**:
- Migration bestehender Missionen
- Neue Missionen bekommen auto-increment IDs
- Einsatzstichwort wird separates Feld
**Abhängigkeiten**: FEAT-001  

### FEAT-011: Einsatzstichwort-Verwaltung
**Status**: 🔴 To Do  
**Beschreibung**: YAML-basierte Stichwort-Liste mit Types  
**Details**:
- Stichworte aus Liste wählen
- Types: Feuerwehr, Rettungsdienst, THL, etc.
- Stichwort bestimmt alerting Sound
- Felder: id, name, type, default_alerting_sound
**Abhängigkeiten**: FEAT-010  

### FEAT-013: Sound-Editor / Arrangement Konfigurator
**Status**: 🔴 To Do  
**Beschreibung**: Visueller Editor für Sound-Arrangements pro State  
**Details**:
- Drag & Drop Interface für Sounds
- Sound-Typen: sound_in, sound_out, sound_floor, sound_sequence, random_sounds
- Sequenz-Editor (Reihenfolge festlegen)
- Volume/Pitch Einstellungen pro Sound
- Random Sound Konfiguration (probability, interval)
- Preview-Funktion für Arrangements
- Sound-Bibliothek mit allen verfügbaren Sounds
**Abhängigkeiten**: FEAT-006  

### FEAT-014: Sound-Bibliothek Verwaltung
**Status**: 🔴 To Do  
**Beschreibung**: Verwaltung aller Sound-Dateien im Dashboard  
**Details**:
- Übersicht aller Sounds (alarm/, effects/, calls/)
- Upload neuer Sounds
- Löschen von Sounds
- Vorschau/Abspielen
- Metadaten: Kategorie, Dauer, Tags
**Abhängigkeiten**: None  

## Bug Reports

*Keine offenen Bugs*

## Tasks

### TASK-001: Projektstruktur initialisieren
**Status**: 🟢 Done  
**Beschreibung**: Vite + React + TypeScript Setup  

### TASK-002: shadcn/ui installieren
**Status**: 🟢 Done  
**Beschreibung**: shadcn Komponenten installiert  

### TASK-003: GitHub Repo erstellen
**Status**: 🔴 To Do  
**Beschreibung**: Repo `kolawilk/einsatzsim-dashboard` anlegen  
**Assignee**: Lars

## Notes

- ElevenLabs API Key erforderlich für TTS-Funktionalität
- Ollama Server muss lokal laufen für KI-Creator
- Freesound.org API Key für Sound-Suche
- YAML-Format für Missionsdateien wird verwendet
