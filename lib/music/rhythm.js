import { GROOVE_LOOP_SECONDS } from './constants';

export function createBassLine(chords) {
    return chords.flatMap(createChordBassNotes);
}

export function createDrums(groove, durationSeconds) {
    return createDrumLoops(groove, durationSeconds).flat().filter(isBeforeEnd(durationSeconds));
}

function createChordBassNotes(chord, chordIndex) {
    const note = `${chord.root}2`;
    return [createBassNote(note, chordIndex * 2, '2n', 0.65), createBassNote(note, chordIndex * 2 + 1, '4n', 0.45)];
}

function createBassNote(note, time, duration, velocity) {
    return { note, time, duration, velocity };
}

function createDrumLoops(groove, durationSeconds) {
    return Array.from({ length: getLoopCount(durationSeconds) }, (_, loopIndex) => createDrumLoop(groove, loopIndex));
}

function getLoopCount(durationSeconds) {
    return Math.ceil(durationSeconds / GROOVE_LOOP_SECONDS);
}

function createDrumLoop(groove, loopIndex) {
    return groove.drumPattern.map((time, index) => createDrumEvent(time, index, loopIndex));
}

function createDrumEvent(time, index, loopIndex) {
    return { time: loopIndex * GROOVE_LOOP_SECONDS + time, type: getDrumType(index) };
}

function getDrumType(index) {
    return index % 2 === 0 ? 'kick' : 'hat';
}

function isBeforeEnd(durationSeconds) {
    return (event) => event.time < durationSeconds;
}
