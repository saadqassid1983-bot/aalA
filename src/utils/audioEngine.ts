import { SoundEffectType } from '../types/comedy';

let audioCtx: AudioContext | null = null;
let musicInterval: any = null;
let isMusicPlaying = false;
let masterGain: GainNode | null = null;
let musicGain: GainNode | null = null;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    audioCtx = new AudioContextClass();
    masterGain = audioCtx.createGain();
    masterGain.gain.setValueAtTime(0.8, audioCtx.currentTime);
    masterGain.connect(audioCtx.destination);

    musicGain = audioCtx.createGain();
    musicGain.gain.setValueAtTime(0.3, audioCtx.currentTime);
    musicGain.connect(masterGain);
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function setMasterVolume(volume: number) {
  if (masterGain && audioCtx) {
    masterGain.gain.setValueAtTime(Math.max(0, Math.min(1, volume)), audioCtx.currentTime);
  }
}

export function setMusicVolume(volume: number) {
  if (musicGain && audioCtx) {
    musicGain.gain.setValueAtTime(Math.max(0, Math.min(1, volume)), audioCtx.currentTime);
  }
}

/**
 * Synthesizes comedic sound effects using Web Audio API
 */
export function playComedySound(type: SoundEffectType, volume: number = 0.8) {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    const fxGain = ctx.createGain();
    fxGain.gain.setValueAtTime(volume, now);
    fxGain.connect(masterGain || ctx.destination);

    switch (type) {
      case 'rimshot': {
        // Ba-dum tss!
        // 1. Kick / Tom 1 (Ba)
        const osc1 = ctx.createOscillator();
        const g1 = ctx.createGain();
        osc1.frequency.setValueAtTime(140, now);
        osc1.frequency.exponentialRampToValueAtTime(40, now + 0.12);
        g1.gain.setValueAtTime(0.7, now);
        g1.gain.exponentialRampToValueAtTime(0.01, now + 0.12);
        osc1.connect(g1);
        g1.connect(fxGain);
        osc1.start(now);
        osc1.stop(now + 0.12);

        // 2. Snare (Dum)
        const osc2 = ctx.createOscillator();
        const g2 = ctx.createGain();
        osc2.frequency.setValueAtTime(180, now + 0.14);
        osc2.frequency.exponentialRampToValueAtTime(60, now + 0.28);
        g2.gain.setValueAtTime(0.8, now + 0.14);
        g2.gain.exponentialRampToValueAtTime(0.01, now + 0.28);
        osc2.connect(g2);
        g2.connect(fxGain);
        osc2.start(now + 0.14);
        osc2.stop(now + 0.28);

        // 3. Cymbal crash / sizzle (Tssss)
        const bufferSize = ctx.sampleRate * 0.45;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.15));
        }
        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        const cymbalFilter = ctx.createBiquadFilter();
        cymbalFilter.type = 'highpass';
        cymbalFilter.frequency.setValueAtTime(6000, now + 0.28);
        const cymbalGain = ctx.createGain();
        cymbalGain.gain.setValueAtTime(0.9, now + 0.28);
        cymbalGain.gain.exponentialRampToValueAtTime(0.01, now + 0.7);

        noise.connect(cymbalFilter);
        cymbalFilter.connect(cymbalGain);
        cymbalGain.connect(fxGain);
        noise.start(now + 0.28);
        break;
      }

      case 'sad_trombone': {
        // Wah - wah - wah - waaaaah (descending comedic notes: D4, C#4, C4, B3)
        const notes = [
          { f: 293.66, t: 0.0, d: 0.28 },
          { f: 277.18, t: 0.32, d: 0.28 },
          { f: 261.63, t: 0.64, d: 0.28 },
          { f: 246.94, t: 0.96, d: 0.75, slide: 220 },
        ];

        notes.forEach((n) => {
          const osc = ctx.createOscillator();
          const g = ctx.createGain();
          const filter = ctx.createBiquadFilter();

          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(n.f, now + n.t);
          if (n.slide) {
            osc.frequency.linearRampToValueAtTime(n.slide, now + n.t + n.d);
          }

          // Wah filter effect
          filter.type = 'lowpass';
          filter.frequency.setValueAtTime(300, now + n.t);
          filter.frequency.exponentialRampToValueAtTime(1400, now + n.t + 0.1);
          filter.frequency.exponentialRampToValueAtTime(400, now + n.t + n.d);

          g.gain.setValueAtTime(0.01, now + n.t);
          g.gain.linearRampToValueAtTime(0.6, now + n.t + 0.05);
          g.gain.exponentialRampToValueAtTime(0.01, now + n.t + n.d);

          osc.connect(filter);
          filter.connect(g);
          g.connect(fxGain);

          osc.start(now + n.t);
          osc.stop(now + n.t + n.d + 0.05);
        });
        break;
      }

      case 'laugh_track': {
        // Simulated audience chuckles & laughter bursts
        for (let i = 0; i < 9; i++) {
          const startOffset = Math.random() * 0.4;
          const osc = ctx.createOscillator();
          const g = ctx.createGain();
          const filter = ctx.createBiquadFilter();

          osc.type = i % 2 === 0 ? 'triangle' : 'sawtooth';
          const baseFreq = 220 + Math.random() * 180;
          osc.frequency.setValueAtTime(baseFreq, now + startOffset);
          // Vibrato for giggle
          for (let step = 0; step < 6; step++) {
            const time = now + startOffset + step * 0.12;
            osc.frequency.setValueAtTime(baseFreq + (step % 2 === 0 ? 40 : -30), time);
          }

          filter.type = 'bandpass';
          filter.frequency.setValueAtTime(900 + Math.random() * 400, now);
          filter.Q.setValueAtTime(3, now);

          g.gain.setValueAtTime(0.01, now + startOffset);
          g.gain.linearRampToValueAtTime(0.25, now + startOffset + 0.1);
          g.gain.exponentialRampToValueAtTime(0.01, now + startOffset + 0.9);

          osc.connect(filter);
          filter.connect(g);
          g.connect(fxGain);

          osc.start(now + startOffset);
          osc.stop(now + startOffset + 0.95);
        }
        break;
      }

      case 'boing': {
        // Cartoon spring boing
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(160, now);
        osc.frequency.exponentialRampToValueAtTime(750, now + 0.35);

        // Add rapid pitch wobble
        const lfo = ctx.createOscillator();
        const lfoGain = ctx.createGain();
        lfo.frequency.setValueAtTime(24, now);
        lfoGain.gain.setValueAtTime(35, now);
        lfo.connect(lfoGain);
        lfoGain.connect(osc.frequency);
        lfo.start(now);
        lfo.stop(now + 0.45);

        g.gain.setValueAtTime(0.7, now);
        g.gain.exponentialRampToValueAtTime(0.01, now + 0.45);

        osc.connect(g);
        g.connect(fxGain);
        osc.start(now);
        osc.stop(now + 0.45);
        break;
      }

      case 'record_scratch': {
        // Vinyl record stop scratch
        const bufferSize = ctx.sampleRate * 0.28;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = (Math.random() * 2 - 1) * Math.sin((i / bufferSize) * Math.PI * 40);
        }
        const noise = ctx.createBufferSource();
        noise.buffer = buffer;

        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(1800, now);
        filter.frequency.exponentialRampToValueAtTime(250, now + 0.28);
        filter.Q.setValueAtTime(4, now);

        const g = ctx.createGain();
        g.gain.setValueAtTime(0.8, now);
        g.gain.exponentialRampToValueAtTime(0.01, now + 0.28);

        noise.connect(filter);
        filter.connect(g);
        g.connect(fxGain);
        noise.start(now);
        break;
      }

      case 'crickets': {
        // Awkward cricket chirps
        for (let burst = 0; burst < 3; burst++) {
          const bTime = now + burst * 0.35;
          for (let pulse = 0; pulse < 3; pulse++) {
            const pTime = bTime + pulse * 0.04;
            const osc = ctx.createOscillator();
            const g = ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(4600 + Math.random() * 200, pTime);
            g.gain.setValueAtTime(0.3, pTime);
            g.gain.exponentialRampToValueAtTime(0.01, pTime + 0.03);
            osc.connect(g);
            g.connect(fxGain);
            osc.start(pTime);
            osc.stop(pTime + 0.035);
          }
        }
        break;
      }

      case 'dramatic_dun': {
        // Dramatic dun-dun-DUUUN!
        const chord1 = [130.81, 155.56, 196.0]; // C minor
        const chord2 = [123.47, 146.83, 185.0]; // B minor
        const chord3 = [110.0, 130.81, 164.81]; // A minor big hit

        const playHit = (freqs: number[], time: number, dur: number, vol: number) => {
          freqs.forEach((f) => {
            const osc = ctx.createOscillator();
            const g = ctx.createGain();
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(f, time);
            g.gain.setValueAtTime(vol, time);
            g.gain.exponentialRampToValueAtTime(0.01, time + dur);
            osc.connect(g);
            g.connect(fxGain);
            osc.start(time);
            osc.stop(time + dur);
          });
        };

        playHit(chord1, now, 0.2, 0.5);
        playHit(chord2, now + 0.25, 0.2, 0.6);
        playHit(chord3, now + 0.52, 0.9, 0.9);
        break;
      }

      case 'vine_boom': {
        // Deep sub-bass thud & explosion
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(95, now);
        osc.frequency.exponentialRampToValueAtTime(32, now + 0.45);
        g.gain.setValueAtTime(1.0, now);
        g.gain.exponentialRampToValueAtTime(0.001, now + 0.85);

        // Sub layer
        const sub = ctx.createOscillator();
        const subGain = ctx.createGain();
        sub.type = 'triangle';
        sub.frequency.setValueAtTime(55, now);
        sub.frequency.exponentialRampToValueAtTime(28, now + 0.6);
        subGain.gain.setValueAtTime(0.8, now);
        subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.7);

        osc.connect(g);
        g.connect(fxGain);
        sub.connect(subGain);
        subGain.connect(fxGain);

        osc.start(now);
        osc.stop(now + 0.9);
        sub.start(now);
        sub.stop(now + 0.75);
        break;
      }

      case 'applause': {
        // Crowd cheering clapping
        const bufferSize = ctx.sampleRate * 0.9;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = (Math.random() * 2 - 1) * (0.5 + 0.5 * Math.sin(i / 1500));
        }
        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(1200, now);
        filter.Q.setValueAtTime(1.2, now);
        const g = ctx.createGain();
        g.gain.setValueAtTime(0.1, now);
        g.gain.linearRampToValueAtTime(0.7, now + 0.2);
        g.gain.exponentialRampToValueAtTime(0.01, now + 0.9);

        noise.connect(filter);
        filter.connect(g);
        g.connect(fxGain);
        noise.start(now);
        break;
      }

      case 'slap': {
        // Comedic slap
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(320, now);
        osc.frequency.exponentialRampToValueAtTime(90, now + 0.08);
        g.gain.setValueAtTime(0.9, now);
        g.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
        osc.connect(g);
        g.connect(fxGain);
        osc.start(now);
        osc.stop(now + 0.09);
        break;
      }

      case 'horn': {
        // Cartoon clown honk-honk
        [0, 0.12].forEach((t) => {
          const osc1 = ctx.createOscillator();
          const osc2 = ctx.createOscillator();
          const g = ctx.createGain();
          osc1.type = 'square';
          osc2.type = 'square';
          osc1.frequency.setValueAtTime(392, now + t);
          osc2.frequency.setValueAtTime(440, now + t);
          g.gain.setValueAtTime(0.4, now + t);
          g.gain.exponentialRampToValueAtTime(0.01, now + t + 0.09);
          osc1.connect(g);
          osc2.connect(g);
          g.connect(fxGain);
          osc1.start(now + t);
          osc2.start(now + t);
          osc1.stop(now + t + 0.1);
          osc2.stop(now + t + 0.1);
        });
        break;
      }
    }
  } catch (err) {
    console.warn('Audio playback error:', err);
  }
}

