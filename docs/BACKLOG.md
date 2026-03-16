# BACKLOG - Mission Manager Dashboard

## Features

### FEAT-001: Mission-Liste anzeigen (aus missions.yaml)
**Status**: 🟢 Done  
**Beschreibung**: Anzeige aller gespeicherten Missionen mit Filter und Suche  
**Abhängigkeiten**: FEAT-008  

### FEAT-002: Fehlende Sounds identifizieren
**Status**: 🟡 In Progress  
**Beschreibung**: Automatische Erkennung von fehlenden Sounds in Missionen  
**Abhängigkeiten**: FEAT-001  

### FEAT-003: ElevenLabs TTS Integration
**Status**: 🟢 Done  
**Beschreibung**: API-Integration für Text-to-Speech mit ElevenLabs  
**Abhängigkeiten**: None  

### FEAT-004: Sound-Generator UI
**Status**: 🟢 Done  
**Beschreibung**: Benutzeroberfläche für Sound-Generation mit Status-Anzeige  
**Abhängigkeiten**: FEAT-003  

### FEAT-005: KI-Mission-Creator (ollama)
**Status**: 🟢 Done  
**Beschreibung**: KI-gestützte Erstellung von Missionen via Ollama API  
**Abhängigkeiten**: None  

### FEAT-006: Mission-Editor
**Status**: 🟢 Done  
**Beschreibung**: Formular zur Bearbeitung von Missionen  
**Abhängigkeiten**: FEAT-001  

### FEAT-007: YAML Export/Import
**Status**: 🔴 To Do  
**Beschreibung**: Export/Import von Missionen als YAML-Dateien  
**Abhängigkeiten**: FEAT-001  

### FEAT-008: Dashboard-Layout mit shadcn
**Status**: 🟢 Done  
**Beschreibung**: Modernes Dashboard mit shadcn/ui Komponenten  
**Abhängigkeiten**: None  

## Bug Reports

### BUG-001: Tailwind CSS Konfiguration fehlt
**Status**: 🟢 Fixed  
**Beschreibung**: Tailwind Konfiguration wurde manuell erstellt  

## Tasks

### TASK-001: Projektstruktur initialisieren
**Status**: 🟢 Done  
**Beschreibung**: Vite + React + TypeScript Setup  

### TASK-002: shadcn/ui installieren
**Status**: 🟡 Manual Install  
**Beschreibung**: shadcn Komponenten manuell installiert  

### TASK-003: erste Komponenten erstellen
**Status**: 🟢 Done  
**Beschreibung**: Button, Card, Input, Label, Textarea  

## Notes

- ElevenLabs API Key erforderlich für TTS-Funktionalität
- Ollama Server muss lokal laufen für KI-Creator
- YAML-Format für Missionsdateien wird verwendet
