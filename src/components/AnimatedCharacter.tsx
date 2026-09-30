import React from 'react';
import { EmotionType } from '../types/comedy';

interface AnimatedCharacterProps {
  name: string;
  role?: string;
  color: string;
  emotion: EmotionType;
  isSpeaking: boolean;
  position: 'left' | 'center' | 'right';
  scale?: number;
  highlight?: boolean;
}

export const AnimatedCharacter: React.FC<AnimatedCharacterProps> = ({
  name,
  role,
  color,
  emotion,
  isSpeaking,
  position,
  scale = 1,
  highlight = false,
}) => {
  // Determine eye and mouth shapes based on emotion and speaking state
  const renderEyes = () => {
    switch (emotion) {
      case 'shocked':
        return (
          <g>
            <circle cx="36" cy="40" r="9" fill="#ffffff" stroke="#1e293b" strokeWidth="2.5" />
            <circle cx="64" cy="40" r="9" fill="#ffffff" stroke="#1e293b" strokeWidth="2.5" />
            <circle cx="36" cy="40" r="3.5" fill="#0f172a" />
            <circle cx="64" cy="40" r="3.5" fill="#0f172a" />
            {/* Shocked sweat drops */}
            <path
              d="M75 22 Q78 26 75 30 Q72 26 75 22 Z"
              fill="#38bdf8"
              className="animate-bounce"
            />
          </g>
        );
      case 'angry':
        return (
          <g>
            {/* Angry angled eyebrows */}
            <path d="M28 32 L46 38" stroke="#0f172a" strokeWidth="3.5" strokeLinecap="round" />
            <path d="M72 32 L54 38" stroke="#0f172a" strokeWidth="3.5" strokeLinecap="round" />
            <circle cx="37" cy="42" r="5" fill="#0f172a" />
            <circle cx="63" cy="42" r="5" fill="#0f172a" />
          </g>
        );
      case 'laughing':
        return (
          <g>
            {/* Happy squinting curved eyes ^^ */}
            <path
              d="M28 42 Q37 32 46 42"
              fill="none"
              stroke="#0f172a"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
            <path
              d="M54 42 Q63 32 72 42"
              fill="none"
              stroke="#0f172a"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
            {/* Crying laughing tears */}
            <path
              d="M23 44 Q20 50 24 54 Q27 50 23 44"
              fill="#60a5fa"
              className="animate-pulse"
            />
            <path
              d="M77 44 Q80 50 76 54 Q73 50 77 44"
              fill="#60a5fa"
              className="animate-pulse"
            />
          </g>
        );
      case 'confused':
        return (
          <g>
            {/* One high eyebrow, one low */}
            <path d="M28 30 Q37 26 46 32" stroke="#0f172a" strokeWidth="3" fill="none" />
            <path d="M54 36 Q63 40 72 36" stroke="#0f172a" strokeWidth="3" fill="none" />
            <circle cx="37" cy="42" r="6" fill="#0f172a" />
            <circle cx="63" cy="42" r="4.5" fill="#0f172a" />
            {/* Question mark floating */}
            <text x="76" y="24" fontSize="16" fontWeight="bold" fill="#f59e0b">
              ?
            </text>
          </g>
        );
      case 'smug':
        return (
          <g>
            {/* Raised confident brow */}
            <path d="M28 34 Q37 32 46 36" stroke="#0f172a" strokeWidth="3" fill="none" />
            <path d="M54 32 Q63 26 72 32" stroke="#0f172a" strokeWidth="3.5" fill="none" />
            {/* Smug half-closed eyes */}
            <path d="M30 42 Q37 38 44 42" stroke="#0f172a" strokeWidth="3.5" fill="none" />
            <circle cx="63" cy="42" r="5" fill="#0f172a" />
            <circle cx="65" cy="40" r="1.5" fill="#ffffff" />
          </g>
        );
      case 'happy':
        return (
          <g>
            <circle cx="37" cy="40" r="6" fill="#0f172a" />
            <circle cx="63" cy="40" r="6" fill="#0f172a" />
            <circle cx="39" cy="38" r="2.2" fill="#ffffff" />
            <circle cx="65" cy="38" r="2.2" fill="#ffffff" />
          </g>
        );
      default:
        // neutral
        return (
          <g>
            <circle cx="37" cy="40" r="5.5" fill="#0f172a" />
            <circle cx="63" cy="40" r="5.5" fill="#0f172a" />
            <circle cx="39" cy="38" r="1.8" fill="#ffffff" />
            <circle cx="65" cy="38" r="1.8" fill="#ffffff" />
          </g>
        );
    }
  };

  const renderMouth = () => {
    if (isSpeaking) {
      // Animated mouth flapping
      return (
        <path
          d="M36 60 Q50 82 64 60 Z"
          fill="#be123c"
          stroke="#0f172a"
          strokeWidth="2.5"
          className="animate-pulse"
        >
          {/* Tongue inside */}
          <animate
            attributeName="d"
            values="M38 60 Q50 78 62 60 Z; M35 62 Q50 86 65 62 Z; M40 60 Q50 68 60 60 Z; M38 60 Q50 78 62 60 Z"
            dur="0.25s"
            repeatCount="indefinite"
          />
        </path>
      );
    }

    switch (emotion) {
      case 'laughing':
      case 'happy':
        return (
          <path
            d="M34 58 Q50 76 66 58 Z"
            fill="#be123c"
            stroke="#0f172a"
            strokeWidth="2.5"
          />
        );
      case 'shocked':
        return (
          <ellipse
            cx="50"
            cy="65"
            rx="9"
            ry="14"
            fill="#be123c"
            stroke="#0f172a"
            strokeWidth="2.5"
          />
        );
      case 'angry':
        return (
          <path
            d="M36 68 Q50 56 64 68"
            fill="none"
            stroke="#0f172a"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
        );
      case 'confused':
        return (
          <path
            d="M36 64 Q46 68 54 60 Q62 64 64 62"
            fill="none"
            stroke="#0f172a"
            strokeWidth="3"
            strokeLinecap="round"
          />
        );
      case 'smug':
        return (
          <path
            d="M38 64 Q54 68 66 58"
            fill="none"
            stroke="#0f172a"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
        );
      default:
        return (
          <path
            d="M38 64 Q50 67 62 64"
            fill="none"
            stroke="#0f172a"
            strokeWidth="3"
            strokeLinecap="round"
          />
        );
    }
  };

  return (
    <div
      className={`flex flex-col items-center transition-all duration-300 select-none ${
        position === 'left' ? 'items-start' : position === 'right' ? 'items-end' : 'items-center'
      }`}
      style={{
        transform: `scale(${scale}) ${isSpeaking ? 'translateY(-6px)' : ''}`,
      }}
    >
      {/* Puppet Head & Body SVG */}
      <div className="relative">
        {/* Glow when speaking or highlighted */}
        {(isSpeaking || highlight) && (
          <div
            className="absolute -inset-2 rounded-full opacity-60 blur-md pointer-events-none"
            style={{ backgroundColor: color }}
          />
        )}

        <svg
          viewBox="0 0 100 130"
          className={`w-28 sm:w-36 md:w-44 h-auto drop-shadow-xl transition-transform ${
            isSpeaking ? 'animate-bounce' : ''
          }`}
          style={{ animationDuration: '0.6s' }}
        >
          {/* Character Body / Shoulders */}
          <path
            d="M15 130 Q15 95 40 92 L60 92 Q85 95 85 130 Z"
            fill={color}
            stroke="#0f172a"
            strokeWidth="3"
          />
          {/* Collar / Tie or detail */}
          <path d="M42 92 L50 110 L58 92" fill="#ffffff" stroke="#0f172a" strokeWidth="2" />
          <path d="M48 110 L52 110 L53 125 L47 125 Z" fill="#e11d48" />

          {/* Character Head */}
          <circle
            cx="50"
            cy="52"
            r="38"
            fill="#fde68a" // Skin tone
            stroke="#0f172a"
            strokeWidth="3.5"
          />

          {/* Cheeks blush */}
          {(emotion === 'happy' || emotion === 'laughing' || emotion === 'shocked') && (
            <g opacity="0.6">
              <ellipse cx="24" cy="54" rx="6" ry="4" fill="#f43f5e" />
              <ellipse cx="76" cy="54" rx="6" ry="4" fill="#f43f5e" />
            </g>
          )}

          {/* Eyes */}
          {renderEyes()}

          {/* Nose */}
          <path
            d="M48 48 Q50 54 53 54"
            fill="none"
            stroke="#0f172a"
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {/* Mouth */}
          {renderMouth()}

          {/* Hair / Hat style */}
          <path
            d="M16 45 Q25 18 50 18 Q75 18 84 45 Q70 28 50 30 Q30 28 16 45 Z"
            fill="#1e293b"
            stroke="#0f172a"
            strokeWidth="2"
          />
        </svg>

        {/* Emotion label tag */}
        <div
          className={`absolute -top-3 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider text-white shadow-sm transition-opacity ${
            isSpeaking ? 'opacity-100 ring-2 ring-white ring-offset-1' : 'opacity-85'
          }`}
          style={{ backgroundColor: color }}
        >
          {emotion}
        </div>
      </div>

      {/* Name and Role label */}
      <div className="mt-2 text-center">
        <span
          className={`inline-block px-2.5 py-0.5 rounded-lg text-xs font-black shadow-md border ${
            isSpeaking
              ? 'bg-amber-400 text-slate-900 border-amber-300 scale-105 transition-transform'
              : 'bg-slate-900/90 text-white border-slate-700'
          }`}
        >
          {name}
        </span>
        {role && (
          <p className="text-[10px] text-slate-300/80 max-w-[140px] truncate mt-0.5 font-medium">
            {role}
          </p>
        )}
      </div>
    </div>
  );
};
