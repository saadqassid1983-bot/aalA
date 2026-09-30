import React, { useState, useEffect, useRef } from 'react';
import { ComedyScript, SoundEffectType } from '../types/comedy';
import { AnimatedCharacter } from './AnimatedCharacter';
import { SceneBackground } from './SceneBackground';
import { playComedySound, startComedyMusic, stopComedyMusic, isMusicActive } from '../utils/audioEngine';
import { speakLine, stopSpeaking } from '../utils/speechEngine';
import {
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  SkipBack,
  Volume2,
  VolumeX,
  Music,
  Maximize2,
  Minimize2,
  Sparkles,
} from 'lucide-react';

interface VideoPlayerStageProps {
  script: ComedyScript;
  onSceneChange?: (sceneIndex: number) => void;
  onExportRequested?: () => void;
}

export const VideoPlayerStage: React.FC<VideoPlayerStageProps> = ({
  script,
  onSceneChange,
  onExportRequested,
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentSceneIndex, setCurrentSceneIndex] = useState<number>(0);
  const [currentDialogueIndex, setCurrentDialogueIndex] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<number>(0); // in seconds
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [activeSpeaker, setActiveSpeaker] = useState<string | null>(null);
  const [currentSfx, setCurrentSfx] = useState<SoundEffectType | null>(null);
  const [activeSticker, setActiveSticker] = useState<string | null>(null);
  const [musicEnabled, setMusicEnabled] = useState<boolean>(true);
  const [voiceEnabled, setVoiceEnabled] = useState<boolean>(true);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);

  const containerRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<any>(null);
  const dialogueTimerRef = useRef<any>(null);

  const currentScene = script.scenes[currentSceneIndex] || script.scenes[0];
  const currentDialogue = currentScene?.dialogues[currentDialogueIndex];
  const totalDuration = script.totalDurationSeconds || 300;

  // Format seconds to MM:SS
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Music toggle effect
  useEffect(() => {
    if (isPlaying && musicEnabled) {
      startComedyMusic(currentScene?.musicMood || 'goofy');
    } else {
      stopComedyMusic();
    }
    return () => {
      stopComedyMusic();
    };
  }, [isPlaying, musicEnabled, currentSceneIndex]);

  // Main playback timer
  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setCurrentTime((prev) => {
          const next = prev + 0.5 * playbackSpeed;
          if (next >= totalDuration) {
            handlePause();
            return totalDuration;
          }
          return next;
        });
      }, 500);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isPlaying, playbackSpeed, totalDuration]);

  // Dialogue progression when playing
  useEffect(() => {
    if (!isPlaying || !currentDialogue) return;

    setActiveSpeaker(currentDialogue.speaker);
    setIsSpeaking(true);

    // Trigger Sound effect if defined on this dialogue
    if (currentDialogue.soundFx) {
      playComedySound(currentDialogue.soundFx);
      setCurrentSfx(currentDialogue.soundFx);
      setTimeout(() => setCurrentSfx(null), 1200);
    }

    // Trigger Sticker popup
    if (currentDialogue.sticker) {
      setActiveSticker(currentDialogue.sticker);
      setTimeout(() => setActiveSticker(null), 1800);
    }

    // Find character pitch and speed
    const speakerChar = script.characters.find((c) => c.name === currentDialogue.speaker);

    if (voiceEnabled) {
      speakLine({
        text: currentDialogue.text,
        pitch: speakerChar?.voicePitch || 1.0,
        rate: (speakerChar?.voiceRate || 1.0) * playbackSpeed,
        onStart: () => setIsSpeaking(true),
        onEnd: () => {
          setIsSpeaking(false);
          // Wait brief comedic pause then proceed to next line
          dialogueTimerRef.current = setTimeout(() => {
            advanceNextLine();
          }, 800 / playbackSpeed);
        },
        onError: () => {
          setIsSpeaking(false);
          dialogueTimerRef.current = setTimeout(() => {
            advanceNextLine();
          }, 1200 / playbackSpeed);
        },
      });
    } else {
      // Speech disabled, simulate duration based on text length
      const readingDuration = Math.max(1800, currentDialogue.text.length * 65) / playbackSpeed;
      dialogueTimerRef.current = setTimeout(() => {
        setIsSpeaking(false);
        advanceNextLine();
      }, readingDuration);
    }

    return () => {
      clearTimeout(dialogueTimerRef.current);
      stopSpeaking();
    };
  }, [isPlaying, currentSceneIndex, currentDialogueIndex, voiceEnabled, playbackSpeed]);

  const advanceNextLine = () => {
    if (currentDialogueIndex < currentScene.dialogues.length - 1) {
      setCurrentDialogueIndex((prev) => prev + 1);
    } else {
      // End of scene, advance to next scene
      if (currentSceneIndex < script.scenes.length - 1) {
        jumpToScene(currentSceneIndex + 1);
      } else {
        // End of video!
        handlePause();
        setCurrentTime(totalDuration);
      }
    }
  };

  const handlePlay = () => {
    setIsPlaying(true);
    if (musicEnabled) {
      startComedyMusic(currentScene?.musicMood || 'goofy');
    }
  };

  const handlePause = () => {
    setIsPlaying(false);
    setIsSpeaking(false);
    stopSpeaking();
    stopComedyMusic();
    clearTimeout(dialogueTimerRef.current);
  };

  const handleRestart = () => {
    handlePause();
    setCurrentSceneIndex(0);
    setCurrentDialogueIndex(0);
    setCurrentTime(0);
    onSceneChange?.(0);
  };

  const jumpToScene = (index: number) => {
    if (index >= 0 && index < script.scenes.length) {
      setCurrentSceneIndex(index);
      setCurrentDialogueIndex(0);
      setCurrentTime(script.scenes[index].startTime);
      onSceneChange?.(index);
    }
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch((err) => console.log(err));
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch((err) => console.log(err));
      setIsFullscreen(false);
    }
  };

  // Map characters in scene to screen positions
  const getCharacterPlacement = (speakerName: string, index: number, total: number) => {
    if (total === 1) return 'center';
    if (total === 2) return index === 0 ? 'left' : 'right';
    return index === 0 ? 'left' : index === 1 ? 'center' : 'right';
  };

  return (
    <div
      ref={containerRef}
      className={`relative flex flex-col bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 shadow-2xl ${
        isFullscreen ? 'w-full h-full rounded-none' : 'w-full'
      }`}
    >
      {/* Top Video Header / Scene info */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900/90 border-b border-slate-800 z-20">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
          <span className="text-xs font-black uppercase tracking-wider text-amber-400">
            {script.title}
          </span>
          <span className="hidden sm:inline text-xs text-slate-400">
            • {currentScene?.title}
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Quick Scene Jump Dropdown */}
          <select
            value={currentSceneIndex}
            onChange={(e) => jumpToScene(parseInt(e.target.value))}
            className="bg-slate-800 text-xs text-slate-200 border border-slate-700 rounded-lg px-2 py-1 outline-none font-medium cursor-pointer"
          >
            {script.scenes.map((s, idx) => (
              <option key={s.id} value={idx}>
                {s.title} ({formatTime(s.startTime)})
              </option>
            ))}
          </select>

          {/* Time Counter 00:00 / 05:00 */}
          <div className="px-2.5 py-1 rounded bg-slate-950 border border-slate-800 font-mono text-xs font-bold text-amber-400">
            {formatTime(currentTime)} / {formatTime(totalDuration)}
          </div>

          <button
            onClick={toggleFullscreen}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white transition-colors"
            title="Plein écran"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main 16:9 Animated Video Viewport */}
      <div className="relative w-full aspect-[16/9] max-h-[560px] bg-slate-950 overflow-hidden flex items-end justify-center select-none">
        {/* Animated Visual Background */}
        <SceneBackground
          backgroundKey={currentScene?.backgroundKey || 'kitchen'}
          locationName={currentScene?.location}
          isPanicking={currentDialogue?.emotion === 'shocked' || currentDialogue?.emotion === 'angry'}
        />

        {/* Comic Visual Gag & Sticker Flash Overlay */}
        {activeSticker && (
          <div className="absolute top-1/4 z-30 animate-bounce pointer-events-none">
            <div className="px-5 py-2.5 rounded-2xl bg-amber-400 text-slate-950 font-black text-2xl sm:text-3xl tracking-wider shadow-[0_10px_25px_rgba(245,158,11,0.6)] border-4 border-slate-950 -rotate-6">
              {activeSticker}
            </div>
          </div>
        )}

        {/* Visual sound effect ripple badge */}
        {currentSfx && (
          <div className="absolute top-12 right-6 z-30 animate-pulse pointer-events-none">
            <div className="px-3 py-1.5 rounded-lg bg-red-600/90 text-white font-mono font-bold text-xs uppercase tracking-widest shadow-lg border border-red-400 flex items-center gap-1.5">
              <span>🔊</span> {currentSfx.replace('_', ' ')}
            </div>
          </div>
        )}

        {/* Visual Gag Banner on scene start */}
        {currentScene?.visualGag && (
          <div className="absolute top-12 left-1/2 -translate-x-1/2 z-10 max-w-[85%] px-3 py-1 rounded-full bg-slate-950/70 backdrop-blur-sm border border-slate-700 text-slate-300 text-[11px] font-medium text-center shadow-md">
            🎬 Gag visuel : {currentScene.visualGag}
          </div>
        )}

        {/* Animated Characters on Stage */}
        <div className="relative z-20 w-full px-6 sm:px-12 pb-24 sm:pb-28 flex items-end justify-around max-w-4xl">
          {script.characters.map((char, index) => {
            const isSpeakingNow = isSpeaking && activeSpeaker === char.name;
            const currentEmotion =
              isSpeakingNow && currentDialogue
                ? currentDialogue.emotion
                : 'neutral';
            const position = getCharacterPlacement(
              char.name,
              index,
              script.characters.length
            );

            return (
              <div key={char.name} className="relative">
                {/* Speech Bubble popping from character when speaking */}
                {isSpeakingNow && currentDialogue && (
                  <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-48 sm:w-64 z-30 pointer-events-none animate-in fade-in zoom-in duration-200">
                    <div className="relative px-3.5 py-2 bg-white text-slate-950 text-xs sm:text-sm font-bold rounded-2xl shadow-2xl border-2 border-slate-900 leading-snug">
                      <p className="line-clamp-3">{currentDialogue.text}</p>
                      {/* Triangle pointer */}
                      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[8px] border-t-slate-900" />
                      <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[7px] border-l-transparent border-r-[7px] border-r-transparent border-t-[7px] border-t-white" />
                    </div>
                  </div>
                )}

                <AnimatedCharacter
                  name={char.name}
                  role={char.role}
                  color={char.avatarColor}
                  emotion={currentEmotion}
                  isSpeaking={isSpeakingNow}
                  position={position}
                  highlight={isSpeakingNow}
                />
              </div>
            );
          })}
        </div>

        {/* Kinetic Subtitles & Punchline Box at Bottom */}
        <div className="absolute bottom-2 left-4 right-4 z-30 pointer-events-none">
          {currentDialogue ? (
            <div className="max-w-2xl mx-auto px-4 py-2.5 rounded-xl bg-slate-950/85 backdrop-blur-md border border-slate-800 text-center shadow-2xl">
              <div className="flex items-center justify-center gap-2 mb-0.5">
                <span className="text-xs font-black text-amber-400 tracking-wide uppercase">
                  {currentDialogue.speaker}
                </span>
                {currentDialogue.actorDirection && (
                  <span className="text-[11px] text-slate-400 italic font-mono">
                    {currentDialogue.actorDirection}
                  </span>
                )}
              </div>
              <p className="text-sm sm:text-base font-black text-white tracking-wide drop-shadow-md">
                "{currentDialogue.text}"
              </p>
            </div>
          ) : (
            <div className="max-w-md mx-auto px-4 py-2 rounded-xl bg-slate-950/60 backdrop-blur-sm text-center text-xs text-slate-400">
              Prêt pour la comédie. Appuyez sur Lecture !
            </div>
          )}
        </div>
      </div>

      {/* 5-Minute Scene Timeline Bar (0:00 -> 05:00) */}
      <div className="px-4 py-2 bg-slate-900 border-t border-slate-800">
        <div className="relative w-full h-3 bg-slate-950 rounded-full overflow-hidden cursor-pointer">
          {/* Progress fill */}
          <div
            className="absolute top-0 bottom-0 left-0 bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full transition-all duration-300 shadow-md"
            style={{ width: `${(currentTime / totalDuration) * 100}%` }}
          />

          {/* Scene cut markers */}
          {script.scenes.map((s, idx) => {
            const leftPercent = (s.startTime / totalDuration) * 100;
            return (
              <div
                key={s.id}
                className="absolute top-0 bottom-0 w-0.5 bg-slate-600/80 hover:bg-white transition-colors"
                style={{ left: `${leftPercent}%` }}
                title={`${s.title} (${formatTime(s.startTime)})`}
                onClick={(e) => {
                  e.stopPropagation();
                  jumpToScene(idx);
                }}
              />
            );
          })}
        </div>

        {/* Scene Labels beneath timeline */}
        <div className="flex justify-between items-center mt-1 text-[10px] text-slate-400 font-mono">
          <span>00:00 (Intro)</span>
          <span>01:15 (Escalade)</span>
          <span>02:30 (Chaos)</span>
          <span>03:45 (Twist)</span>
          <span>05:00 (Chute)</span>
        </div>
      </div>

      {/* Media Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 bg-slate-950 border-t border-slate-800 z-20">
        {/* Playback action buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={isPlaying ? handlePause : handlePlay}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl font-bold text-xs shadow-lg transition-all transform active:scale-95 ${
              isPlaying
                ? 'bg-amber-500 text-slate-950 hover:bg-amber-400'
                : 'bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-950 hover:from-amber-300 hover:to-yellow-300'
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4 fill-current" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>Lancer la Vidéo (5 min)</span>
              </>
            )}
          </button>

          <button
            onClick={handleRestart}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            title="Recommencer depuis le début"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={() => jumpToScene(Math.max(0, currentSceneIndex - 1))}
            disabled={currentSceneIndex === 0}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-40 transition-colors"
            title="Scène précédente"
          >
            <SkipBack className="w-4 h-4" />
          </button>

          <button
            onClick={() => jumpToScene(Math.min(script.scenes.length - 1, currentSceneIndex + 1))}
            disabled={currentSceneIndex === script.scenes.length - 1}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-40 transition-colors"
            title="Scène suivante"
          >
            <SkipForward className="w-4 h-4" />
          </button>
        </div>

        {/* Audio & Speed toggles */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Voice Speech Toggle */}
          <button
            onClick={() => setVoiceEnabled(!voiceEnabled)}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
              voiceEnabled
                ? 'bg-slate-800 text-slate-200 border-slate-700'
                : 'bg-red-950/60 text-red-400 border-red-900'
            }`}
            title="Voix vocale (TTS)"
          >
            {voiceEnabled ? <Volume2 className="w-3.5 h-3.5 text-emerald-400" /> : <VolumeX className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">Voix IA</span>
          </button>

          {/* Comedy Music Groove Toggle */}
          <button
            onClick={() => setMusicEnabled(!musicEnabled)}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
              musicEnabled
                ? 'bg-slate-800 text-slate-200 border-slate-700'
                : 'bg-slate-900 text-slate-500 border-slate-800'
            }`}
            title="Musique de fond comique"
          >
            <Music className={`w-3.5 h-3.5 ${musicEnabled ? 'text-amber-400' : 'text-slate-600'}`} />
            <span className="hidden sm:inline">Musique Comique</span>
          </button>

          {/* Playback speed selector */}
          <select
            value={playbackSpeed}
            onChange={(e) => setPlaybackSpeed(parseFloat(e.target.value))}
            className="bg-slate-800 text-xs text-slate-200 border border-slate-700 rounded-lg px-2 py-1 outline-none font-semibold cursor-pointer"
          >
            <option value="0.75">0.75x</option>
            <option value="1.0">1.0x (Normal)</option>
            <option value="1.25">1.25x (Rythmé)</option>
            <option value="1.5">1.5x (Rapide)</option>
          </select>

          {/* Export video trigger button */}
          {onExportRequested && (
            <button
              onClick={onExportRequested}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold text-xs shadow-md hover:from-emerald-400 hover:to-teal-400 transition-all"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Exporter Vidéo</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
