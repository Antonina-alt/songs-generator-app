'use client';

import { useEffect, useRef, useState } from 'react';
import * as Tone from 'tone';

const PREVIEW_TICK_MS = 100;
const MELODY_STEP_SECONDS = 0.35;
const DEFAULT_PREVIEW_SECONDS = 12;
const DEFAULT_MELODY_VELOCITY = 0.7;

export function useAudioPreview(music) {
    const playerRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);

    useEffect(() => () => disposePlayer(playerRef.current), []);

    async function togglePreview() {
        if (!canPlay(music)) return;
        if (isPlaying) return stopPreview(playerRef, setIsPlaying, setCurrentTime);
        await startPreview(music, playerRef, setIsPlaying, setCurrentTime);
    }

    return { isPlaying, currentTime, togglePreview };
}

function canPlay(music) {
    return Boolean(music?.tempo);
}

async function startPreview(music, playerRef, setIsPlaying, setCurrentTime) {
    await Tone.start();
    stopPreview(playerRef, setIsPlaying, setCurrentTime);
    playerRef.current = createPlayer(music, setCurrentTime, () => {
        stopPreview(playerRef, setIsPlaying, setCurrentTime);
    });
    setIsPlaying(true);
}

function stopPreview(playerRef, setIsPlaying, setCurrentTime) {
    disposePlayer(playerRef.current);
    playerRef.current = null;
    resetPlaybackState(setIsPlaying, setCurrentTime);
}

function resetPlaybackState(setIsPlaying, setCurrentTime) {
    setCurrentTime(0);
    setIsPlaying(false);
}

function createPlayer(music, setCurrentTime, onDone) {
    resetTransport(music.tempo);
    const audioGraph = createAudioGraph(music);
    const parts = createSongParts(audioGraph, music);
    const timers = createTimers(music, setCurrentTime, onDone);
    Tone.Transport.start();
    return { ...audioGraph, ...parts, ...timers };
}

function resetTransport(tempo) {
    Tone.Transport.stop();
    Tone.Transport.cancel();
    Tone.Transport.bpm.value = tempo;
    Tone.Transport.seconds = 0;
}

function createAudioGraph(music) {
    const effects = createEffects();
    return {
        ...effects,
        ...createSynths(music, effects),
        ...createPercussion()
    };
}

function createEffects() {
    const reverb = createReverb();
    const delay = createDelay(reverb);
    return { reverb, delay };
}

function createReverb() {
    return new Tone.Reverb({ decay: 2.5, wet: 0.25 }).toDestination();
}

function createDelay(reverb) {
    return new Tone.FeedbackDelay({
        delayTime: '8n',
        feedback: 0.25,
        wet: 0.18
    }).connect(reverb);
}

function createSynths(music, { delay, reverb }) {
    return {
        melodySynth: createMelodySynth(music).connect(delay),
        chordSynth: createChordSynth().connect(reverb),
        bassSynth: createBassSynth().toDestination()
    };
}

function createPercussion() {
    return {
        kick: createKickSynth(),
        hat: createHatSynth()
    };
}

function createMelodySynth(music) {
    return new Tone.Synth({
        oscillator: { type: music.synthPreset?.oscillator || 'triangle' },
        envelope: createMelodyEnvelope(music)
    });
}

function createMelodyEnvelope(music) {
    return {
        attack: music.synthPreset?.attack ?? 0.02,
        decay: 0.15,
        sustain: 0.35,
        release: music.synthPreset?.release ?? 0.4
    };
}

function createChordSynth() {
    return new Tone.PolySynth(Tone.Synth, {
        oscillator: { type: 'sine' },
        envelope: createChordEnvelope(),
        volume: -10
    });
}

function createChordEnvelope() {
    return {
        attack: 0.08,
        decay: 0.2,
        sustain: 0.4,
        release: 0.8
    };
}

function createBassSynth() {
    return new Tone.MonoSynth({
        oscillator: { type: 'square' },
        filter: createBassFilter(),
        envelope: createBassEnvelope(),
        volume: -8
    });
}