/**
 * Background comedy music groove synthesizer
 * Plays a lighthearted, jaunty comedic baseline & synth melody in loop
 */
export function startComedyMusic(mood: string = 'goofy') {
  if (isMusicPlaying) return;
  const ctx = getAudioContext();
  isMusicPlaying = true;

  const notes =
    mood === 'tense_funny'
      ? [196, 207.65, 196, 185, 196, 220, 196, 174.61]
      : mood === 'upbeat'
      ? [261.63, 329.63, 392, 523.25, 440, 392, 329.63, 293.66]
      : [220, 246.94, 261.63, 293.66, 329.63, 293.66, 261.63, 196]; // playful goofy loop

  let step = 0;
  const intervalTime = 320; // ms per beat

  musicInterval = setInterval(() => {
    if (!isMusicPlaying) return;
    try {
      const now = ctx.currentTime;
      const freq = notes[step % notes.length];
      step++;

      // Bass plink
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = step % 4 === 0 ? 'triangle' : 'sine';
      osc.frequency.setValueAtTime(freq / 2, now);
      g.gain.setValueAtTime(0.18, now);
      g.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
      osc.connect(g);
      g.connect(musicGain || ctx.destination);
      osc.start(now);
      osc.stop(now + 0.3);

      // Cute playful marimba/synth on every other beat
      if (step % 2 === 0) {
        const highOsc = ctx.createOscillator();
        const highG = ctx.createGain();
        highOsc.type = 'triangle';
        highOsc.frequency.setValueAtTime(freq * 1.5, now + 0.05);
        highG.gain.setValueAtTime(0.08, now + 0.05);
        highG.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
        highOsc.connect(highG);
        highG.connect(musicGain || ctx.destination);
        highOsc.start(now + 0.05);
        highOsc.stop(now + 0.24);
      }
    } catch (e) {
      // Audio node cleanup
    }
  }, intervalTime);
}

export function stopComedyMusic() {
  isMusicPlaying = false;
  if (musicInterval) {
    clearInterval(musicInterval);
    musicInterval = null;
  }
}

export function isMusicActive(): boolean {
  return isMusicPlaying;
}
