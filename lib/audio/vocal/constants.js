import vocalConfig from '@/data/audio/vocal.json';

export const BASE_MIDI = 60;
export const FALLBACK_REGION = vocalConfig.fallbackRegion;
export const FALLBACK_LINE_DURATION_SECONDS = 3.4;
export const MAX_MIDI_STEP = 5;
export const RATE_PER_SEMITONE = 0.012;
export const MIN_PLAYBACK_RATE = 0.86;
export const MAX_PLAYBACK_RATE = 1.18;
export const MIN_SYLLABLE_DURATION_SECONDS = 0.24;
export const MAX_SYLLABLE_DURATION_SECONDS = 0.68;
export const SYLLABLE_OVERLAP_RATIO = 0.95;
export const LATIN_VOWELS = vocalConfig.vowels.latin;
export const CYRILLIC_VOWELS = vocalConfig.vowels.cyrillic;
export const MESPEAK_CONFIG_PATH = vocalConfig.mespeakConfigPath;
export const MESPEAK_VOICES = vocalConfig.voices;
