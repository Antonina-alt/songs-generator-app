import { createMusicContext } from './music/context';
import { createChords, createScaleNotes } from './music/harmony';
import { createMelody } from './music/melody';
import { createMix } from './music/mix';
import { createBassLine, createDrums } from './music/rhythm';
import { createSongStructure } from './music/structure';
import { createVocalEvents } from './music/vocal';

export function generateMusic(params) {
    return createMusicResponse(createContext(params));
}

function createContext(params) {
    return { ...createMusicContext(params), ...createSongTiming(params) };
}

function createSongTiming({ tempo, durationSeconds = 32, lyrics = [] }) {
    return { tempo, durationSeconds, lyrics };
}

function createMusicResponse(context) {
    const composition = createComposition(context);
    return { ...createBaseMusic(context), ...composition, ...createArrangement(context, composition) };
}

function createComposition(context) {
    const structure = createSongStructure(context.durationSeconds);
    const chords = createChords({ ...context, structure });
    return { structure, chords, melody: createMelodyForContext(context, structure, chords) };
}

function createMelodyForContext(context, structure, chords) {
    return createMelody({ ...context, structure, chords, scaleNotes: createScaleNotes(context) });
}

function createArrangement(context, { structure, chords }) {
    return {
        bass: createBassLine(chords),
        drums: createDrums(context.groove, structure, context.durationSeconds),
        vocal: createVocalEvents(context)
    };
}

function createBaseMusic(context) {
    return { ...pickBaseFields(context), groove: context.groove.name, mix: createMix(context.mixRandom) };
}

function pickBaseFields({ region, tempo, key, mode, synthPreset, durationSeconds }) {
    return { region, tempo, key, mode, synthPreset, durationSeconds };
}
