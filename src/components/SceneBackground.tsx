import React from 'react';
import { BackgroundKey } from '../types/comedy';

interface SceneBackgroundProps {
  backgroundKey: BackgroundKey;
  locationName?: string;
  isPanicking?: boolean;
}

export const SceneBackground: React.FC<SceneBackgroundProps> = ({
  backgroundKey,
  locationName,
  isPanicking = false,
}) => {
  const renderScenery = () => {
    switch (backgroundKey) {
      case 'kitchen':
        return (
          <div className="absolute inset-0 bg-gradient-to-b from-amber-100 to-amber-200 overflow-hidden">
            {/* Checkerboard tile floor */}
            <div className="absolute bottom-0 w-full h-24 bg-[linear-gradient(45deg,#d97706_25%,transparent_25%),linear-gradient(-45deg,#d97706_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#d97706_75%),linear-gradient(-45deg,transparent_75%,#d97706_75%)] bg-[size:32px_32px] opacity-40" />

            {/* Kitchen Shelves with pots and baguettes */}
            <div className="absolute top-12 left-6 right-6 h-3 bg-amber-800 rounded-sm shadow-md" />
            <div className="absolute top-4 left-10 flex gap-4 text-2xl">
              <span className="animate-pulse">🥖</span>
              <span>🥐</span>
              <span>🧂</span>
              <span>🍳</span>
              <span>🍞</span>
            </div>

            {/* Giant Oven in background */}
            <div className="absolute bottom-20 right-10 w-36 h-48 bg-slate-700 rounded-t-xl border-4 border-slate-900 shadow-xl flex flex-col items-center justify-between p-3">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500 animate-ping" />
                <div className="w-3 h-3 rounded-full bg-amber-400" />
                <div className="w-3 h-3 rounded-full bg-emerald-400" />
              </div>
              <div className="w-24 h-24 bg-gradient-to-t from-orange-600 via-amber-500 to-yellow-300 rounded border-2 border-slate-900 flex items-center justify-center font-black text-2xl shadow-inner animate-pulse">
                🔥
              </div>
              <div className="text-[10px] font-mono text-slate-300">FOUR 450°C</div>
            </div>

            {/* Flour clouds floating */}
            <div className="absolute top-24 left-1/4 w-28 h-12 bg-white/40 rounded-full blur-md animate-pulse" />
          </div>
        );

      case 'office':
        return (
          <div className="absolute inset-0 bg-gradient-to-b from-slate-200 to-slate-300 overflow-hidden">
            {/* Venetian blinds window */}
            <div className="absolute top-8 left-8 w-44 h-56 bg-sky-200 border-4 border-slate-400 rounded shadow-inner overflow-hidden">
              {[...Array(9)].map((_, i) => (
                <div key={i} className="h-5 border-b-2 border-slate-400/70 bg-white/30" />
              ))}
            </div>

            {/* Whiteboard with absurd graph */}
            <div className="absolute top-8 right-12 w-52 h-44 bg-white border-4 border-slate-400 rounded-lg shadow-md p-2 flex flex-col justify-between">
              <div className="text-[11px] font-black text-slate-700 tracking-wider">
                STRATÉGIE SYNERGIE 📈
              </div>
              <svg viewBox="0 0 100 50" className="w-full h-24">
                <polyline
                  points="5,45 25,35 45,40 70,10 95,48"
                  fill="none"
                  stroke="#ef4444"
                  strokeWidth="3"
                />
                <circle cx="70" cy="10" r="3" fill="#ef4444" />
              </svg>
              <div className="text-[9px] text-slate-500 italic">"Objectif : Ne pas couler"</div>
            </div>

            {/* Water cooler */}
            <div className="absolute bottom-20 left-12 w-16 h-36 bg-slate-100 border-2 border-slate-400 rounded-t-lg shadow-lg flex flex-col items-center">
              <div className="w-10 h-14 bg-sky-400/80 rounded-full border border-sky-600 -mt-7 animate-pulse" />
              <div className="mt-4 flex gap-1">
                <div className="w-2 h-4 bg-blue-600 rounded-sm" />
                <div className="w-2 h-4 bg-red-600 rounded-sm" />
              </div>
            </div>

            {/* Carpet floor */}
            <div className="absolute bottom-0 w-full h-20 bg-slate-500 border-t-4 border-slate-600" />
          </div>
        );

      case 'stage':
        return (
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-indigo-950 to-slate-900 overflow-hidden">
            {/* Dramatic Spotlight cones */}
            <div className="absolute -top-10 left-1/4 w-40 h-[120%] bg-gradient-to-b from-sky-400/40 via-cyan-400/15 to-transparent -rotate-12 blur-sm pointer-events-none" />
            <div className="absolute -top-10 right-1/4 w-40 h-[120%] bg-gradient-to-b from-purple-400/40 via-pink-400/15 to-transparent rotate-12 blur-sm pointer-events-none" />

            {/* Giant Keynote Screen in background */}
            <div className="absolute top-6 left-1/2 -translate-x-1/2 w-4/5 h-44 bg-slate-900/90 border-2 border-cyan-500/50 rounded-xl shadow-[0_0_30px_rgba(6,182,212,0.2)] flex flex-col items-center justify-center p-4">
              <div className="text-cyan-400 text-xs font-mono font-bold tracking-widest uppercase animate-pulse">
                KEYNOTE 2026 // ONE MORE THING
              </div>
              <div className="text-3xl sm:text-4xl font-black text-white mt-1 tracking-tight">
                💧 AquaSphere OS
              </div>
              <div className="text-xs text-slate-400 mt-2">
                Version 3.0 • 149€ / gorgée • 100% Cloud
              </div>
            </div>

            {/* Wooden stage floor */}
            <div className="absolute bottom-0 w-full h-24 bg-gradient-to-t from-amber-950 to-amber-900 border-t-4 border-amber-700 shadow-2xl flex items-center justify-center">
              <div className="text-3xl opacity-20">🎙️</div>
            </div>
          </div>
        );

      case 'scifi':
        return (
          <div className="absolute inset-0 bg-slate-950 overflow-hidden">
            {/* Starfield with twinkling stars */}
            <div className="absolute inset-0 opacity-80 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900 via-slate-950 to-black">
              {[...Array(20)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-1 h-1 bg-white rounded-full animate-ping"
                  style={{
                    top: `${(i * 17) % 80}%`,
                    left: `${(i * 23) % 95}%`,
                    animationDuration: `${1.5 + (i % 3)}s`,
                  }}
                />
              ))}
            </div>

            {/* Big Spaceship Cockpit Window */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 w-11/12 h-56 rounded-t-full border-4 border-slate-700 bg-cyan-950/20 backdrop-blur-[1px] flex items-center justify-center">
              <div className="text-7xl opacity-80 animate-pulse">🪐</div>
            </div>

            {/* Control Console */}
            <div className="absolute bottom-0 w-full h-24 bg-slate-900 border-t-4 border-cyan-500/80 p-3 flex justify-around items-center">
              <div className="flex gap-2">
                <div className="w-5 h-5 bg-red-600 rounded-full animate-ping" />
                <div className="w-5 h-5 bg-yellow-500 rounded-full" />
                <div className="w-5 h-5 bg-emerald-500 rounded-full" />
              </div>
              <div className="text-xs font-mono text-cyan-400 animate-pulse">
                [ALERTE : OXYGENE 12% - CAFÉ : 0%]
              </div>
            </div>
          </div>
        );

      case 'detective':
        return (
          <div className="absolute inset-0 bg-slate-950 overflow-hidden">
            {/* Rain streaks */}
            <div className="absolute inset-0 bg-gradient-to-b from-slate-900 to-slate-950" />
            {/* Venetian shadows */}
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="absolute w-full h-6 bg-amber-500/10"
                style={{ top: `${i * 12 + 10}%` }}
              />
            ))}
            {/* Neon sign */}
            <div className="absolute top-6 right-10 px-4 py-2 border-2 border-red-500 rounded shadow-[0_0_20px_rgba(239,68,68,0.6)] text-red-400 font-serif font-black tracking-widest text-sm animate-pulse">
              ENQUÊTE NOIR 🔍
            </div>
            {/* Desk shadow */}
            <div className="absolute bottom-0 w-full h-24 bg-stone-900 border-t-2 border-stone-700" />
          </div>
        );

      default:
        // Generic stage/room
        return (
          <div className="absolute inset-0 bg-gradient-to-b from-indigo-900 via-purple-950 to-slate-950 overflow-hidden">
            <div className="absolute -top-20 -left-20 w-80 h-80 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 w-full h-20 bg-slate-900 border-t-2 border-purple-500/40" />
          </div>
        );
    }
  };

  return (
    <div
      className={`absolute inset-0 transition-all duration-500 ${
        isPanicking ? 'animate-[wiggle_0.2s_ease-in-out_infinite]' : ''
      }`}
    >
      {renderScenery()}

      {/* Location Stamp Banner at top left */}
      {locationName && (
        <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 px-3 py-1 rounded-md bg-slate-950/85 backdrop-blur-md border border-slate-700/80 text-white shadow-lg">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <span className="text-[11px] font-bold tracking-wide uppercase text-slate-200">
            📍 {locationName}
          </span>
        </div>
      )}
    </div>
  );
};
