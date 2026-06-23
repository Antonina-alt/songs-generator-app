export const KEYS = ['C', 'D', 'E', 'F', 'G', 'A', 'Bb'];
export const MODES = ['major', 'minor'];
export const MELODY_STEP_SECONDS = 0.35;
export const CHORD_SECONDS = 2;
export const GROOVE_LOOP_SECONDS = 8;

export const PROGRESSIONS = {
    major: [['I', 'V', 'vi', 'IV'], ['I', 'vi', 'IV', 'V'], ['vi', 'IV', 'I', 'V'], ['I', 'IV', 'V', 'I'], ['ii', 'V', 'I', 'vi']],
    minor: [['i', 'VI', 'III', 'VII'], ['i', 'VII', 'VI', 'VII'], ['i', 'iv', 'VII', 'III'], ['i', 'VI', 'iv', 'V'], ['i', 'III', 'VII', 'VI']]
};

export const CHORD_TYPES = {
    major: { I: 'maj', ii: 'm', iii: 'm', IV: 'maj', V: 'maj', vi: 'm', vii: 'dim' },
    minor: { i: 'm', ii: 'dim', III: 'maj', iv: 'm', V: 'maj', VI: 'maj', VII: 'maj' }
};

export const DEGREE_INDEXES = {
    I: 0,
    i: 0,
    ii: 1,
    III: 2,
    iii: 2,
    IV: 3,
    iv: 3,
    V: 4,
    VI: 5,
    vi: 5,
    VII: 6,
    vii: 6
};

export const FALLBACK_SCALES = {
    major: ['C4', 'D4', 'E4', 'G4', 'A4', 'C5'],
    minor: ['A3', 'C4', 'D4', 'E4', 'G4', 'A4']
};

export const GROOVES = [
    { name: 'straight', melodyDurations: ['8n', '8n', '4n', '8n', '8n', '4n'], drumPattern: [0, 2, 4, 6] },
    { name: 'syncopated', melodyDurations: ['8n', '16n', '16n', '4n', '8n', '8n'], drumPattern: [0, 1.5, 3, 4.5, 6] },
    { name: 'slow-pop', melodyDurations: ['4n', '8n', '8n', '2n'], drumPattern: [0, 2, 4] },
    { name: 'dance', melodyDurations: ['8n', '8n', '8n', '8n', '4n'], drumPattern: [0, 1, 2, 3, 4, 5, 6, 7] }
];

export const SYNTH_PRESETS = [
    { name: 'soft synth', oscillator: 'sine', attack: 0.02, release: 0.4 },
    { name: 'bright lead', oscillator: 'triangle', attack: 0.01, release: 0.25 },
    { name: 'retro square', oscillator: 'square', attack: 0.03, release: 0.3 },
    { name: 'warm pad', oscillator: 'sawtooth', attack: 0.2, release: 0.8 }
];
