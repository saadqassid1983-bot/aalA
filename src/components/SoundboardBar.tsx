import React, { useState } from 'react';
import { SoundEffectType } from '../types/comedy';
import { playComedySound } from '../utils/audioEngine';

interface SoundboardBarProps {
  lastTriggeredFx?: SoundEffectType | null;
  onFxTriggered?: (fx: SoundEffectType) => void;
  compact?: boolean;
}

const SFX_BUTTONS: { type: SoundEffectType; label: string; icon: string; color: string }[] = [
  { type: 'rimshot', label: 'Ba-Dum Tss !', icon: '🥁', color: 'from-amber-500 to-amber-600' },
  { type: 'laugh_track', label: 'Rires Public', icon: '😂', color: 'from-yellow-400 to-amber-500' },
  { type: 'boing', label: 'Boing !', icon: '🌀', color: 'from-emerald-500 to-teal-600' },
  { type: 'sad_trombone', label: 'Malaise Wah-Wah', icon: '🎺', color: 'from-blue-500 to-indigo-600' },
  { type: 'record_scratch', label: 'Scratch Disque', icon: '💿', color: 'from-purple-500 to-pink-600' },
  { type: 'dramatic_dun', label: 'Dun-Dun-Dun !', icon: '⚡', color: 'from-red-600 to-rose-700' },
  { type: 'vine_boom', label: 'Vine Boom 💥', icon: '💣', color: 'from-slate-700 to-slate-900' },
  { type: 'crickets', label: 'Criquets Gênants', icon: '🦗', color: 'from-lime-600 to-green-700' },
  { type: 'slap', label: 'Baffe Comique', icon: '👋', color: 'from-orange-500 to-red-500' },
  { type: 'horn', label: 'Klaxon Pouet', icon: '📯', color: 'from-cyan-500 to-blue-600' },
  { type: 'applause', label: 'Applaudissements', icon: '👏', color: 'from-violet-500 to-purple-600' },
];

export const SoundboardBar: React.FC<SoundboardBarProps> = ({
  lastTriggeredFx,
  onFxTriggered,
  compact = false,
}) => {
  const [activeFx, setActiveFx] = useState<SoundEffectType | null>(null);

  const handleClick = (type: SoundEffectType) => {
    playComedySound(type);
    setActiveFx(type);
    onFxTriggered?.(type);
    setTimeout(() => setActiveFx(null), 400);
  };

  const isHighlighted = (type: SoundEffectType) => activeFx === type || lastTriggeredFx === type;

  if (compact) {
    return (
      <div className="flex items-center gap-1.5 overflow-x-auto py-1 px-1 scrollbar-none">
        <span className="text-xs font-bold text-slate-400 flex items-center gap-1 shrink-0 mr-1">
          <span>🔊</span> SFX:
        </span>
        {SFX_BUTTONS.slice(0, 6).map((sfx) => (
          <button
            key={sfx.type}
            onClick={() => handleClick(sfx.type)}
            className={`px-2 py-1 rounded text-xs font-semibold whitespace-nowrap transition-all shadow-sm flex items-center gap-1 ${
              isHighlighted(sfx.type)
                ? 'bg-amber-400 text-slate-900 scale-110 ring-2 ring-amber-300'
                : 'bg-slate-800 text-slate-200 hover:bg-slate-700 border border-slate-700'
            }`}
            title={sfx.label}
          >
            <span>{sfx.icon}</span>
            <span className="hidden sm:inline">{sfx.label}</span>
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 shadow-xl">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-lg">🎛️</span>
          <h4 className="text-xs font-black uppercase tracking-wider text-slate-200">
            Boîte à Bruitages Comiques (Soundboard Direct)
          </h4>
        </div>
        <span className="text-[11px] text-amber-400 font-medium">
          Cliquez pour déclencher en direct !
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
        {SFX_BUTTONS.map((sfx) => {
          const highlighted = isHighlighted(sfx.type);
          return (
            <button
              key={sfx.type}
              onClick={() => handleClick(sfx.type)}
              className={`relative px-2.5 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-all transform active:scale-95 shadow-md border ${
                highlighted
                  ? 'bg-gradient-to-r from-amber-400 to-yellow-300 text-slate-950 border-amber-300 scale-105 shadow-amber-500/30'
                  : 'bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 border-slate-700/60 hover:border-slate-500'
              }`}
            >
              <span className="text-base">{sfx.icon}</span>
              <span className="truncate">{sfx.label}</span>
              {highlighted && (
                <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
