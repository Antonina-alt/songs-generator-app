import { createRng, pickRandom } from '../randomGenerator';
import { GROOVES, KEYS, MODES, SYNTH_PRESETS } from './constants';

const MUSIC_RANDOM_SCOPES = ['vocal', 'mix'];

export function createMusicContext(params) {
    const random = createRng('music', params.region, params.seed, params.index);
    return { ...createRandomFields(params), ...createPickedFields(random), random, region: params.region };
}

function createRandomFields(params) {
    return Object.fromEntries(MUSIC_RANDOM_SCOPES.map((scope) => createRandomField(scope, params)));
}

function createRandomField(scope, { region, seed, index }) {
    return [`${scope}Random`, createRng(scope, region, seed, index)];
}

function createPickedFields(random) {
    return { key: pick(KEYS, random), mode: pick(MODES, random), groove: pick(GROOVES, random), synthPreset: pick(SYNTH_PRESETS, random) };
}

function pick(values, random) {
    return pickRandom(values, random);
}
