import { createRng, pickRandom } from '../randomGenerator';
import { GROOVES, KEYS, MODES, SYNTH_PRESETS } from './constants';

const MUSIC_RANDOM_SCOPES = ['vocal', 'mix'];

export function createMusicContext(params) {
    const musicIndex = createMusicIndex(params);
    const random = createRng('music', params.region, params.seed, musicIndex);
    return { ...createRandomFields(params), ...createPickedFields(random), random, region: params.region };
}

function createRandomField(scope, params) {
    return [`${scope}Random`, createRng(scope, params.region, params.seed, createMusicIndex(params))];
}

function createMusicIndex({ page, index }) {
    return `${page}:${index}`;
}

function createRandomFields(params) {
    return Object.fromEntries(MUSIC_RANDOM_SCOPES.map((scope) => createRandomField(scope, params)));
}

function createPickedFields(random) {
    return { key: pick(KEYS, random), mode: pick(MODES, random), groove: pick(GROOVES, random), synthPreset: pick(SYNTH_PRESETS, random) };
}

function pick(values, random) {
    return pickRandom(values, random);
}
