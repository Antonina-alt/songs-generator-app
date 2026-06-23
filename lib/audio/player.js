import * as Tone from 'tone';
import { DEFAULT_PREVIEW_SECONDS, PREVIEW_TICK_MS } from './constants';
import { createSongParts } from './parts';
import { createAudioGraph } from './synths';

export async function createPlayer(music, lyrics, setCurrentTime, onDone) {
    resetTransport(music.tempo);
    const audioGraph = createAudioGraph(music);
    const parts = await createSongParts(audioGraph, music, lyrics);
    Tone.Transport.start();
    return { ...audioGraph, ...parts, ...createTimers(music, setCurrentTime, onDone) };
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

function stopTransport() {
    Tone.Transport.stop();
    Tone.Transport.cancel();
}

function createTimers(music, setCurrentTime, onDone) {
    return {
        intervalId: createProgressTimer(setCurrentTime),
        timeoutId: createStopTimer(music, onDone)
    };
}

function createProgressTimer(setCurrentTime) {
    return setInterval(() => {
        setCurrentTime(Tone.Transport.seconds);
    }, PREVIEW_TICK_MS);
}

function createStopTimer(music, onDone) {
    const duration = music.durationSeconds || DEFAULT_PREVIEW_SECONDS;
    return setTimeout(onDone, duration * 1000);
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
