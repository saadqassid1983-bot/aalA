import React, { useState } from 'react';
import { ComedyScript } from './types/comedy';
import { DEFAULT_COMEDY_SCRIPTS } from './data/defaultScripts';
import { VideoPlayerStage } from './components/VideoPlayerStage';
import { ScriptEditor } from './components/ScriptEditor';
import { TeleprompterView } from './components/TeleprompterView';
import { SoundboardBar } from './components/SoundboardBar';
import { GeneratorModal } from './components/GeneratorModal';
import { VideoRecorderModal } from './components/VideoRecorderModal';
import {
  Clapperboard,
  Sparkles,
  Film,
  FileText,
  Mic,
  Sliders,
  Download,
  Share2,
  Laugh,
  PlusCircle,
  HelpCircle,
} from 'lucide-react';

export default function App() {
  const [scriptsList, setScriptsList] = useState<ComedyScript[]>(DEFAULT_COMEDY_SCRIPTS);
  const [currentScriptIndex, setCurrentScriptIndex] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<'player' | 'editor' | 'prompter'>('player');
  const [selectedSceneIndex, setSelectedSceneIndex] = useState<number>(0);

  // Modals state
  const [isGeneratorOpen, setIsGeneratorOpen] = useState<boolean>(false);
  const [isExporterOpen, setIsExporterOpen] = useState<boolean>(false);

  const activeScript = scriptsList[currentScriptIndex] || scriptsList[0];

  const handleUpdateScript = (updated: ComedyScript) => {
    setScriptsList((prev) =>
      prev.map((s, idx) => (idx === currentScriptIndex ? updated : s))
    );
  };

  const handleScriptGenerated = (newScript: ComedyScript) => {
    setScriptsList((prev) => [newScript, ...prev]);
    setCurrentScriptIndex(0);
    setSelectedSceneIndex(0);
    setActiveTab('player');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-400 selection:text-slate-950">
      {/* Top Application Navigation Bar */}
      <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800 px-4 sm:px-6 py-3">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Logo & Title */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 via-yellow-400 to-amber-300 flex items-center justify-center text-slate-950 shadow-lg shadow-amber-500/20">
                <Clapperboard className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h1 className="text-base sm:text-lg font-black tracking-tight text-white">
                    Studio Vidéo Comédie <span className="text-amber-400">5 Min</span>
                  </h1>
                  <span className="px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/30 text-[10px] font-black text-amber-400 uppercase tracking-widest">
                    Humour IA
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Créateur, lecteur animé, prompteur et découpage de sketches comiques
                </p>
              </div>
            </div>

            {/* Quick Script Selector on Mobile/Desktop */}
            <div className="flex items-center gap-2 md:hidden">
              <button
                onClick={() => setIsGeneratorOpen(true)}
                className="p-2 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-950 font-bold text-xs"
              >
                <Sparkles className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Center: Script Switcher Pill */}
          <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-2xl p-1 max-w-full overflow-x-auto">
            <span className="text-[11px] font-bold text-slate-400 pl-2 shrink-0">
              Sketch :
            </span>
            {scriptsList.map((sc, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setCurrentScriptIndex(idx);
                  setSelectedSceneIndex(0);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  idx === currentScriptIndex
                    ? 'bg-amber-400 text-slate-950 shadow-md font-black'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                {sc.title.length > 22 ? `${sc.title.slice(0, 22)}...` : sc.title}
              </button>
            ))}
          </div>

          {/* Right Action Buttons */}
          <div className="hidden md:flex items-center gap-2.5">
            <button
              onClick={() => setIsGeneratorOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/20 transition-all transform active:scale-95"
            >
              <Sparkles className="w-4 h-4" />
              <span>Générer un Sketch (5 min)</span>
            </button>

            <button
              onClick={() => setIsExporterOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-bold text-xs shadow-md transition-colors"
            >
              <Download className="w-4 h-4 text-emerald-400" />
              <span>Exporter / Partager</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation Mode Switcher */}
        <div className="max-w-7xl mx-auto mt-3 flex items-center justify-between border-t border-slate-800/80 pt-2.5">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('player')}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'player'
                  ? 'bg-slate-800 text-amber-400 border border-amber-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Film className="w-4 h-4" />
              <span>🎬 Lecteur & Vidéo Animée</span>
            </button>

            <button
              onClick={() => setActiveTab('editor')}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'editor'
                  ? 'bg-slate-800 text-amber-400 border border-amber-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>📝 Scénario & Didascalies ({activeScript.scenes.length} scènes)</span>
            </button>

            <button
              onClick={() => setActiveTab('prompter')}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'prompter'
                  ? 'bg-slate-800 text-amber-400 border border-amber-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Mic className="w-4 h-4" />
              <span>🎙️ Prompteur & Tournage Acteur</span>
            </button>
          </div>

          {/* Quick info badge */}
          <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>Format : 5:00 min ({activeScript.totalDurationSeconds}s)</span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-6">
        {/* Characters Presentation Bar */}
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-3.5 flex flex-wrap items-center justify-between gap-3 shadow-md">
          <div className="flex items-center gap-2.5">
            <span className="text-xl">🎭</span>
            <div>
              <h2 className="text-xs font-black uppercase tracking-wider text-slate-300">
                Personnages du Sketch :
              </h2>
              <div className="flex flex-wrap items-center gap-2 mt-1">
                {activeScript.characters.map((char) => (
                  <div
                    key={char.name}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-950 border border-slate-800 text-xs font-bold text-white shadow-sm"
                  >
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: char.avatarColor }}
                    />
                    <span>{char.name}</span>
                    <span className="text-[10px] text-slate-400 font-medium">({char.role})</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[11px] font-mono text-amber-400/90 font-bold">
              Genre : {activeScript.genre}
            </span>
            <p className="text-[11px] text-slate-400 italic max-w-md truncate">
              "{activeScript.tagline}"
            </p>
          </div>
        </div>

        {/* Tab 1: Video Player Stage */}
        {activeTab === 'player' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <VideoPlayerStage
              script={activeScript}
              onSceneChange={(idx) => setSelectedSceneIndex(idx)}
              onExportRequested={() => setIsExporterOpen(true)}
            />

            {/* Standalone Instant Soundboard Bar */}
            <SoundboardBar />
          </div>
        )}

        {/* Tab 2: Script & Comedy Beats Editor */}
        {activeTab === 'editor' && (
          <div className="animate-in fade-in duration-200">
            <ScriptEditor
              script={activeScript}
              onUpdateScript={handleUpdateScript}
              selectedSceneIndex={selectedSceneIndex}
              onSelectScene={(idx) => setSelectedSceneIndex(idx)}
            />
          </div>
        )}

        {/* Tab 3: Teleprompter & Actor Rehearsal Mode */}
        {activeTab === 'prompter' && (
          <div className="animate-in fade-in duration-200">
            <TeleprompterView script={activeScript} />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-900 bg-slate-950/80 py-4 px-6 text-center text-xs text-slate-500">
        <p>
          Studio Vidéo Comédie 5 Min • Créez, répétez et réalisez des sketchs hilarants avec minutage
          précis et bruitages en direct.
        </p>
      </footer>

      {/* Modals */}
      <GeneratorModal
        isOpen={isGeneratorOpen}
        onClose={() => setIsGeneratorOpen(false)}
        onScriptGenerated={handleScriptGenerated}
      />

      <VideoRecorderModal
        isOpen={isExporterOpen}
        onClose={() => setIsExporterOpen(false)}
        script={activeScript}
      />
    </div>
  );
}
