import { Chord, Scale } from '@tonaljs/tonal';
import { pickRandom } from '../randomGenerator';
import { CHORD_SECONDS, CHORD_TYPES, DEGREE_INDEXES, FALLBACK_SCALES, PROGRESSIONS } from './constants';

export function createChords(context) {
    const progression = pickRandom(PROGRESSIONS[context.mode], context.random);
    return createChordSequence(context, progression);
}

export function createScaleNotes({ key, mode }) {
    const notes = Scale.get(`${key} ${mode}`).notes;
    return notes.length ? createScaleOctaves(notes) : FALLBACK_SCALES[mode];
}

export function getScaleNotes({ key, mode }) {
    return Scale.get(`${key} ${mode}`).notes;
}

function createChordSequence(context, progression) {
    return Array.from({ length: getChordCount(context) }, (_, index) => {
        return createChord({ ...context, degree: progression[index % progression.length] });
    });
}

function getChordCount({ durationSeconds }) {
    return Math.ceil(durationSeconds / CHORD_SECONDS) + 1;
}

function createChord({ key, mode, degree }) {
    const root = getChordRoot(key, mode, degree);
    const symbol = createChordSymbol(root, CHORD_TYPES[mode][degree]);
    return { degree, symbol, root, notes: Chord.get(symbol).notes };
}

function createChordSymbol(root, type) {
    return `${root}${type === 'maj' ? '' : type}`;
}

function getChordRoot(key, mode, degree) {
    const notes = Scale.get(`${key} ${mode}`).notes;
    return notes[DEGREE_INDEXES[degree]] || key;
}

function createScaleOctaves(notes) {
    return notes.flatMap((note) => [`${note}4`, `${note}5`]);
}
