/**
 * Premium Voice Engine for SM SAAD AI Agent
 * Automatically selects the highest quality neural/natural voices available in the browser.
 */

export interface VoiceOption {
  id: string;
  name: string;
  lang: string;
  isNeural: boolean;
  voice: SpeechSynthesisVoice;
}

class SpeechEngine {
  private voices: SpeechSynthesisVoice[] = [];
  private selectedVoice: SpeechSynthesisVoice | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private onVoicesLoadedCallbacks: Array<(voices: SpeechSynthesisVoice[]) => void> = [];

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.initVoices();
      window.speechSynthesis.onvoiceschanged = () => {
        this.initVoices();
      };
    }
  }

  private initVoices() {
    if (!('speechSynthesis' in window)) return;
    this.voices = window.speechSynthesis.getVoices();
    if (this.voices.length > 0) {
      this.selectedVoice = this.pickBestVoice();
      this.onVoicesLoadedCallbacks.forEach((cb) => cb(this.voices));
    }
  }

  public onVoicesLoaded(cb: (voices: SpeechSynthesisVoice[]) => void) {
    if (this.voices.length > 0) {
      cb(this.voices);
    } else {
      this.onVoicesLoadedCallbacks.push(cb);
    }
  }

  /**
   * Pick the absolute best natural/neural voice available on this device
   */
  public pickBestVoice(preferredGender: 'female' | 'male' | 'any' = 'any'): SpeechSynthesisVoice | null {
    if (this.voices.length === 0) return null;

    const englishVoices = this.voices.filter((v) => v.lang.startsWith('en'));
    const pool = englishVoices.length > 0 ? englishVoices : this.voices;

    // High priority ranked lists
    const priorityKeywordsFemale = [
      'natural',
      'jenny',
      'aria',
      'samantha',
      'karen',
      'google us english',
      'google uk english female',
      'zira',
      'victoria'
    ];

    const priorityKeywordsMale = [
      'natural',
      'guy',
      'christopher',
      'andrew',
      'daniel',
      'google uk english male',
      'david',
      'alex',
      'george'
    ];

    const targetKeywords =
      preferredGender === 'female'
        ? priorityKeywordsFemale
        : preferredGender === 'male'
        ? priorityKeywordsMale
        : [...priorityKeywordsFemale, ...priorityKeywordsMale];

    // 1. Check for Online / Natural Neural voices (Edge / Windows 11 / Chrome / Safari)
    for (const kw of targetKeywords) {
      const match = pool.find((v) => v.name.toLowerCase().includes(kw.toLowerCase()));
      if (match) return match;
    }

    // 2. Fallback to any default English voice
    const defaultVoice = pool.find((v) => v.default) || pool[0];
    return defaultVoice || null;
  }

  public getAvailableVoices(): VoiceOption[] {
    return this.voices
      .filter((v) => v.lang.startsWith('en'))
      .map((v) => ({
        id: v.name,
        name: v.name.replace(/Microsoft |Google |Apple /gi, '').trim(),
        lang: v.lang,
        isNeural: /natural|neural|online|enhanced|premium|siri/i.test(v.name),
        voice: v,
      }));
  }

  public setVoiceByName(name: string) {
    const found = this.voices.find((v) => v.name === name);
    if (found) this.selectedVoice = found;
  }

  /**
   * Cleans text to make it sound fluent, conversational, and human-like
   */
  public cleanTextForSpeech(text: string): string {
    return text
      // Remove code blocks and backticks
      .replace(/```[\s\S]*?```/g, 'Code block omitted.')
      .replace(/`([^`]+)`/g, '$1')
      // Remove Markdown links and URLs
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .replace(/https?:\/\/\S+/g, '')
      // Remove Markdown symbols and headings
      .replace(/^[#*>-]+\s+/gm, '')
      .replace(/[*_~|]/g, '')
      // Expand common acronyms for natural pronunciation
      .replace(/\bVFX\b/g, 'V F X')
      .replace(/\bAI\b/g, 'A I')
      .replace(/\bUI\b/g, 'U I')
      .replace(/\bUX\b/g, 'U X')
      .replace(/\bNLE\b/g, 'N L E')
      .replace(/\be\.g\.,?\b/g, 'for example,')
      .replace(/\bi\.e\.,?\b/g, 'that is,')
      // Clean up whitespace
      .replace(/\s+/g, ' ')
      .trim();
  }

  private chunkQueue: string[] = [];
  private currentChunkIndex: number = 0;
  private isPlayingQueue: boolean = false;
  private keepAliveInterval: any = null;

  /**
   * Split long text into natural sentence chunks to prevent Chrome speech synthesis timeout bugs
   */
  private splitIntoChunks(text: string, maxChunkLength = 180): string[] {
    const sentences = text.match(/[^.!?\n]+[.!?\n]+|[^.!?\n]+$/g) || [text];
    const chunks: string[] = [];
    let currentChunk = '';

    for (const sentence of sentences) {
      const trimmed = sentence.trim();
      if (!trimmed) continue;

      if ((currentChunk + ' ' + trimmed).length <= maxChunkLength) {
        currentChunk = currentChunk ? `${currentChunk} ${trimmed}` : trimmed;
      } else {
        if (currentChunk) chunks.push(currentChunk);
        // If a single sentence is huge, split by commas or words
        if (trimmed.length > maxChunkLength) {
          const parts = trimmed.match(/.{1,160}(\s|$)/g) || [trimmed];
          parts.forEach((p) => {
            const pTrim = p.trim();
            if (pTrim) chunks.push(pTrim);
          });
          currentChunk = '';
        } else {
          currentChunk = trimmed;
        }
      }
    }

    if (currentChunk) chunks.push(currentChunk);
    return chunks.length > 0 ? chunks : [text];
  }

  public speak(
    text: string,
    options: {
      onStart?: () => void;
      onEnd?: () => void;
      onError?: (e: any) => void;
      rate?: number;
      pitch?: number;
    } = {}
  ) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      if (options.onError) options.onError(new Error('Speech synthesis not supported in this browser.'));
      return;
    }

    this.stop();

    // Reload voices if not populated yet
    if (this.voices.length === 0) {
      this.voices = window.speechSynthesis.getVoices();
    }

    const clean = this.cleanTextForSpeech(text);
    if (!clean) {
      if (options.onEnd) options.onEnd();
      return;
    }

    this.chunkQueue = this.splitIntoChunks(clean);
    this.currentChunkIndex = 0;
    this.isPlayingQueue = true;

    // Chrome synthesis engine keep-alive ticker
    this.startKeepAlive();

    const playNextChunk = () => {
      if (!this.isPlayingQueue || this.currentChunkIndex >= this.chunkQueue.length) {
        this.stop();
        if (options.onEnd) options.onEnd();
        return;
      }

      const chunkText = this.chunkQueue[this.currentChunkIndex];
      const utterance = new SpeechSynthesisUtterance(chunkText);
      const voice = this.selectedVoice || this.pickBestVoice();
      if (voice) utterance.voice = voice;

      utterance.rate = options.rate ?? 1.0;
      utterance.pitch = options.pitch ?? 1.02;
      utterance.volume = 1.0;

      utterance.onstart = () => {
        if (this.currentChunkIndex === 0 && options.onStart) {
          options.onStart();
        }
      };

      utterance.onend = () => {
        this.currentChunkIndex++;
        if (this.isPlayingQueue) {
          playNextChunk();
        }
      };

      utterance.onerror = (e) => {
        // If canceled explicitly, don't trigger error
        if (e.error === 'canceled' || e.error === 'interrupted') return;
        this.stop();
        if (options.onError) options.onError(e);
      };

      this.currentUtterance = utterance;

      // Resume if paused
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }

      window.speechSynthesis.speak(utterance);
    };

    // Wake up synthesis
    window.speechSynthesis.resume();
    playNextChunk();
  }

  private startKeepAlive() {
    this.stopKeepAlive();
    this.keepAliveInterval = setInterval(() => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
          window.speechSynthesis.pause();
          window.speechSynthesis.resume();
        }
      }
    }, 10000);
  }

  private stopKeepAlive() {
    if (this.keepAliveInterval) {
      clearInterval(this.keepAliveInterval);
      this.keepAliveInterval = null;
    }
  }

  public stop() {
    this.isPlayingQueue = false;
    this.chunkQueue = [];
    this.currentChunkIndex = 0;
    this.stopKeepAlive();

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      this.currentUtterance = null;
    }
  }

  public isSpeaking(): boolean {
    return this.isPlayingQueue || (typeof window !== 'undefined' && 'speechSynthesis' in window ? window.speechSynthesis.speaking : false);
  }
}

export const speechEngine = new SpeechEngine();
