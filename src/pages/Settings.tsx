import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle, CheckCircle, RefreshCw } from 'lucide-react';
import { saveApiKeys, getApiKeys, maskApiKey } from '@/lib/apiKeys';
import ElevenLabsService from '@/lib/elevenlabs';
import FreesoundService from '@/lib/freesound';
import { OllamaService } from '@/lib/ollama';

export default function Settings() {
  const [apiKeys, setApiKeys] = useState({
    elevenLabs: '',
    freesound: '',
    ollamaUrl: 'http://localhost:11434'
  });
  const [savedKeys, setSavedKeys] = useState({
    elevenLabs: false,
    freesound: false,
    ollamaUrl: false
  });
  const [testResults, setTestResults] = useState<{
    elevenLabs?: { success: boolean; message: string };
    freesound?: { success: boolean; message: string };
    ollama?: { success: boolean; message: string };
  }>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const keys = getApiKeys();
    setApiKeys({
      elevenLabs: keys.elevenLabs || '',
      freesound: keys.freesound || '',
      ollamaUrl: keys.ollamaUrl || 'http://localhost:11434'
    });
  }, []);

  const handleInputChange = (field: keyof typeof apiKeys, value: string) => {
    setApiKeys(prev => ({ ...prev, [field]: value }));
    // Reset saved status when user types
    setSavedKeys(prev => ({ ...prev, [field]: false }));
  };

  const handleSave = () => {
    try {
      saveApiKeys({
        elevenLabs: apiKeys.elevenLabs.trim() || undefined,
        freesound: apiKeys.freesound.trim() || undefined,
        ollamaUrl: apiKeys.ollamaUrl.trim() || 'http://localhost:11434'
      });
      setSavedKeys({
        elevenLabs: true,
        freesound: true,
        ollamaUrl: true
      });
      setTestResults({});
    } catch (error) {
      console.error('Failed to save API keys:', error);
    }
  };

  const testElevenLabs = async () => {
    if (!apiKeys.elevenLabs) {
      setTestResults(prev => ({
        ...prev,
        elevenLabs: { success: false, message: 'API Key fehlt' }
      }));
      return;
    }

    setLoading(true);
    const service = new ElevenLabsService({ apiKey: apiKeys.elevenLabs });
    
    try {
      const voices = await service.getVoices();
      setTestResults(prev => ({
        ...prev,
        elevenLabs: { 
          success: true, 
          message: voices.length > 0 
            ? `${voices.length} Stimmen verfügbar` 
            : 'Keine Stimmen gefunden' 
        }
      }));
    } catch (error) {
      setTestResults(prev => ({
        ...prev,
        elevenLabs: { success: false, message: 'ungültiger API Key' }
      }));
    } finally {
      setLoading(false);
    }
  };

  const testFreesound = async () => {
    if (!apiKeys.freesound) {
      setTestResults(prev => ({
        ...prev,
        freesound: { success: false, message: 'API Key fehlt' }
      }));
      return;
    }

    setLoading(true);
    const service = new FreesoundService({ apiKey: apiKeys.freesound });
    
    try {
      const result = await service.searchSounds('fire', 1, 1);
      setTestResults(prev => ({
        ...prev,
        freesound: { 
          success: true, 
          message: result.count > 0 
            ? `${result.count} Sounds gefunden` 
            : 'Keine Sounds gefunden' 
        }
      }));
    } catch (error) {
      setTestResults(prev => ({
        ...prev,
        freesound: { success: false, message: 'ungültiger API Key' }
      }));
    } finally {
      setLoading(false);
    }
  };

  const testOllama = async () => {
    if (!apiKeys.ollamaUrl) {
      setTestResults(prev => ({
        ...prev,
        ollama: { success: false, message: 'URL fehlt' }
      }));
      return;
    }

    setLoading(true);
    const service = new OllamaService();
    
    try {
      // Test with a simple prompt
      await service.generateMissionFromPrompt('Test Mission');
      setTestResults(prev => ({
        ...prev,
        ollama: { success: true, message: 'Verbindung erfolgreich' }
      }));
    } catch (error) {
      setTestResults(prev => ({
        ...prev,
        ollama: { success: false, message: 'Verbindung fehlgeschlagen' }
      }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">API Einstellungen</h1>
        <p className="text-muted-foreground mt-2">
          Konfigurieren Sie Ihre API-Schlüssel für die externen Dienste
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Dienste</CardTitle>
          <CardDescription>
            Verwalten Sie Ihre API-Schlüssel für die Integration externer Dienste
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          
          {/* ElevenLabs Section */}
          <div className="space-y-4 p-4 rounded-lg border">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="elevenLabs" className="font-semibold">ElevenLabs API Key</Label>
                <p className="text-sm text-muted-foreground">
                  Für Text-to-Speech Funktionen
                </p>
              </div>
              {testResults.elevenLabs && (
                <div className={`flex items-center gap-2 text-sm ${testResults.elevenLabs.success ? 'text-green-600' : 'text-red-600'}`}>
                  {testResults.elevenLabs.success ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                  {testResults.elevenLabs.message}
                </div>
              )}
            </div>
            
            <div className="flex gap-2">
              <Input
                id="elevenLabs"
                type="password"
                value={apiKeys.elevenLabs}
                onChange={(e) => handleInputChange('elevenLabs', e.target.value)}
                placeholder="sk-..."
                className="flex-1"
              />
              <Button 
                onClick={testElevenLabs} 
                disabled={loading}
                variant="secondary"
              >
                {loading && <RefreshCw className="w-4 h-4 mr-2 animate-spin" />}
                Testen
              </Button>
            </div>
            {apiKeys.elevenLabs && (
              <p className="text-xs text-muted-foreground">
                Aktueller Key: {maskApiKey(apiKeys.elevenLabs)}
              </p>
            )}
          </div>

          {/* Freesound Section */}
          <div className="space-y-4 p-4 rounded-lg border">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="freesound" className="font-semibold">Freesound API Key</Label>
                <p className="text-sm text-muted-foreground">
                  Für Sound-Suche und -Integration
                </p>
              </div>
              {testResults.freesound && (
                <div className={`flex items-center gap-2 text-sm ${testResults.freesound.success ? 'text-green-600' : 'text-red-600'}`}>
                  {testResults.freesound.success ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                  {testResults.freesound.message}
                </div>
              )}
            </div>
            
            <div className="flex gap-2">
              <Input
                id="freesound"
                type="password"
                value={apiKeys.freesound}
                onChange={(e) => handleInputChange('freesound', e.target.value)}
                placeholder="freesound-api-key"
                className="flex-1"
              />
              <Button 
                onClick={testFreesound} 
                disabled={loading}
                variant="secondary"
              >
                {loading && <RefreshCw className="w-4 h-4 mr-2 animate-spin" />}
                Testen
              </Button>
            </div>
            {apiKeys.freesound && (
              <p className="text-xs text-muted-foreground">
                Aktueller Key: {maskApiKey(apiKeys.freesound)}
              </p>
            )}
          </div>

          {/* Ollama Section */}
          <div className="space-y-4 p-4 rounded-lg border">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="ollamaUrl" className="font-semibold">Ollama URL</Label>
                <p className="text-sm text-muted-foreground">
                  Für KI-generierte Missionen
                </p>
              </div>
              {testResults.ollama && (
                <div className={`flex items-center gap-2 text-sm ${testResults.ollama.success ? 'text-green-600' : 'text-red-600'}`}>
                  {testResults.ollama.success ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                  {testResults.ollama.message}
                </div>
              )}
            </div>
            
            <div className="flex gap-2">
              <Input
                id="ollamaUrl"
                type="text"
                value={apiKeys.ollamaUrl}
                onChange={(e) => handleInputChange('ollamaUrl', e.target.value)}
                placeholder="http://localhost:11434"
                className="flex-1"
              />
              <Button 
                onClick={testOllama} 
                disabled={loading}
                variant="secondary"
              >
                {loading && <RefreshCw className="w-4 h-4 mr-2 animate-spin" />}
                Testen
              </Button>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end pt-4 border-t">
            <Button onClick={handleSave} className="gap-2">
              {savedKeys.elevenLabs && savedKeys.freesound && savedKeys.ollamaUrl ? (
                <CheckCircle className="w-4 h-4" />
              ) : (
                <RefreshCw className="w-4 h-4" />
              )}
              {savedKeys.elevenLabs && savedKeys.freesound && savedKeys.ollamaUrl 
                ? 'Gespeichert' 
                : 'Speichern'}
            </Button>
          </div>

        </CardContent>
      </Card>
    </div>
  );
}
