import * as Tone from 'tone';
import { DEFAULT_MELODY_VELOCITY } from './constants';
import { CHORD_SECONDS, MELODY_STEP_SECONDS } from '../music/constants';
import { createVocalLeadPart } from './vocalLead';

export function createSongParts(audioGraph, music) {
    return {
        ...createInstrumentParts(audioGraph, music),
        vocalLeadPart: createVocalLeadPart(audioGraph.vocalSynth, music.vocal)
    };
}

function createInstrumentParts(audioGraph, music) {
    return {
        melodyPart: createMelodyPart(audioGraph.melodySynth, music.melody),
        chordPart: createChordPart(audioGraph.chordSynth, music.chords),
        bassPart: createBassPart(audioGraph.bassSynth, music.bass),
        drumPart: createDrumPart(audioGraph, music.drums)
    };
}

function createMelodyPart(synth, melody = []) {
    return createStartedPart(playMelodyNote(synth), createMelodyEvents(melody));
}

function createMelodyEvents(melody) {
    return melody.map((item, index) => ({
        ...item,
        time: item.time ?? index * MELODY_STEP_SECONDS
    }));
}

function playMelodyNote(synth) {
    return (time, value) => {
        synth.triggerAttackRelease(
            value.note,
            value.duration,
            time,
            value.velocity ?? DEFAULT_MELODY_VELOCITY
        );
    };
}

function createChordPart(synth, chords = []) {
    return createStartedPart(playChord(synth), createChordEvents(chords));
}

function createChordEvents(chords) {
    return chords.map(createChordEvent).filter((event) => event.notes.length);
}

function createChordEvent(chord, index) {
    return {
        time: chord.time ?? index * CHORD_SECONDS,
        duration: chord.duration ?? CHORD_SECONDS,
        notes: createChordNotes(chord),
        velocity: chord.velocity ?? 0.35
    };
}

function createChordNotes(chord) {
    return chord.notes?.map((note) => `${note}4`) || [];
}

function playChord(synth) {
    return (time, value) => {
        synth.triggerAttackRelease(
            value.notes,
            Math.max(0.25, value.duration * 0.92),
            time,
            value.velocity
        );
    };
}

function createBassPart(synth, bass = []) {
    return createStartedPart(playBassNote(synth), bass);
}

function playBassNote(synth) {
    return (time, value) => {
        synth.triggerAttackRelease(value.note, value.duration, time, value.velocity);
    };
}

function createDrumPart({ kick, hat }, drums = []) {
    return createStartedPart(playDrum({ kick, hat }), drums);
}

function playDrum({ kick, hat }) {
    return (time, value) => {
        if (value.type === 'kick') {
            kick.triggerAttackRelease('C1', '8n', time, value.velocity ?? 0.75);
            return;
        }

        hat.triggerAttackRelease('32n', time, value.velocity ?? 0.35);
    };
}

function createStartedPart(callback, events) {
    const part = new Tone.Part(callback, events);
    part.start(0);
    return part;
}