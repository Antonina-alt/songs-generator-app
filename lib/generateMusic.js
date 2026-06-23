import { Chord, Scale } from '@tonaljs/tonal';
import { createRng, pickRandom, randomInt } from './randomGenerator';

const keys = ['C', 'D', 'E', 'F', 'G', 'A', 'Bb'];
const modes = ['major', 'minor'];

const progressions = {
    major: [['I', 'V', 'vi', 'IV'], ['I', 'vi', 'IV', 'V'], ['vi', 'IV', 'I', 'V'], ['I', 'IV', 'V', 'I'], ['ii', 'V', 'I', 'vi']],
    minor: [['i', 'VI', 'III', 'VII'], ['i', 'VII', 'VI', 'VII'], ['i', 'iv', 'VII', 'III'], ['i', 'VI', 'iv', 'V'], ['i', 'III', 'VII', 'VI']]
};

const chordMaps = {
    major: { I: 'maj', ii: 'm', iii: 'm', IV: 'maj', V: 'maj', vi: 'm', vii: 'dim' },
    minor: { i: 'm', ii: 'dim', III: 'maj', iv: 'm', V: 'maj', VI: 'maj', VII: 'maj' }
};

const degreeIndexMap = {
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

const fallbackScales = {
    major: ['C4', 'D4', 'E4', 'G4', 'A4', 'C5'],
    minor: ['A3', 'C4', 'D4', 'E4', 'G4', 'A4']
};

const grooves = [
    { name: 'straight', melodyDurations: ['8n', '8n', '4n', '8n', '8n', '4n'], drumPattern: [0, 2, 4, 6] },
    { name: 'syncopated', melodyDurations: ['8n', '16n', '16n', '4n', '8n', '8n'], drumPattern: [0, 1.5, 3, 4.5, 6] },
    { name: 'slow-pop', melodyDurations: ['4n', '8n', '8n', '2n'], drumPattern: [0, 2, 4] },
    { name: 'dance', melodyDurations: ['8n', '8n', '8n', '8n', '4n'], drumPattern: [0, 1, 2, 3, 4, 5, 6, 7] }
];

const synthPresets = [
    { name: 'soft synth', oscillator: 'sine', attack: 0.02, release: 0.4 },
    { name: 'bright lead', oscillator: 'triangle', attack: 0.01, release: 0.25 },
    { name: 'retro square', oscillator: 'square', attack: 0.03, release: 0.3 },
    { name: 'warm pad', oscillator: 'sawtooth', attack: 0.2, release: 0.8 }
];

export function generateMusic({ region, seed, index, tempo }) {
    const context = createMusicContext({ region, seed, index });
    return createMusicResponse({ ...context, tempo });
}

function createMusicContext({ region, seed, index }) {
    const random = createRng('music', region, seed, index);
    const key = pickRandom(keys, random);
    const mode = pickRandom(modes, random);
    return { region, random, key, mode, groove: pickRandom(grooves, random), synthPreset: pickRandom(synthPresets, random) };
}

function createMusicResponse(context) {
    const chords = createChords(context);
    const scaleNotes = createScaleNotes(context);
    return { ...createBaseMusic(context), chords, melody: createMelody({ scaleNotes, ...context }), bass: createBassLine(chords), drums: createDrums(context.groove) };
}

function createBaseMusic({ region, tempo, key, mode, groove, synthPreset }) {
    return { region, tempo, key, mode, groove: groove.name, synthPreset, durationSeconds: 27 };
}

function createChords({ key, mode, random }) {
    return pickRandom(progressions[mode], random).map((degree) => createChord({ key, mode, degree }));
}

function createChord({ key, mode, degree }) {
    const root = getChordRoot(key, mode, degree);
    const type = chordMaps[mode][degree];
    return { degree, symbol: createChordSymbol(root, type), root, notes: Chord.get(createChordSymbol(root, type)).notes };
}

function createChordSymbol(root, type) {
    return `${root}${type === 'maj' ? '' : type}`;
}

function getChordRoot(key, mode, degree) {
    const notes = Scale.get(`${key} ${mode}`).notes;
    return notes[degreeIndexMap[degree]] || key;
}

function createScaleNotes({ key, mode }) {
    const notes = Scale.get(`${key} ${mode}`).notes;
    return notes.length ? createScaleOctaves(notes) : fallbackScales[mode];
}

function createScaleOctaves(notes) {
    return notes.flatMap((note) => [`${note}4`, `${note}5`]);
}

function createMelody({ scaleNotes, groove, random }) {
    const length = randomInt(20, 32, random);
    return Array.from({ length }, (_, index) => createMelodyNote(index, scaleNotes, groove, random));
}

function createMelodyNote(index, scaleNotes, groove, random) {
    return {
        note: pickRandom(createNotePool(index, scaleNotes), random),
        duration: groove.melodyDurations[index % groove.melodyDurations.length],
        velocity: 0.45 + random() * 0.45
    };
}

function createNotePool(index, scaleNotes) {
    return index % 4 === 0 ? stableNotes(scaleNotes) : scaleNotes;
}

function stableNotes(scaleNotes) {
    return [scaleNotes[0], scaleNotes[2], scaleNotes[4]].filter(Boolean);
}

function createBassLine(chords) {
    return chords.flatMap(createChordBassNotes);
}

function createChordBassNotes(chord, chordIndex) {
    const note = `${chord.root}2`;
    return [createBassNote(note, chordIndex * 2, '2n', 0.65), createBassNote(note, chordIndex * 2 + 1, '4n', 0.45)];
}

function createBassNote(note, time, duration, velocity) {
    return { note, time, duration, velocity };
}

function createDrums(groove) {
    return groove.drumPattern.map((time, index) => ({ time, type: index % 2 === 0 ? 'kick' : 'hat' }));
}
