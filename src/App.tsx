import { BrowserRouter, Routes, Route, Link } from "react-router-dom"
import Dashboard from "./pages/Dashboard"
import MissionEditor from "./pages/MissionEditor"
import SoundGenerator from "./pages/SoundGenerator"
import MissionCreator from "./pages/MissionCreator"
import SoundLibrary from "./pages/SoundLibrary"

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-background text-foreground">
        {/* Navigation */}
        <nav className="border-b">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <Link to="/" className="text-2xl font-bold">
                Mission Manager
              </Link>
              <div className="flex gap-4">
                <Link to="/" className="px-3 py-2 rounded-md hover:bg-accent">
                  Dashboard
                </Link>
                <Link to="/missions" className="px-3 py-2 rounded-md hover:bg-accent">
                  Missions
                </Link>
                <Link to="/sound-generator" className="px-3 py-2 rounded-md hover:bg-accent">
                  Sound Generator
                </Link>
                <Link to="/sound-library" className="px-3 py-2 rounded-md hover:bg-accent">
                  Sound Library
                </Link>
                <Link to="/ai-creator" className="px-3 py-2 rounded-md hover:bg-accent">
                  AI Creator
                </Link>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/missions" element={<MissionEditor />} />
            <Route path="/sound-generator" element={<SoundGenerator />} />
            <Route path="/sound-library" element={<SoundLibrary />} />
            <Route path="/ai-creator" element={<MissionCreator />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}
