import { pickRandom } from '../randomGenerator';
import { MIX_SETTINGS } from './constants';

const MIX_VOLUME_NAMES = ['melodyVolume', 'chordVolume', 'bassVolume', 'drumVolume', 'vocalVolume'];

export function createMix(random) {
    const profile = pickRandom(MIX_SETTINGS.profiles, random);
    return { profile: profile.name, ...createVolumes(profile, random) };
}

function createVolumes(profile, random) {
    return Object.fromEntries(MIX_VOLUME_NAMES.map((name) => [name, createVolume(name, profile, random)]));
}

function createVolume(name, profile, random) {
    return roundVolume(clampToLimits(profile[name] + createOffset(name, random), MIX_SETTINGS.limits[name]));
}

function createOffset(name, random) {
    return (random() * 2 - 1) * (MIX_SETTINGS.variationDb[name] ?? 0);
}

function clampToLimits(value, { min, max }) {
    return Math.min(max, Math.max(min, value));
}

function roundVolume(value) {
    return Math.round(value * 10) / 10;
}
