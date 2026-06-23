import { pickRandom, randomInt } from '../randomGenerator';
import { MELODY_STEP_SECONDS } from './constants';

export function createMelody({ scaleNotes, groove, random, durationSeconds }) {
    const length = getMelodyLength(durationSeconds, random);
    return Array.from({ length }, (_, index) => createMelodyNote(index, scaleNotes, groove, random));
}

function getMelodyLength(durationSeconds, random) {
    return getMinimumLength(durationSeconds) + randomInt(0, 12, random);
}

function getMinimumLength(durationSeconds) {
    return Math.ceil(durationSeconds / MELODY_STEP_SECONDS) + 4;
}

function createMelodyNote(index, scaleNotes, groove, random) {
    return {
        note: pickRandom(createNotePool(index, scaleNotes), random),
        duration: groove.melodyDurations[index % groove.melodyDurations.length],
        velocity: 0.45 + random() * 0.45
    };
}

function createNotePool(index, scaleNotes) {
    return index % 4 === 0 ? getStableNotes(scaleNotes) : scaleNotes;
}

function getStableNotes(scaleNotes) {
    return [scaleNotes[0], scaleNotes[2], scaleNotes[4]].filter(Boolean);
}
