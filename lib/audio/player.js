import * as Tone from 'tone';
import {
    DEFAULT_PREVIEW_SECONDS,
    FADE_IN_SECONDS,
    FADE_OUT_SECONDS,
    MASTER_VOLUME,
    PREVIEW_TICK_MS,
    SILENCE_VOLUME
} from './constants';
import { createSongParts } from './parts';
import { createAudioGraph } from './synths';

export function createPlayer(music, setCurrentTime, onDone) {
    resetTransport(music.tempo);
    return startPlayer(createPlayerContext(music, setCurrentTime, onDone));
}

export function disposePlayer(player) {
    if (!player) return;
    stopTransport();
    clearPlayerTimers(player);
    disposeAudioNodes(player);
}

export function resetTransport(tempo) {
    stopTransport();
    Tone.Transport.bpm.value = tempo;
    Tone.Transport.seconds = 0;
}

function createPlayerContext(music, setCurrentTime, onDone) {
    return { music, setCurrentTime, onDone, duration: getDuration(music), audioGraph: createAudioGraph(music) };
}

function startPlayer(context) {
    scheduleMasterEnvelope(context.audioGraph.masterBus, context.duration);
    Tone.Transport.start('+0.05');
    return createPlayerResponse(context);
}

function createPlayerResponse(context) {
    return { ...context.audioGraph, ...createSongParts(context.audioGraph, context.music), ...createTimers(context) };
}

function getDuration(music) {
    return music.durationSeconds || DEFAULT_PREVIEW_SECONDS;
}

function stopTransport() {
    Tone.Transport.stop();
    Tone.Transport.cancel();
}

function scheduleMasterEnvelope(masterBus, durationSeconds) {
    scheduleFadeIn(masterBus, Tone.now());
    Tone.Transport.scheduleOnce((time) => scheduleFadeOut(masterBus, time), getFadeOutStart(durationSeconds));
}

function scheduleFadeIn(masterBus, time) {
    resetVolumeEnvelope(masterBus, time, SILENCE_VOLUME);
    masterBus.volume.linearRampToValueAtTime(MASTER_VOLUME, time + FADE_IN_SECONDS);
}

function scheduleFadeOut(masterBus, time) {
    resetVolumeEnvelope(masterBus, time, masterBus.volume.value);
    masterBus.volume.linearRampToValueAtTime(SILENCE_VOLUME, time + FADE_OUT_SECONDS);
}

function resetVolumeEnvelope(masterBus, time, volume) {
    masterBus.volume.cancelScheduledValues(time);
    masterBus.volume.setValueAtTime(volume, time);
}

function getFadeOutStart(durationSeconds) {
    return Math.max(0, durationSeconds - FADE_OUT_SECONDS);
}

function createTimers({ duration, setCurrentTime, onDone }) {
    return { intervalId: createProgressTimer(setCurrentTime), timeoutId: createStopTimer(duration, onDone) };
}

function createProgressTimer(setCurrentTime) {
    return setInterval(() => setCurrentTime(Tone.Transport.seconds), PREVIEW_TICK_MS);
}

function createStopTimer(duration, onDone) {
    return setTimeout(onDone, (duration + 0.15) * 1000);
}

function clearPlayerTimers(player) {
    clearTimeout(player.timeoutId);
    clearInterval(player.intervalId);
}

function disposeAudioNodes(player) {
    Object.values(player).forEach(disposeAudioNode);
}

function disposeAudioNode(value) {
    if (value?.dispose) value.dispose();
}
