// Speech synthesis manager with character voice customization

let currentUtterance: SpeechSynthesisUtterance | null = null;
let voices: SpeechSynthesisVoice[] = [];

if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  const updateVoices = () => {
    voices = window.speechSynthesis.getVoices();
  };
  updateVoices();
  window.speechSynthesis.onvoiceschanged = updateVoices;
}

export function getAvailableVoices(): SpeechSynthesisVoice[] {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return [];
  if (voices.length === 0) {
    voices = window.speechSynthesis.getVoices();
  }
  return voices;
}

export interface SpeakOptions {
  text: string;
  pitch?: number; // 0.5 to 2
  rate?: number; // 0.5 to 2
  lang?: string;
  onStart?: () => void;
  onEnd?: () => void;
  onError?: () => void;
}

export function speakLine(options: SpeakOptions): Promise<void> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      // Speech synthesis not supported, resolve after simulated duration
      const simulatedTime = Math.max(1200, options.text.length * 70);
      options.onStart?.();
      setTimeout(() => {
        options.onEnd?.();
        resolve();
      }, simulatedTime);
      return;
    }

    // Cancel any previous speech
    window.speechSynthesis.cancel();

    // Clean text: strip directions inside brackets [comme ceci]
    const cleanText = options.text.replace(/\[.*?\]/g, '').trim();
    if (!cleanText) {
      resolve();
      return;
    }

    const utterance = new SpeechSynthesisUtterance(cleanText);
    currentUtterance = utterance;

    utterance.pitch = Math.max(0.5, Math.min(2.0, options.pitch ?? 1.0));
    utterance.rate = Math.max(0.7, Math.min(1.6, options.rate ?? 1.05));

    // Choose best voice for French or specified language
    const lang = options.lang || 'fr';
    const allVoices = getAvailableVoices();
    const matchingVoice =
      allVoices.find((v) => v.lang.startsWith(lang)) ||
      allVoices.find((v) => v.lang.startsWith('en')) ||
      allVoices[0];

    if (matchingVoice) {
      utterance.voice = matchingVoice;
    }

    let hasEnded = false;
    const finish = () => {
      if (!hasEnded) {
        hasEnded = true;
        currentUtterance = null;
        options.onEnd?.();
        resolve();
      }
    };

    utterance.onstart = () => {
      options.onStart?.();
    };

    utterance.onend = finish;
    utterance.onerror = () => {
      options.onError?.();
      finish();
    };

    // Safety timeout in case speech engine hangs
    const maxTimeout = Math.max(3000, cleanText.length * 120);
    setTimeout(finish, maxTimeout);

    try {
      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.warn('Speech error:', err);
      finish();
    }
  });
}

export function stopSpeaking() {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    currentUtterance = null;
  }
}
