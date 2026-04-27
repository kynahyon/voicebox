/**
 * Voicebox - A text-to-speech utility library
 * Main entry point
 */

import { TTSEngine, TTSOptions, VoiceboxConfig } from './types';
import { createEngine } from './engines';

export class Voicebox {
  private engine: TTSEngine;
  private config: VoiceboxConfig;

  constructor(config: VoiceboxConfig) {
    this.config = {
      rate: 1.0,
      pitch: 1.0,
      volume: 1.0,
      ...config,
    };
    this.engine = createEngine(config.engine ?? 'web-speech', this.config);
  }

  /**
   * Speak the given text using the configured TTS engine.
   * @param text - The text to synthesize
   * @param options - Optional per-utterance overrides
   */
  async speak(text: string, options?: Partial<TTSOptions>): Promise<void> {
    if (!text || text.trim().length === 0) {
      throw new Error('Text must not be empty');
    }

    const utteranceOptions: TTSOptions = {
      rate: options?.rate ?? this.config.rate ?? 1.0,
      pitch: options?.pitch ?? this.config.pitch ?? 1.0,
      volume: options?.volume ?? this.config.volume ?? 1.0,
      voice: options?.voice ?? this.config.voice,
      lang: options?.lang ?? this.config.lang ?? 'en-US',
    };

    await this.engine.speak(text, utteranceOptions);
  }

  /**
   * Stop any currently playing speech.
   */
  stop(): void {
    this.engine.stop();
  }

  /**
   * Pause the current speech utterance.
   */
  pause(): void {
    this.engine.pause?.();
  }

  /**
   * Resume a paused speech utterance.
   */
  resume(): void {
    this.engine.resume?.();
  }

  /**
   * List available voices from the current engine.
   */
  async getVoices(): Promise<SpeechSynthesisVoice[]> {
    return this.engine.getVoices();
  }

  /**
   * Check whether the engine is currently speaking.
   */
  get isSpeaking(): boolean {
    return this.engine.isSpeaking;
  }

  /**
   * Update the global configuration at runtime.
   */
  configure(updates: Partial<VoiceboxConfig>): void {
    this.config = { ...this.config, ...updates };
    this.engine.configure?.(this.config);
  }
}

// Named exports for consumers who prefer direct imports
export { createEngine } from './engines';
export type { TTSEngine, TTSOptions, VoiceboxConfig } from './types';

// Default export for convenience
export default Voicebox;
