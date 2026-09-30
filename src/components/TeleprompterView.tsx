import React, { useState, useEffect, useRef } from 'react';
import { ComedyScript, SoundEffectType } from '../types/comedy';
import { playComedySound } from '../utils/audioEngine';
import {
  Play,
  Pause,
  RotateCcw,
  Camera,
  CameraOff,
  Clock,
  Type,
  ChevronsUp,
  ChevronsDown,
  Volume2,
} from 'lucide-react';
import { SoundboardBar } from './SoundboardBar';

interface TeleprompterViewProps {
  script: ComedyScript;
}

export const TeleprompterView: React.FC<TeleprompterViewProps> = ({ script }) => {
  const [isScrolling, setIsScrolling] = useState<boolean>(false);
  const [scrollSpeed, setScrollSpeed] = useState<number>(2); // 1 - 5
  const [fontSize, setFontSize] = useState<number>(28); // in px
  const [remainingSeconds, setRemainingSeconds] = useState<number>(300); // 5 minutes countdown
  const [cameraActive, setCameraActive] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<any>(null);

  // Auto-scroll loop
  useEffect(() => {
    let animId: number;
    const scrollStep = () => {
      if (isScrolling && scrollContainerRef.current) {
        scrollContainerRef.current.scrollTop += scrollSpeed * 0.5;
      }
      animId = requestAnimationFrame(scrollStep);
    };
    animId = requestAnimationFrame(scrollStep);
    return () => cancelAnimationFrame(animId);
  }, [isScrolling, scrollSpeed]);

  // 5-minute countdown clock
  useEffect(() => {
    if (isScrolling) {
      timerRef.current = setInterval(() => {
        setRemainingSeconds((prev) => {
          if (prev <= 1) {
            setIsScrolling(false);
            playComedySound('horn');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isScrolling]);

  // Webcam handling
  const toggleCamera = async () => {
    if (cameraActive) {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
        mediaStreamRef.current = null;
      }
      setCameraActive(false);
    } else {
      try {
        setCameraError(null);
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user', width: 640, height: 480 },
          audio: false,
        });
        mediaStreamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setCameraActive(true);
      } catch (err: any) {
        setCameraError("Impossible d'accéder à la caméra (accès refusé ou indisponible).");
      }
    }
  };

  const handleReset = () => {
    setIsScrolling(false);
    setRemainingSeconds(300);
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }
  };

  const formatCountdown = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col h-[780px]">
      {/* Top Teleprompter Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 bg-slate-900 border-b border-slate-800 z-10">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsScrolling(!isScrolling)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-black text-xs shadow-lg transition-all ${
              isScrolling
                ? 'bg-amber-500 text-slate-950 hover:bg-amber-400'
                : 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 hover:from-emerald-400'
            }`}
          >
            {isScrolling ? (
              <>
                <Pause className="w-4 h-4 fill-current" />
                <span>Pause Défilement</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>Démarrer Répétition (5 min)</span>
              </>
            )}
          </button>

          <button
            onClick={handleReset}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            title="Revenir au début"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* 5:00 countdown clock */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-amber-400 font-mono text-sm font-black shadow-inner">
            <Clock className="w-4 h-4" />
            <span>Chrono : {formatCountdown(remainingSeconds)}</span>
          </div>
        </div>

        {/* Speed & Font adjustments */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Scroll speed */}
          <div className="flex items-center gap-1.5 bg-slate-800 px-2.5 py-1 rounded-lg text-xs text-slate-300 border border-slate-700">
            <span>Vitesse :</span>
            <button
              onClick={() => setScrollSpeed((s) => Math.max(1, s - 1))}
              className="p-1 hover:text-white"
            >
              -
            </button>
            <span className="font-mono font-bold text-amber-400">{scrollSpeed}x</span>
            <button
              onClick={() => setScrollSpeed((s) => Math.min(6, s + 1))}
              className="p-1 hover:text-white"
            >
              +
            </button>
          </div>

          {/* Font size */}
          <div className="flex items-center gap-1.5 bg-slate-800 px-2.5 py-1 rounded-lg text-xs text-slate-300 border border-slate-700">
            <Type className="w-3.5 h-3.5" />
            <button
              onClick={() => setFontSize((s) => Math.max(18, s - 2))}
              className="p-1 hover:text-white"
            >
              -
            </button>
            <span className="font-mono font-bold text-amber-400">{fontSize}px</span>
            <button
              onClick={() => setFontSize((s) => Math.min(46, s + 2))}
              className="p-1 hover:text-white"
            >
              +
            </button>
          </div>

          {/* Webcam mirror */}
          <button
            onClick={toggleCamera}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors ${
              cameraActive
                ? 'bg-red-950 text-red-300 border-red-800'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
            }`}
          >
            {cameraActive ? <CameraOff className="w-3.5 h-3.5" /> : <Camera className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">
              {cameraActive ? 'Couper Caméra' : 'Miroir Caméra'}
            </span>
          </button>
        </div>
      </div>

      {cameraError && (
        <div className="bg-red-950/80 border-b border-red-800 px-4 py-1.5 text-xs text-red-300 text-center">
          {cameraError}
        </div>
      )}

      {/* Main Teleprompter Display & Webcam split */}
      <div className="relative flex-1 flex overflow-hidden">
        {/* Optional Webcam Picture-in-Picture / Split screen */}
        {cameraActive && (
          <div className="absolute top-4 right-4 z-20 w-48 sm:w-64 aspect-[4/3] rounded-2xl overflow-hidden border-2 border-amber-400 shadow-2xl bg-black">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover scale-x-[-1]"
            />
            <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/70 text-[10px] text-amber-400 font-bold uppercase tracking-wider">
              En direct (Toi)
            </div>
          </div>
        )}

        {/* Scrolling Script Canvas */}
        <div
          ref={scrollContainerRef}
          className="flex-1 overflow-y-auto px-6 sm:px-16 py-12 scroll-smooth select-none"
          style={{ fontSize: `${fontSize}px` }}
        >
          {/* Header intro */}
          <div className="text-center mb-16 pb-8 border-b border-slate-800">
            <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 text-xs font-mono font-bold uppercase tracking-widest border border-amber-500/30">
              PROMPTEUR VIDÉO 5 MINUTES
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-white mt-3">{script.title}</h1>
            <p className="text-sm text-slate-400 mt-2 max-w-xl mx-auto">{script.tagline}</p>
          </div>

          {/* Scenes Flow */}
          <div className="space-y-20 max-w-3xl mx-auto">
            {script.scenes.map((scene, sIdx) => {
              const sMin = Math.floor(scene.startTime / 60);
              const sSec = (scene.startTime % 60).toString().padStart(2, '0');

              return (
                <div key={scene.id} className="relative">
                  {/* Scene Marker */}
                  <div className="sticky top-0 bg-slate-950/90 backdrop-blur-md py-2 border-b-2 border-amber-500 mb-6 flex items-center justify-between">
                    <span className="text-base sm:text-lg font-black text-amber-400 tracking-wide uppercase">
                      {scene.title}
                    </span>
                    <span className="text-xs font-mono font-bold text-slate-400">
                      ⏱️ {sMin}:{sSec} ({scene.duration}s)
                    </span>
                  </div>

                  {/* Visual Gag Direction */}
                  {scene.visualGag && (
                    <div className="mb-6 p-3 rounded-xl bg-slate-900 border border-slate-800 text-amber-300 text-sm font-semibold italic">
                      🎬 ACTION : {scene.visualGag}
                    </div>
                  )}

                  {/* Dialogues */}
                  <div className="space-y-8">
                    {scene.dialogues.map((d, dIdx) => (
                      <div key={dIdx} className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-black text-amber-400 text-base sm:text-lg uppercase tracking-wide">
                            {d.speaker}
                          </span>
                          {d.actorDirection && (
                            <span className="text-xs text-slate-400 font-mono italic">
                              {d.actorDirection}
                            </span>
                          )}
                          {d.soundFx && (
                            <button
                              onClick={() => playComedySound(d.soundFx as SoundEffectType)}
                              className="ml-auto px-2 py-0.5 rounded bg-red-950 hover:bg-red-900 text-red-400 text-xs font-mono flex items-center gap-1 border border-red-800 transition-colors"
                            >
                              <Volume2 className="w-3 h-3" />
                              <span>[{d.soundFx}]</span>
                            </button>
                          )}
                        </div>
                        <p className="font-bold text-slate-100 leading-relaxed tracking-wide">
                          "{d.text}"
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}

            {/* Ending note */}
            <div className="text-center py-20 text-slate-600 font-black text-2xl uppercase tracking-widest border-t border-slate-900">
              🎬 FIN DE LA VIDÉO (05:00) 👏
            </div>
          </div>
        </div>
      </div>

      {/* Embedded Live Soundboard Trigger Bar at bottom */}
      <div className="p-3 bg-slate-900 border-t border-slate-800">
        <SoundboardBar compact />
      </div>
    </div>
  );
};
