import { Note } from '@tonaljs/tonal';
import { clamp } from '../../utils/math';
import { BASE_MIDI, FALLBACK_LINE_DURATION_SECONDS, MAX_MIDI_STEP, MAX_PLAYBACK_RATE, MAX_SYLLABLE_DURATION_SECONDS, MIN_PLAYBACK_RATE, MIN_SYLLABLE_DURATION_SECONDS, RATE_PER_SEMITONE, SYLLABLE_OVERLAP_RATIO } from './constants';
import { splitLineIntoSyllables } from './tokenizer';

export function createVocalEvents(music, lyrics) {
    if (music?.vocal?.length) return smoothVocalEvents(music.vocal.map(createMusicVocalEvent));
    if (!music?.melody?.length || !lyrics.length) return [];
    return smoothVocalEvents(createLyricEvents(music, lyrics));
}

function createMusicVocalEvent(event) {
    return { text: event.text, time: event.time, durationSeconds: event.durationSeconds, rawMidi: Note.midi(event.note) ?? BASE_MIDI, velocity: event.velocity ?? 0.75 };
}

function createLyricEvents(music, lyrics) {
    return lyrics.flatMap((line, lineIndex) => createLineEvents(line, lineIndex, music, lyrics));
}

function createLineEvents(line, lineIndex, music, lyrics) {
    const syllables = splitLineIntoSyllables(line.text, music?.region);
    if (!syllables.length) return [];
    return createSyllableEvents({ line, lineIndex, music, syllables, lineDuration: getLineDuration(line, lineIndex, lyrics) });
}

function createSyllableEvents(context) {
    return context.syllables.map((syllable, syllableIndex) => createVocalEvent(context, syllable, syllableIndex));
}

function createVocalEvent(context, syllable, syllableIndex) {
    const melodyNote = getVocalMelodyNote(context.music, context.lineIndex, syllableIndex);
    return createEventPayload(context, syllable, syllableIndex, melodyNote);
}

function createEventPayload(context, syllable, syllableIndex, melodyNote) {
    return { text: syllable, time: getSyllableTime(context, syllableIndex), durationSeconds: getSyllableDuration(context), rawMidi: Note.midi(melodyNote.note) ?? BASE_MIDI, velocity: melodyNote.velocity ?? 0.75 };
}

function getLineDuration(line, lineIndex, lyrics) {
    const nextLine = lyrics[lineIndex + 1];
    return nextLine ? Math.max(1.2, nextLine.time - line.time) : FALLBACK_LINE_DURATION_SECONDS;
}

function getSyllableTime({ line, lineDuration, syllables }, syllableIndex) {
    return line.time + syllableIndex * getSyllableSlot(lineDuration, syllables);
}

function getSyllableDuration({ lineDuration, syllables }) {
    return clamp(getSyllableSlot(lineDuration, syllables) * SYLLABLE_OVERLAP_RATIO, MIN_SYLLABLE_DURATION_SECONDS, MAX_SYLLABLE_DURATION_SECONDS);
}

function getSyllableSlot(lineDuration, syllables) {
    return lineDuration / syllables.length;
}

function getVocalMelodyNote(music, lineIndex, syllableIndex) {
    const melodyIndex = (lineIndex * 5 + syllableIndex) % music.melody.length;
    return music.melody[melodyIndex];
}

function smoothVocalEvents(events) {
    return events.sort((a, b) => a.time - b.time).map((event, index, sortedEvents) => smoothVocalEvent(event, sortedEvents[index - 1]));
}

function smoothVocalEvent(event, previousEvent) {
    const midi = getSmoothedMidi(event, previousEvent);
    return { ...event, midi, ...createRateEnvelope(midi, previousEvent) };
}

function getSmoothedMidi(event, previousEvent) {
    const previousMidi = previousEvent?.midi ?? event.rawMidi;
    return previousMidi + clamp(event.rawMidi - previousMidi, -MAX_MIDI_STEP, MAX_MIDI_STEP);
}

function createRateEnvelope(midi, previousEvent) {
    const rateEnd = getPlaybackRateFromMidi(midi);
    const previousRate = previousEvent?.rateEnd ?? rateEnd;
    return { rateStart: previousRate + (rateEnd - previousRate) * 0.35, rateEnd };
}

function getPlaybackRateFromMidi(midi) {
    return clamp(1 + (midi - BASE_MIDI) * RATE_PER_SEMITONE, MIN_PLAYBACK_RATE, MAX_PLAYBACK_RATE);
}
