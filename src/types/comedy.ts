export type EmotionType =
  | 'neutral'
  | 'shocked'
  | 'happy'
  | 'angry'
  | 'laughing'
  | 'confused'
  | 'smug';

export type SoundEffectType =
  | 'rimshot'
  | 'sad_trombone'
  | 'laugh_track'
  | 'boing'
  | 'record_scratch'
  | 'crickets'
  | 'dramatic_dun'
  | 'vine_boom'
  | 'applause'
  | 'slap'
  | 'horn';

export type BackgroundKey =
  | 'office'
  | 'kitchen'
  | 'scifi'
  | 'detective'
  | 'stage'
  | 'park'
  | 'newsroom'
  | 'street';

export interface DialogueLine {
  id?: string;
  speaker: string;
  text: string;
  actorDirection?: string;
  emotion: EmotionType;
  soundFx?: SoundEffectType | null;
  sticker?: string | null;
}

export interface ComedyScene {
  id: string;
  title: string;
  startTime: number; // in seconds from start
  duration: number; // in seconds
  location: string;
  backgroundKey: BackgroundKey;
  visualGag: string;
  musicMood: 'goofy' | 'tense_funny' | 'upbeat' | 'awkward';
  dialogues: DialogueLine[];
}

export interface Character {
  name: string;
  role: string;
  voicePitch: number; // 0.6 - 1.5
  voiceRate: number; // 0.8 - 1.3
  avatarColor: string;
  catchphrase?: string;
}

export interface ComedyScript {
  title: string;
  tagline: string;
  synopsis: string;
  genre: string;
  totalDurationSeconds: number; // ~300s (5 minutes)
  characters: Character[];
  scenes: ComedyScene[];
}
