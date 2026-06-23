import * as Tone from 'tone';
import { DEFAULT_MELODY_VELOCITY, MELODY_STEP_SECONDS } from './constants';
import { createVocalSpeechSchedule } from './speech';

export function createSongParts(audioGraph, music, lyrics) {
    return {
        ...createInstrumentParts(audioGraph, music),
        ...createVocalParts(audioGraph.vocalSynth, music, lyrics)
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

function createVocalParts(vocalSynth, music, lyrics = []) {
    return {
        vocalPart: createVocalPart(vocalSynth, music, lyrics),
        vocalSpeechTimers: createVocalSpeechSchedule(lyrics, music)
    };
}

function createMelodyPart(synth, melody = []) {
    return createStartedPart(playMelodyNote(synth), createMelodyEvents(melody));
}

function createMelodyEvents(melody) {
    return melody.map((item, index) => ({ ...item, time: index * MELODY_STEP_SECONDS }));
}

function playMelodyNote(synth) {
    return (time, value) => synth.triggerAttackRelease(
        value.note,
        value.duration,
        time,
        value.velocity ?? DEFAULT_MELODY_VELOCITY
    );
}

function createChordPart(synth, chords = []) {
    return createStartedPart(playChord(synth), createChordEvents(chords));
}

function createChordEvents(chords) {
    return chords.map(createChordEvent).filter((event) => event.notes.length);
}

function createChordEvent(chord, index) {
    return { time: index * 2, notes: createChordNotes(chord) };
}

function createChordNotes(chord) {
    return chord.notes?.map((note) => `${note}4`) || [];
}

function playChord(synth) {
    return (time, value) => synth.triggerAttackRelease(value.notes, '2n', time, 0.35);
}

function createBassPart(synth, bass = []) {
    return createStartedPart(playBassNote(synth), bass);
}

function playBassNote(synth) {
    return (time, value) => synth.triggerAttackRelease(value.note, value.duration, time, value.velocity);
}

function createDrumPart({ kick, hat }, drums = []) {
    return createStartedPart(playDrum({ kick, hat }), drums);
}

function playDrum({ kick, hat }) {
    return (time, value) => triggerDrum(getDrumInstrument({ kick, hat }, value), time);
}

function getDrumInstrument({ kick, hat }, value) {
    return { instrument: value.type === 'kick' ? kick : hat, note: value.type === 'kick' ? 'C1' : '32n' };
}

function triggerDrum({ instrument, note }, time) {
    instrument.triggerAttackRelease(note, '8n', time);
}

function createVocalPart(vocalSynth, music, lyrics = []) {
    return createStartedPart(playVocalNote(vocalSynth), createVocalEvents(music, lyrics));
}

function playVocalNote(vocalSynth) {
    return (time, value) => vocalSynth.triggerAttackRelease(value.note, value.duration, time, value.velocity);
}

function createVocalEvents(music, lyrics = []) {
    if (!music?.melody?.length || !lyrics.length) return [];
    return lyrics.flatMap((line, lineIndex) => createLineVocalEvents(line, lineIndex, music));
}

function createLineVocalEvents(line, lineIndex, music) {
    return splitWords(line.text).map((word, wordIndex) => createVocalEvent(line, lineIndex, wordIndex, music));
}

function createVocalEvent(line, lineIndex, wordIndex, music) {
    const melodyNote = getVocalMelodyNote(music, lineIndex, wordIndex);
    return { time: line.time + wordIndex * 0.35, note: melodyNote.note, duration: '8n', velocity: 0.65 };
}

function getVocalMelodyNote(music, lineIndex, wordIndex) {
    const melodyIndex = (lineIndex * 3 + wordIndex) % music.melody.length;
    return music.melody[melodyIndex];
}

function splitWords(text) {
    return String(text).split(/\s+/).map((word) => word.trim()).filter(Boolean);
}

function createStartedPart(callback, events) {
    const part = new Tone.Part(callback, events);
    part.start(0);
    return part;
}
