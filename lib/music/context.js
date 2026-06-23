import { createRng, pickRandom } from '../randomGenerator';
import { GROOVES, KEYS, MODES, SYNTH_PRESETS } from './constants';

export function createMusicContext({ region, seed, index }) {
    const random = createRng('music', region, seed, index);
    return createContext({ region, random, seed, index });
}

function createContext({ region, random, seed, index }) {
    return {
        region,
        random,
        vocalRandom: createRng('vocal', region, seed, index),
        key: pickRandom(KEYS, random),
        mode: pickRandom(MODES, random),
        groove: pickRandom(GROOVES, random),
        synthPreset: pickRandom(SYNTH_PRESETS, random)
    };
}
