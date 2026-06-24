import musicSettings from '@/data/music/settings.json';

export const MIX_SETTINGS = musicSettings.mix;

export const KEYS = musicSettings.keys;
export const MODES = musicSettings.modes;
export const TEMPO_RANGES = musicSettings.tempoRanges;

export const CHORD_SECONDS = musicSettings.timing.chordSeconds;
export const GROOVE_LOOP_SECONDS = musicSettings.timing.grooveLoopSeconds;
export const MELODY_STEP_SECONDS = musicSettings.timing.fallbackMelodyStepSeconds;
export const NOTE_STEP_SECONDS = musicSettings.timing.noteStepSeconds;

export const SECTION_CONFIGS = musicSettings.sections;

export const PROGRESSIONS = musicSettings.progressions;
export const CHORD_TYPES = musicSettings.chordTypes;
export const DEGREE_INDEXES = musicSettings.degreeIndexes;
export const FALLBACK_SCALES = musicSettings.fallbackScales;

export const GROOVES = musicSettings.grooves;
export const MELODY_SETTINGS = musicSettings.melody;
export const SYNTH_PRESETS = musicSettings.synthPresets;