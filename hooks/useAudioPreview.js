'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import * as Tone from 'tone';
import { createPlayer, disposePlayer } from '@/lib/audio/player';

export function useAudioPreview(music, lyrics = []) {
    const playerRef = useRef(null);
    const [playback, setPlayback] = useState(createInitialPlayback);
    const togglePreview = useTogglePreview(music, lyrics, playerRef, playback.isPlaying, setPlayback);

    usePlayerCleanup(playerRef);
    return { ...playback, togglePreview };
}

function usePlayerCleanup(playerRef) {
    useEffect(() => () => clearPlayer(playerRef), [playerRef]);
}

function useTogglePreview(music, lyrics, playerRef, isPlaying, setPlayback) {
    return useCallback(() => togglePreview({ music, lyrics, playerRef, isPlaying, setPlayback }), [music, lyrics, playerRef, isPlaying, setPlayback]);
}

async function togglePreview(context) {
    if (!canPlay(context.music)) return;
    if (context.isPlaying) return stopPreview(context);
    await startPreview(context);
}

function createInitialPlayback() {
    return { isPlaying: false, currentTime: 0 };
}

function canPlay(music) {
    return Boolean(music?.tempo);
}

async function startPreview(context) {
    await Tone.start();
    stopPreview(context);
    context.playerRef.current = await createPreviewPlayer(context);
    context.setPlayback({ isPlaying: true, currentTime: 0 });
}

function createPreviewPlayer({ music, lyrics, playerRef, setPlayback }) {
    return createPlayer(music, lyrics, setCurrentTime(setPlayback), () => stopPreview({ playerRef, setPlayback }));
}

function stopPreview({ playerRef, setPlayback }) {
    clearPlayer(playerRef);
    setPlayback(createInitialPlayback());
}

function clearPlayer(playerRef) {
    disposePlayer(playerRef.current);
    playerRef.current = null;
}

function setCurrentTime(setPlayback) {
    return (currentTime) => setPlayback((playback) => ({ ...playback, currentTime }));
}