function createBassFilter() {
    return {
        Q: 2,
        type: 'lowpass',
        rolloff: -24
    };
}

function createBassEnvelope() {
    return {
        attack: 0.01,
        decay: 0.2,
        sustain: 0.4,
        release: 0.3
    };
}

function createKickSynth() {
    return new Tone.MembraneSynth({
        pitchDecay: 0.05,
        octaves: 6,
        oscillator: { type: 'sine' },
        envelope: createKickEnvelope()
    }).toDestination();
}

function createKickEnvelope() {
    return {
        attack: 0.001,
        decay: 0.3,
        sustain: 0.01,
        release: 0.2
    };
}

function createHatSynth() {
    return new Tone.NoiseSynth({
        noise: { type: 'white' },
        envelope: createHatEnvelope()
    }).toDestination();
}

function createHatEnvelope() {
    return {
        attack: 0.001,
        decay: 0.05,
        sustain: 0
    };
}

function createSongParts(audioGraph, music) {
    return {
        melodyPart: createMelodyPart(audioGraph.melodySynth, music.melody),
        chordPart: createChordPart(audioGraph.chordSynth, music.chords),
        bassPart: createBassPart(audioGraph.bassSynth, music.bass),
        drumPart: createDrumPart(audioGraph, music.drums)
    };
}

function createMelodyPart(synth, melody = []) {
    return createStartedPart(playMelodyNote(synth), createMelodyEvents(melody));
}

function createMelodyEvents(melody) {
    return melody.map((item, index) => ({
        ...item,
        time: index * MELODY_STEP_SECONDS
    }));
}

function playMelodyNote(synth) {
    return (time, value) => {
        synth.triggerAttackRelease(
            value.note,
            value.duration,
            time,
            value.velocity ?? DEFAULT_MELODY_VELOCITY
        );
    };
}

function createChordPart(synth, chords = []) {
    return createStartedPart(playChord(synth), createChordEvents(chords));
}

function createChordEvents(chords) {
    return chords
        .map((chord, index) => createChordEvent(chord, index))
        .filter((event) => event.notes.length);
}

function createChordEvent(chord, index) {
    return {
        time: index * 2,
        notes: createChordNotes(chord)
    };
}

function createChordNotes(chord) {
    return chord.notes?.map((note) => `${note}4`) || [];
}

function playChord(synth) {
    return (time, value) => {
        synth.triggerAttackRelease(value.notes, '2n', time, 0.35);
    };
}

function createBassPart(synth, bass = []) {
    return createStartedPart(playBassNote(synth), bass);
}

function playBassNote(synth) {
    return (time, value) => {
        synth.triggerAttackRelease(value.note, value.duration, time, value.velocity);
    };
}

function createDrumPart({ kick, hat }, drums = []) {
    return createStartedPart(playDrum({ kick, hat }), drums);
}

function playDrum({ kick, hat }) {
    return (time, value) => {
        const drum = value.type === 'kick' ? kick : hat;
        const note = value.type === 'kick' ? 'C1' : '32n';
        drum.triggerAttackRelease(note, '8n', time);
    };
}

function createStartedPart(callback, events) {
    const part = new Tone.Part(callback, events);
    part.start(0);
    return part;
}

function createTimers(music, setCurrentTime, onDone) {
    const intervalId = createProgressTimer(setCurrentTime);
    const timeoutId = createStopTimer(music, onDone);
    return { intervalId, timeoutId };
}

function createProgressTimer(setCurrentTime) {
    const startedAt = Date.now();
    return setInterval(() => {
        setCurrentTime((Date.now() - startedAt) / 1000);
    }, PREVIEW_TICK_MS);
}

function createStopTimer(music, onDone) {
    const duration = music.durationSeconds || DEFAULT_PREVIEW_SECONDS;
    return setTimeout(onDone, duration * 1000);
}

function disposePlayer(player) {
    if (!player) return;
    stopTransport();
    clearPlayerTimers(player);
    disposeAudioNodes(player);
}

function stopTransport() {
    Tone.Transport.stop();
    Tone.Transport.cancel();
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