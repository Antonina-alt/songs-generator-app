import { createRng, pickRandom, randomInt } from './randomGenerator';

const keys = ['C', 'D', 'E', 'F', 'G', 'A'];
const modes = ['major', 'minor'];
const scaleNotes = {
    major: ['C4', 'D4', 'E4', 'G4', 'A4', 'C5'],
    minor: ['A3', 'C4', 'D4', 'E4', 'G4', 'A4']
};
const chordProgressions = {
    major: [['C', 'G', 'Am', 'F'], ['C', 'F', 'G', 'C'], ['F', 'G', 'C', 'Am']],
    minor: [['Am', 'F', 'C', 'G'], ['Am', 'G', 'F', 'E'], ['Dm', 'Am', 'G', 'F']]
};
const melodyRhythms = [['8n', '8n', '4n', '4n'], ['4n', '8n', '8n', '2n'], ['8n', '16n', '16n', '4n', '4n']];

export function generateMusic({ region, seed, index, tempo }) {
    const random = createRng('music', region, seed, index);
    const mode = pickRandom(modes, random);
    return createMusic({ random, mode, tempo });
}

function createMusic({ random, mode, tempo }) {
    return {
        tempo,
        mode,
        key: pickRandom(keys, random),
        chords: pickRandom(chordProgressions[mode], random),
        melody: generateMelody(mode, random)
    };
}

function generateMelody(mode, random) {
    const rhythm = pickRandom(melodyRhythms, random);
    return Array.from({ length: 16 }, (_, index) => createNote(mode, rhythm, index, random));
}

function createNote(mode, rhythm, index, random) {
    return {
        note: pickRandom(scaleNotes[mode], random),
        duration: rhythm[index % rhythm.length]
    };
}
