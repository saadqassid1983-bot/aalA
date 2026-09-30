import React, { useState } from 'react';
import {
  ComedyScript,
  ComedyScene,
  DialogueLine,
  EmotionType,
  SoundEffectType,
  BackgroundKey,
} from '../types/comedy';
import {
  Sparkles,
  Plus,
  Trash2,
  Volume2,
  Clock,
  Laugh,
  Film,
  User,
  Wand2,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { playComedySound } from '../utils/audioEngine';

interface ScriptEditorProps {
  script: ComedyScript;
  onUpdateScript: (newScript: ComedyScript) => void;
  selectedSceneIndex: number;
  onSelectScene: (index: number) => void;
}

const EMOTION_OPTIONS: { value: EmotionType; label: string; emoji: string }[] = [
  { value: 'neutral', label: 'Neutre', emoji: '😐' },
  { value: 'shocked', label: 'Choqué', emoji: '😱' },
  { value: 'happy', label: 'Joyeux', emoji: '😄' },
  { value: 'angry', label: 'En colère', emoji: '😡' },
  { value: 'laughing', label: 'MDR / Rire', emoji: '🤣' },
  { value: 'confused', label: 'Perplexe', emoji: '🤨' },
  { value: 'smug', label: 'Prétentieux', emoji: '😏' },
];

const SFX_OPTIONS: { value: SoundEffectType | ''; label: string; icon: string }[] = [
  { value: '', label: 'Aucun son', icon: '🔇' },
  { value: 'rimshot', label: 'Ba-Dum Tss !', icon: '🥁' },
  { value: 'laugh_track', label: 'Rires Public', icon: '😂' },
  { value: 'boing', label: 'Boing !', icon: '🌀' },
  { value: 'sad_trombone', label: 'Malaise Wah-Wah', icon: '🎺' },
  { value: 'record_scratch', label: 'Scratch Vinyle', icon: '💿' },
  { value: 'dramatic_dun', label: 'Dun-Dun-Dun !', icon: '⚡' },
  { value: 'vine_boom', label: 'Vine Boom', icon: '💣' },
  { value: 'crickets', label: 'Criquets Gênants', icon: '🦗' },
  { value: 'slap', label: 'Gifle Comique', icon: '👋' },
  { value: 'horn', label: 'Klaxon Pouet', icon: '📯' },
  { value: 'applause', label: 'Applaudissements', icon: '👏' },
];

const BACKGROUND_OPTIONS: { value: BackgroundKey; label: string; icon: string }[] = [
  { value: 'kitchen', label: 'Cuisine / Boulangerie', icon: '🥖' },
  { value: 'office', label: 'Bureau / The Office', icon: '📎' },
  { value: 'stage', label: 'Scène / Keynote / Club', icon: '🎙️' },
  { value: 'scifi', label: 'Vaisseau Spatial Sci-Fi', icon: '🚀' },
  { value: 'detective', label: 'Bureau Détective Noir', icon: '🕵️' },
  { value: 'park', label: 'Parc ensoleillé', icon: '🌳' },
  { value: 'newsroom', label: 'Plateau Journal TV', icon: '📺' },
  { value: 'street', label: 'Rue parisienne', icon: '🥐' },
];

export const ScriptEditor: React.FC<ScriptEditorProps> = ({
  script,
  onUpdateScript,
  selectedSceneIndex,
  onSelectScene,
}) => {
  const [isPunchingUp, setIsPunchingUp] = useState<boolean>(false);
  const [punchUpStyle, setPunchUpStyle] = useState<string>('Absurde et Réparties Cinglantes');

  const activeScene = script.scenes[selectedSceneIndex] || script.scenes[0];

  // Calculate current total duration
  const totalDuration = script.scenes.reduce((acc, sc) => acc + (sc.duration || 45), 0);
  const minutes = Math.floor(totalDuration / 60);
  const seconds = totalDuration % 60;
  const isExact5Min = totalDuration >= 280 && totalDuration <= 320;

  const handleUpdateScene = (updatedFields: Partial<ComedyScene>) => {
    const newScenes = script.scenes.map((sc, idx) =>
      idx === selectedSceneIndex ? { ...sc, ...updatedFields } : sc
    );
    // Recalculate start times across scenes
    let runningTime = 0;
    const recomputed = newScenes.map((sc) => {
      const sWithStart = { ...sc, startTime: runningTime };
      runningTime += sc.duration || 45;
      return sWithStart;
    });

    onUpdateScript({
      ...script,
      totalDurationSeconds: runningTime,
      scenes: recomputed,
    });
  };

  const handleUpdateDialogue = (dialogueIndex: number, updatedFields: Partial<DialogueLine>) => {
    const updatedDialogues = activeScene.dialogues.map((d, dIdx) =>
      dIdx === dialogueIndex ? { ...d, ...updatedFields } : d
    );
    handleUpdateScene({ dialogues: updatedDialogues });
  };

  const handleAddDialogue = () => {
    const newLine: DialogueLine = {
      speaker: script.characters[0]?.name || 'Personnage',
      text: 'Nouvelle réplique hilarante à personnaliser...',
      actorDirection: '[Regarde avec ironie]',
      emotion: 'neutral',
      soundFx: null,
      sticker: null,
    };
    handleUpdateScene({ dialogues: [...activeScene.dialogues, newLine] });
  };

  const handleDeleteDialogue = (dialogueIndex: number) => {
    const updated = activeScene.dialogues.filter((_, idx) => idx !== dialogueIndex);
    handleUpdateScene({ dialogues: updated });
  };

  const handleAddScene = () => {
    const newScene: ComedyScene = {
      id: `scene-${Date.now()}`,
      title: `Scène ${script.scenes.length + 1} : Nouveau Rebondissement`,
      startTime: totalDuration,
      duration: 45,
      location: 'Nouveau décor comique',
      backgroundKey: 'office',
      visualGag: 'Un objet incongru tombe du plafond avec fracas.',
      musicMood: 'goofy',
      dialogues: [
        {
          speaker: script.characters[0]?.name || 'Personnage A',
          text: "Mais qu'est-ce que vous faites avec ça ?!",
          actorDirection: '[Geste outré]',
          emotion: 'shocked',
          soundFx: 'record_scratch',
        },
        {
          speaker: script.characters[1]?.name || 'Personnage B',
          text: "Absolument rien de suspect, circulez !",
          actorDirection: '[Sourit bêtement]',
          emotion: 'smug',
          soundFx: 'rimshot',
        },
      ],
    };

    const newScenes = [...script.scenes, newScene];
    onUpdateScript({
      ...script,
      totalDurationSeconds: totalDuration + 45,
      scenes: newScenes,
    });
    onSelectScene(newScenes.length - 1);
  };

  const handleDeleteScene = (sceneIndex: number) => {
    if (script.scenes.length <= 1) return;
    const updated = script.scenes.filter((_, idx) => idx !== sceneIndex);
    let running = 0;
    const recomputed = updated.map((sc) => {
      const s = { ...sc, startTime: running };
      running += sc.duration || 45;
      return s;
    });
    onUpdateScript({
      ...script,
      totalDurationSeconds: running,
      scenes: recomputed,
    });
    onSelectScene(Math.max(0, sceneIndex - 1));
  };

  // Punch-Up Doctor with Gemini API
  const handlePunchUp = async () => {
    try {
      setIsPunchingUp(true);
      const res = await fetch('/api/punchup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sceneOrText: activeScene,
          style: punchUpStyle,
        }),
      });
      const data = await res.json();
      if (data.success && data.result) {
        // Merge improved dialogues or gag if available
        if (data.result.dialogues) {
          handleUpdateScene({
            visualGag: data.result.visualGag || activeScene.visualGag,
            dialogues: data.result.dialogues,
          });
        }
      }
    } catch (err) {
      console.warn('Punch-up error:', err);
    } finally {
      setIsPunchingUp(false);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl flex flex-col gap-6">
      {/* Script Header Info & 5-Minute Gauge */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🎬</span>
            <h3 className="text-lg font-black text-white">Éditeur & Découpage Scénaristique</h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Ajustez répliques, bruitages et rythme pour une vidéo comique percutante de 5 minutes.
          </p>
        </div>

        {/* 5-minute counter indicator */}
        <div className="flex items-center gap-3 bg-slate-950 px-4 py-2.5 rounded-xl border border-slate-800 shadow-inner">
          <Clock className="w-4 h-4 text-amber-400" />
          <div className="text-xs">
            <div className="text-slate-400 font-medium">Durée totale calculée :</div>
            <div className="text-sm font-mono font-black text-amber-400">
              {minutes} min {seconds.toString().padStart(2, '0')}s / 5 min
            </div>
          </div>
          {isExact5Min ? (
            <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800 px-2 py-0.5 rounded-full">
              <CheckCircle2 className="w-3 h-3" /> 5 min Parfait !
            </span>
          ) : (
            <span className="flex items-center gap-1 text-[11px] font-bold text-amber-400 bg-amber-950/60 border border-amber-800 px-2 py-0.5 rounded-full">
              <AlertCircle className="w-3 h-3" /> Cible 5:00
            </span>
          )}
        </div>
      </div>

      {/* Scene Tabs Carousel */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {script.scenes.map((scene, idx) => {
          const isSelected = idx === selectedSceneIndex;
          const sMin = Math.floor(scene.startTime / 60);
          const sSec = (scene.startTime % 60).toString().padStart(2, '0');
          return (
            <button
              key={scene.id}
              onClick={() => onSelectScene(idx)}
              className={`flex flex-col items-start px-3.5 py-2 rounded-xl text-left transition-all shrink-0 border ${
                isSelected
                  ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-lg scale-102 font-bold'
                  : 'bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 border-slate-700'
              }`}
            >
              <div className="text-[10px] font-mono opacity-80">
                {sMin}:{sSec} • {scene.duration}s
              </div>
              <div className="text-xs font-black truncate max-w-[130px]">
                {scene.title.replace(/^Scène \d+ : /, '')}
              </div>
            </button>
          );
        })}

        <button
          onClick={handleAddScene}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800/60 hover:bg-slate-700 border border-dashed border-slate-600 text-slate-400 hover:text-white text-xs font-bold shrink-0 transition-colors"
          title="Ajouter une scène au script"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Nouvelle Scène</span>
        </button>
      </div>

      {/* Current Scene Settings & AI Punch-Up Bar */}
      <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex-1">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Titre de la Scène
            </label>
            <input
              type="text"
              value={activeScene.title}
              onChange={(e) => handleUpdateScene({ title: e.target.value })}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-sm font-bold text-white outline-none focus:border-amber-400"
            />
          </div>

          <div className="flex items-center gap-2">
            <div>
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Durée (sec)
              </label>
              <input
                type="number"
                min="10"
                max="120"
                value={activeScene.duration}
                onChange={(e) =>
                  handleUpdateScene({ duration: Math.max(5, parseInt(e.target.value) || 30) })
                }
                className="w-20 bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-sm font-mono font-bold text-amber-400 outline-none text-center"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Décor
              </label>
              <select
                value={activeScene.backgroundKey}
                onChange={(e) =>
                  handleUpdateScene({ backgroundKey: e.target.value as BackgroundKey })
                }
                className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-200 outline-none cursor-pointer"
              >
                {BACKGROUND_OPTIONS.map((bg) => (
                  <option key={bg.value} value={bg.value}>
                    {bg.icon} {bg.label}
                  </option>
                ))}
              </select>
            </div>

            {script.scenes.length > 1 && (
              <button
                onClick={() => handleDeleteScene(selectedSceneIndex)}
                className="mt-5 p-2 rounded-lg bg-red-950/40 hover:bg-red-900/60 border border-red-800 text-red-400 transition-colors"
                title="Supprimer cette scène"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Visual Gag & Location */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              📍 Lieu / Description du plan
            </label>
            <input
              type="text"
              value={activeScene.location}
              onChange={(e) => handleUpdateScene({ location: e.target.value })}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-200 outline-none"
              placeholder="Ex: Devant le comptoir à croissants"
            />
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              🎭 Gag visuel / Action physique comique
            </label>
            <input
              type="text"
              value={activeScene.visualGag}
              onChange={(e) => handleUpdateScene({ visualGag: e.target.value })}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-amber-300 outline-none"
              placeholder="Ex: Il trébuche sur une baguette et fait voler la farine"
            />
          </div>
        </div>

        {/* AI "Punch-Up Doctor" Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800/80">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-bold text-slate-300">Docteur du Rire (IA Punch-Up) :</span>
            <select
              value={punchUpStyle}
              onChange={(e) => setPunchUpStyle(e.target.value)}
              className="bg-slate-900 text-xs text-slate-200 border border-slate-700 rounded-lg px-2.5 py-1 outline-none font-medium cursor-pointer"
            >
              <option value="Absurde et Réparties Cinglantes">Absurde & Réparties Cinglantes</option>
              <option value="Style The Office et Malaises Géniaux">Style The Office (Malaise & Silences)</option>
              <option value="Slapstick Cartoon et Sons Comiques">Slapstick & Cartoon Extrême</option>
              <option value="Parodie Sérieuse et Premier Degré Hilarant">Parodie 1er Degré Hilarant</option>
              <option value="Mème Culture et Punchlines Gen-Z">Mème Culture & Punchlines</option>
            </select>
          </div>

          <button
            onClick={handlePunchUp}
            disabled={isPunchingUp}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md disabled:opacity-50 transition-all"
          >
            <Wand2 className="w-3.5 h-3.5" />
            <span>{isPunchingUp ? 'Amélioration en cours...' : 'Rendre la scène 10x plus drôle'}</span>
          </button>
        </div>
      </div>

      {/* Dialogues List in Active Scene */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-black uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
            <Film className="w-3.5 h-3.5 text-amber-400" />
            <span>Répliques & Didascalies de la Scène ({activeScene.dialogues.length})</span>
          </h4>

          <button
            onClick={handleAddDialogue}
            className="flex items-center gap-1 px-3 py-1 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black shadow-md transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Ajouter une Réplique</span>
          </button>
        </div>

        <div className="space-y-3">
          {activeScene.dialogues.map((dialogue, dIdx) => (
            <div
              key={dIdx}
              className="bg-slate-950/90 border border-slate-800 hover:border-slate-700 rounded-xl p-3.5 shadow-sm transition-all"
            >
              {/* Speaker & Direction line */}
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  <select
                    value={dialogue.speaker}
                    onChange={(e) => handleUpdateDialogue(dIdx, { speaker: e.target.value })}
                    className="bg-slate-900 border border-slate-700 text-amber-400 text-xs font-black rounded-lg px-2.5 py-1 outline-none"
                  >
                    {script.characters.map((c) => (
                      <option key={c.name} value={c.name}>
                        {c.name} ({c.role})
                      </option>
                    ))}
                  </select>

                  <input
                    type="text"
                    value={dialogue.actorDirection || ''}
                    onChange={(e) => handleUpdateDialogue(dIdx, { actorDirection: e.target.value })}
                    className="bg-slate-900/60 border border-slate-700/80 rounded-lg px-2.5 py-1 text-xs text-slate-400 italic outline-none min-w-[200px]"
                    placeholder="[Indication de jeu d'acteur, ex: Regard caméra]"
                  />
                </div>

                <div className="flex items-center gap-2">
                  {/* Emotion Picker */}
                  <select
                    value={dialogue.emotion}
                    onChange={(e) =>
                      handleUpdateDialogue(dIdx, { emotion: e.target.value as EmotionType })
                    }
                    className="bg-slate-900 border border-slate-700 text-xs rounded-lg px-2 py-1 outline-none text-slate-200 cursor-pointer"
                  >
                    {EMOTION_OPTIONS.map((emo) => (
                      <option key={emo.value} value={emo.value}>
                        {emo.emoji} {emo.label}
                      </option>
                    ))}
                  </select>

                  {/* Sound Effect Picker */}
                  <div className="flex items-center gap-1">
                    <select
                      value={dialogue.soundFx || ''}
                      onChange={(e) => {
                        const val = e.target.value as SoundEffectType | '';
                        handleUpdateDialogue(dIdx, { soundFx: val || null });
                        if (val) playComedySound(val);
                      }}
                      className="bg-slate-900 border border-slate-700 text-xs rounded-lg px-2 py-1 outline-none text-amber-300 cursor-pointer"
                    >
                      {SFX_OPTIONS.map((sfx) => (
                        <option key={sfx.value} value={sfx.value}>
                          {sfx.icon} {sfx.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Delete button */}
                  {activeScene.dialogues.length > 1 && (
                    <button
                      onClick={() => handleDeleteDialogue(dIdx)}
                      className="p-1 rounded text-slate-500 hover:text-red-400 transition-colors"
                      title="Supprimer cette réplique"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Dialogue Spoken Text */}
              <textarea
                rows={2}
                value={dialogue.text}
                onChange={(e) => handleUpdateDialogue(dIdx, { text: e.target.value })}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-sm text-white font-medium outline-none focus:border-amber-400 resize-none leading-relaxed"
                placeholder="Texte de la réplique..."
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
