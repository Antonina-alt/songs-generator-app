import { pickRandom } from '../randomGenerator';
import { MELODY_SETTINGS, MELODY_STEP_SECONDS, NOTE_STEP_SECONDS } from './constants';

export function createMelody(params) {
    return params.structure.flatMap((section) => createSectionMelody({ ...params, section })).filter(isBeforeEnd(params.durationSeconds));
}

function createSectionMelody(context) {
    return createMelodyTimes(context).flatMap((step, stepIndex) => createStepEvent(context, step, stepIndex));
}

function createMelodyTimes(context) {
    return collectMelodySteps(context, context.section.startTime, []);
}

function collectMelodySteps(context, time, steps) {
    if (isSectionFinished(context, time)) return steps;
    const duration = pickRandom(getSettings(context).durations, context.random);
    return collectMelodySteps(context, time + createStepSeconds(duration, context.random), [...steps, { time, duration }]);
}

function createStepEvent(context, step, stepIndex) {
    if (shouldRest(getSettings(context), context.random)) return [];
    return [createMelodyEvent(context, step, stepIndex)];
}

function createMelodyEvent(context, step, stepIndex) {
    return { ...createNoteFields(context, step, stepIndex), section: context.section.name, role: context.section.role };
}

function createNoteFields(context, { time, duration }, stepIndex) {
    return { time, duration, note: pickMelodyNote(context, time, stepIndex), velocity: createVelocity(context) };
}

function pickMelodyNote(context, time, stepIndex) {
    return `${pickRandom(getNoteNames(context, time, stepIndex), context.random)}${pickRandom(getSettings(context).octaves, context.random)}`;
}

function getNoteNames(context, time, stepIndex) {
    const chord = findChordAtTime(context.chords, time);
    if (shouldUseChordTone(context, chord, stepIndex)) return chord.notes;
    return removeOctaves(context.scaleNotes);
}

function shouldUseChordTone(context, chord, stepIndex) {
    return Boolean(chord?.notes?.length) && (isStrongStep(stepIndex) || context.random() < getSettings(context).chordToneProbability);
}

function isStrongStep(stepIndex) {
    return stepIndex % 4 === 0;
}

function findChordAtTime(chords, time) {
    return chords.find((chord) => time >= chord.time && time < chord.time + chord.duration) || chords.at(-1);
}

function removeOctaves(notes) {
    return [...new Set(notes.map(removeOctave))];
}

function removeOctave(note) {
    return String(note).replace(/\d/g, '');
}

function isSectionFinished({ section, durationSeconds }, time) {
    return time >= section.endTime || time >= durationSeconds;
}

function shouldRest(settings, random) {
    return random() < settings.restProbability;
}

function createVelocity(context) {
    return Math.min(0.92, getSettings(context).velocityBase + context.section.energy * 0.12 + context.random() * getSettings(context).velocityRange);
}

function createStepSeconds(duration, random) {
    return (NOTE_STEP_SECONDS[duration] || MELODY_STEP_SECONDS) * (0.9 + random() * 0.2);
}

function getSettings({ section }) {
    return MELODY_SETTINGS.sections[section.role] || MELODY_SETTINGS.sections.verse;
}

function isBeforeEnd(durationSeconds) {
    return (event) => event.time < durationSeconds;
}
