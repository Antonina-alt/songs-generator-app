'use client';

import { useRef, useState } from 'react';
import * as Tone from 'tone';

export function useAudioPreview(music) {
    const playerRef = useRef(createEmptyPlayer());
    const [isPlaying, setIsPlaying] = useState(false);
    return { isPlaying, togglePreview: () => togglePreview(music, playerRef, isPlaying, setIsPlaying) };
}

function createEmptyPlayer() {
    return { part: null, synth: null, timeoutId: null };
}

async function togglePreview(music, playerRef, isPlaying, setIsPlaying) {
    if (isPlaying) return stopPreview(playerRef, setIsPlaying);
    await startPreview(music, playerRef, setIsPlaying);
}

async function startPreview(music, playerRef, setIsPlaying) {
    await Tone.start();
    playerRef.current = createPlayer(music, () => stopPreview(playerRef, setIsPlaying));
    setIsPlaying(true);
}

function stopPreview(playerRef, setIsPlaying) {
    disposePlayer(playerRef.current);
    playerRef.current = createEmptyPlayer();
    setIsPlaying(false);
}

function createPlayer(music, onDone) {
    Tone.Transport.bpm.value = music.tempo;
    const synth = new Tone.PolySynth(Tone.Synth).toDestination();
    const part = createPart(synth, music.melody);
    const timeoutId = setTimeout(onDone, 8000);
    Tone.Transport.start();
    return { synth, part, timeoutId };
}

function createPart(synth, melody) {
    const part = new Tone.Part(playNote(synth), createEvents(melody));
    part.start(0);
    return part;
}

function playNote(synth) {
    return (time, value) => synth.triggerAttackRelease(value.note, value.duration, time);
}

function createEvents(melody) {
    return melody.map((item, index) => ({ ...item, time: index * 0.35 }));
}

function disposePlayer({ part, synth, timeoutId }) {
    clearTimeout(timeoutId);
    Tone.Transport.stop();
    Tone.Transport.cancel();
    part?.dispose();
    synth?.dispose();
}
