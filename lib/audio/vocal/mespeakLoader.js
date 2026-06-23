import { clamp } from '../../utils/math';
import { BASE_MIDI, FALLBACK_REGION, MESPEAK_CONFIG_PATH, MESPEAK_VOICES } from './constants';
import { getRawAudioContext } from './environment';

let configPromise = null;
const voicePromises = new Map();
const decodedVoiceCache = new Map();

export async function loadMespeakVoice(region) {
    await loadMespeakConfig();
    return loadVoice(getVoicePath(region));
}

export function getVoiceBuffer(event, music) {
    const cacheKey = createVoiceCacheKey(event, music);
    if (!decodedVoiceCache.has(cacheKey)) decodedVoiceCache.set(cacheKey, decodeVoice(event, music));
    return decodedVoiceCache.get(cacheKey);
}

function loadMespeakConfig() {
    if (window.meSpeak.isConfigLoaded?.()) return Promise.resolve();
    if (!configPromise) configPromise = createLoadConfigPromise();
    return configPromise;
}

function createLoadConfigPromise() {
    return new Promise((resolve) => window.meSpeak.loadConfig(MESPEAK_CONFIG_PATH, resolve));
}

function loadVoice(voicePath) {
    if (!voicePromises.has(voicePath)) voicePromises.set(voicePath, createLoadVoicePromise(voicePath));
    return voicePromises.get(voicePath);
}

function createLoadVoicePromise(voicePath) {
    return new Promise((resolve) => window.meSpeak.loadVoice(voicePath, resolve));
}

function getVoicePath(region) {
    return MESPEAK_VOICES[region] || MESPEAK_VOICES[FALLBACK_REGION];
}

function createVoiceCacheKey(event, music) {
    return [music?.region || FALLBACK_REGION, event.text, getMespeakPitch(event), getSpeechSpeed(music)].join(':');
}

async function decodeVoice(event, music) {
    const speechData = createSpeechData(event, music);
    return getRawAudioContext().decodeAudioData(speechData.slice(0));
}

function createSpeechData(event, music) {
    return window.meSpeak.speak(event.text, createSpeechOptions(event, music));
}

function createSpeechOptions(event, music) {
    return { rawdata: 'ArrayBuffer', pitch: getMespeakPitch(event), speed: getSpeechSpeed(music), wordgap: 0 };
}

function getMespeakPitch(event) {
    return clamp(Math.round(48 + (event.midi - BASE_MIDI) * 0.65), 36, 68);
}

function getSpeechSpeed(music) {
    if (!music?.tempo) return 145;
    return clamp(Math.round(music.tempo * 1.05), 115, 165);
}
