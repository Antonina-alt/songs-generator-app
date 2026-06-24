import { Chord, Scale } from '@tonaljs/tonal';
import { pickRandom } from '../randomGenerator';
import {
    CHORD_SECONDS,
    CHORD_TYPES,
    DEGREE_INDEXES,
    FALLBACK_SCALES,
    PROGRESSIONS
} from './constants';
import { getSectionRole } from './structure';

export function createChords(context) {
    const progressionsByRole = createProgressionsByRole(context);
    return context.structure.flatMap((section) => createSectionChords(context, section, progressionsByRole));
}

export function createScaleNotes({ key, mode }) {
    const notes = Scale.get(`${key} ${mode}`).notes;
    return notes.length ? createScaleOctaves(notes) : FALLBACK_SCALES[mode];
}

export function getScaleNotes({ key, mode }) {
    return Scale.get(`${key} ${mode}`).notes;
}

function createProgressionsByRole({ mode, random }) {
    const verse = pickProgression(mode, 'verse', random);
    const chorus = pickDifferentProgression(mode, 'chorus', verse, random);

    return {
        intro: pickProgression(mode, 'intro', random),
        verse,
        chorus,
        outro: pickProgression(mode, 'outro', random)
    };
}

function pickProgression(mode, role, random) {
    const roleProgressions = PROGRESSIONS[mode]?.[role];
    const fallbackProgressions = PROGRESSIONS[mode]?.verse;

    return pickRandom(roleProgressions || fallbackProgressions, random);
}

function pickDifferentProgression(mode, role, previousProgression, random) {
    const progressions = PROGRESSIONS[mode]?.[role] || PROGRESSIONS[mode]?.verse || [];
    const alternatives = progressions.filter((progression) => !areSameProgressions(progression, previousProgression));

    return pickRandom(alternatives.length ? alternatives : progressions, random);
}

function areSameProgressions(a, b) {
    return JSON.stringify(a) === JSON.stringify(b);
}

function createSectionChords(context, section, progressionsByRole) {
    const role = getSectionRole(section);
    const progression = progressionsByRole[role] || progressionsByRole.verse;
    const chordCount = Math.ceil(section.durationSeconds / CHORD_SECONDS);

    return Array.from({ length: chordCount }, (_, index) => {
        return createSectionChord(context, section, role, progression, index);
    }).filter((chord) => chord.duration > 0);
}

function createSectionChord(context, section, role, progression, index) {
    const degree = progression[index % progression.length];
    const timing = createChordTiming(context, section, index);
    return { ...createChord({ ...context, degree }), ...timing, ...createChordSectionFields(section, role) };
}

function createChordTiming(context, section, index) {
    const time = section.startTime + index * CHORD_SECONDS;
    return { time, duration: Math.min(CHORD_SECONDS, section.endTime - time, context.durationSeconds - time) };
}

function createChordSectionFields(section, role) {
    return { section: section.name, role, energy: section.energy, velocity: createChordVelocity(section) };
}

function createChordVelocity(section) {
    return Math.min(0.55, 0.25 + section.energy * 0.28);
}

function createChord({ key, mode, degree }) {
    const root = getChordRoot(key, mode, degree);
    const symbol = createChordSymbol(root, CHORD_TYPES[mode][degree]);

    return {
        degree,
        symbol,
        root,
        notes: Chord.get(symbol).notes
    };
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