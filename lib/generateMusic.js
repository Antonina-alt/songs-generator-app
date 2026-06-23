import { createMusicContext } from './music/context';
import { createChords, createScaleNotes } from './music/harmony';
import { createMelody } from './music/melody';
import { createBassLine, createDrums } from './music/rhythm';
import { createVocalEvents } from './music/vocal';

export function generateMusic({ region, seed, index, tempo, durationSeconds = 32, lyrics = [] }) {
    const context = { ...createMusicContext({ region, seed, index }), tempo, durationSeconds, lyrics };
    return createMusicResponse(context);
}

function createMusicResponse(context) {
    const chords = createChords(context);
    const melody = createMelody({ ...context, scaleNotes: createScaleNotes(context) });
    return { ...createBaseMusic(context), chords, melody, bass: createBassLine(chords), drums: createDrums(context.groove, context.durationSeconds), vocal: createVocalEvents(context) };
}

function createBaseMusic({ region, tempo, key, mode, groove, synthPreset, durationSeconds }) {
    return { region, tempo, key, mode, groove: groove.name, synthPreset, durationSeconds };
}
