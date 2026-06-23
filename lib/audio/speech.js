import { DEFAULT_SPEECH_LANGUAGE } from './constants';
import * as Tone from 'tone';

export function createVocalSpeechSchedule(lyrics = [], music) {
    if (!canUseSpeechSynthesis() || !lyrics.length) return [];

    window.speechSynthesis.cancel();

    return lyrics.map((line) => {
        return Tone.Transport.schedule(() => {
            speakLyricLine(line.text, music);
        }, line.time);
    });
}

export function clearVocalSpeech(eventIds = []) {
    eventIds.forEach((eventId) => {
        Tone.Transport.clear(eventId);
    });

    cancelSpeech();
}

function speakLyricLine(text, music) {
    if (!canUseSpeechSynthesis()) return;
    window.speechSynthesis.speak(createUtterance(text, music));
}

function createUtterance(text, music) {
    const utterance = new SpeechSynthesisUtterance(text);
    Object.assign(utterance, createUtteranceOptions(music));
    return utterance;
}

function createUtteranceOptions(music) {
    return {
        lang: getSpeechLanguage(music),
        rate: getSpeechRate(music),
        pitch: getSpeechPitch(music),
        volume: 1
    };
}

function getSpeechLanguage(music) {
    return music?.region || DEFAULT_SPEECH_LANGUAGE;
}

function getSpeechRate(music) {
    if (!music?.tempo) return 1;
    if (music.tempo < 90) return 0.75;
    return music.tempo > 135 ? 1.15 : 0.95;
}

function getSpeechPitch(music) {
    return music?.mode === 'minor' ? 0.75 : 1.25;
}

function cancelSpeech() {
    if (canUseSpeechSynthesis()) window.speechSynthesis.cancel();
}

function canUseSpeechSynthesis() {
    return typeof window !== 'undefined' && 'speechSynthesis' in window;
}
