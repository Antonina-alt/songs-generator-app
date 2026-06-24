import { CHORD_SECONDS, GROOVE_LOOP_SECONDS } from './constants';
import { getSectionRole } from './structure';

const BASS_PATTERNS = {
    intro: [[0, '2n', 0.28]],
    chorus: [[0, '4n', 0.72], [0.5, '8n', 0.58], [0.75, '8n', 0.5]],
    outro: [[0, '2n', 0.38]],
    default: [[0, '2n', 0.62], [0.5, '4n', 0.42]]
};

export function createBassLine(chords) {
    return chords.flatMap(createChordBassNotes);
}

export function createDrums(groove, structure, durationSeconds) {
    return structure.flatMap((section) => createSectionDrums(groove, section, durationSeconds)).filter(isBeforeEnd(durationSeconds));
}

function createChordBassNotes(chord) {
    return getBassPattern(chord.role).map((step) => createPatternBassNote(chord, step));
}

function getBassPattern(role) {
    return BASS_PATTERNS[role] ?? BASS_PATTERNS.default;
}

function createPatternBassNote(chord, [offset, duration, velocity]) {
    return createBassNote(`${chord.root}2`, chord.time + CHORD_SECONDS * offset, duration, velocity);
}

function createBassNote(note, time, duration, velocity) {
    return { note, time, duration, velocity };
}

function createSectionDrums(groove, section, durationSeconds) {
    return createLoopStarts(section).flatMap((loopStart) => createDrumLoop(groove, loopStart, section, durationSeconds));
}

function createLoopStarts(section) {
    return createRange(section.startTime, section.endTime, GROOVE_LOOP_SECONDS);
}

function createRange(start, end, step) {
    return Array.from({ length: Math.ceil((end - start) / step) }, (_, index) => start + index * step);
}

function createDrumLoop(groove, loopStart, section, durationSeconds) {
    return getSectionDrumPattern(groove, section).map((event) => createDrumEvent(event, loopStart, section)).filter(isInsideSection(section, durationSeconds));
}

function createDrumEvent(event, loopStart, section) {
    return { ...event, time: loopStart + event.time, section: section.name, role: getSectionRole(section) };
}

function getSectionDrumPattern(groove, section) {
    return groove.drumPatterns?.[getSectionRole(section)] ?? groove.drumPatterns?.verse ?? createLegacyDrumPattern(groove.drumPattern || []);
}

function createLegacyDrumPattern(pattern) {
    return pattern.map((time, index) => createLegacyDrumEvent(time, index));
}

function createLegacyDrumEvent(time, index) {
    return { time, type: index % 2 === 0 ? 'kick' : 'hat', velocity: index % 2 === 0 ? 0.7 : 0.35 };
}

function isInsideSection(section, durationSeconds) {
    return (event) => event.time < section.endTime && event.time < durationSeconds;
}

function isBeforeEnd(durationSeconds) {
    return (event) => event.time < durationSeconds;
}
