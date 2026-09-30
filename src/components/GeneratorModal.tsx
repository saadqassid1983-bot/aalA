import React, { useState } from 'react';
import { ComedyScript } from '../types/comedy';
import { Sparkles, X, Wand2, Lightbulb, Clapperboard, RefreshCw } from 'lucide-react';

interface GeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScriptGenerated: (script: ComedyScript) => void;
}

const COMEDY_GENRES = [
  { id: 'Absurde & Slapstick', label: 'Absurde & Slapstick', icon: '🤪' },
  { id: 'Mockumentary (The Office)', label: 'Mockumentary (The Office)', icon: '📎' },
  { id: 'Parodie de Film / Série', label: 'Parodie de Film / Série', icon: '🍿' },
  { id: 'Sitcom avec Rires', label: 'Sitcom avec Rires', icon: '📺' },
  { id: 'Satire Tech & Startup', label: 'Satire Tech & Startup', icon: '💡' },
  { id: 'Kaamelott / Médiéval Français', label: 'Kaamelott / Dialogue Punchy', icon: '⚔️' },
];

const QUICK_IDEAS = [
  "Le serveur de restaurant gastronomique qui juge impitoyablement ta commande de nuggets",
  "Deux astronautes découvrent qu'ils ont oublié le tire-bouchon pour ouvrir la première bouteille sur Mars",
  "L'examen du permis de conduire avec un moniteur qui a peur des feux tricolores",
  "Un cambrioleur tellement poli qu'il aide les propriétaires à ranger le lave-vaisselle",
  "Une grand-mère qui négocie un deal de cookies avec le cartel de la mafia",
  "L'intelligence artificielle d'un aspirateur robot qui refuse de nettoyer les miettes par dignité",
];

export const GeneratorModal: React.FC<GeneratorModalProps> = ({
  isOpen,
  onClose,
  onScriptGenerated,
}) => {
  const [topic, setTopic] = useState<string>('');
  const [genre, setGenre] = useState<string>('Absurde & Slapstick');
  const [charactersCount, setCharactersCount] = useState<number>(2);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGenerate = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const res = await fetch('/api/generate-script', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: topic.trim() || 'Une situation du quotidien qui dégénère en désastre absurde',
          genre,
          charactersCount,
          language: 'fr',
        }),
      });

      const data = await res.json();
      if (data.success && data.script) {
        onScriptGenerated(data.script);
        onClose();
      } else {
        setError(data.error || 'Erreur lors de la génération. Réessayez.');
      }
    } catch (err: any) {
      setError(err?.message || 'Erreur réseau');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-950 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-white">
                Générateur IA de Vidéo Comique (5 Minutes)
              </h3>
              <p className="text-xs text-slate-400">
                L'IA compose le découpage minute par minute, répliques percutantes et bruitages.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {error && (
            <div className="p-3 bg-red-950/80 border border-red-800 rounded-xl text-xs text-red-200">
              {error}
            </div>
          )}

          {/* User Topic Input */}
          <div>
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
              💡 Quel est le pitch ou l'idée de ta vidéo comique ?
            </label>
            <textarea
              rows={3}
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Ex: Deux collègues bloqués dans l'ascenseur avec un pigeon mystique et un stagiaire paniqué..."
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-sm text-white placeholder-slate-500 outline-none focus:border-amber-400 resize-none shadow-inner"
            />
          </div>

          {/* Quick inspiration chips */}
          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 mb-2">
              <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
              <span>Idées de sketchs prêtes à l'emploi :</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {QUICK_IDEAS.map((idea, idx) => (
                <button
                  key={idx}
                  onClick={() => setTopic(idea)}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-[11px] text-slate-300 hover:text-white border border-slate-700/80 transition-colors text-left"
                >
                  "{idea.slice(0, 50)}..."
                </button>
              ))}
            </div>
          </div>

          {/* Comedy Genre Picker */}
          <div>
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
              🎭 Style & Genre Comique
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {COMEDY_GENRES.map((g) => {
                const isSelected = genre === g.id;
                return (
                  <button
                    key={g.id}
                    onClick={() => setGenre(g.id)}
                    className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-bold transition-all text-left ${
                      isSelected
                        ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md font-black'
                        : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-600'
                    }`}
                  >
                    <span className="text-base">{g.icon}</span>
                    <span className="truncate">{g.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Number of characters */}
          <div>
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
              👥 Nombre de personnages principaux
            </label>
            <div className="flex gap-3">
              {[2, 3, 4].map((num) => (
                <button
                  key={num}
                  onClick={() => setCharactersCount(num)}
                  className={`flex-1 py-2 rounded-xl border text-xs font-black transition-all ${
                    charactersCount === num
                      ? 'bg-amber-400 text-slate-950 border-amber-300'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                  }`}
                >
                  {num} Personnages {num === 2 ? '(Duo Comique)' : num === 3 ? '(Trio)' : '(Troupe)'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="px-6 py-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <div className="text-[11px] text-slate-400 font-mono">
            ⏱️ Calibré pour une structure 5:00 minutes
          </div>

          <button
            onClick={handleGenerate}
            disabled={isLoading}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-950 font-black text-sm shadow-xl hover:from-amber-300 hover:to-yellow-300 disabled:opacity-50 transition-all transform active:scale-95"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Génération du sketch 5 min...</span>
              </>
            ) : (
              <>
                <Wand2 className="w-4 h-4" />
                <span>Générer le Script Vidéo IA</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
