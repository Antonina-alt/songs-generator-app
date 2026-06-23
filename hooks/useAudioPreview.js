'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import * as Tone from 'tone';
import { createPlayer, disposePlayer } from '@/lib/audio/player';

export function useAudioPreview(music, lyrics = []) {
    const playerRef = useRef(null);
    const [playback, setPlayback] = useState(createInitialPlayback);

    useEffect(() => () => {
        disposePlayer(playerRef.current);
        playerRef.current = null;
    }, []);

    const togglePreview = useCallback(async () => {
        if (!canPlay(music)) return;
        if (playback.isPlaying) return stopPreview({ playerRef, setPlayback });
        await startPreview({ music, lyrics, playerRef, setPlayback });
    }, [music, lyrics, playback.isPlaying]);

    return { ...playback, togglePreview };
}

function createInitialPlayback() {
    return { isPlaying: false, currentTime: 0 };
}

function canPlay(music) {
    return Boolean(music?.tempo);
}

async function startPreview({ music, lyrics, playerRef, setPlayback }) {
    await Tone.start();
    stopPreview({ playerRef, setPlayback });
    playerRef.current = await createPlayer(music, lyrics, setCurrentTime(setPlayback), () => stopPreview({ playerRef, setPlayback }));
    setPlayback({ isPlaying: true, currentTime: 0 });
}

function stopPreview({ playerRef, setPlayback }) {
    disposePlayer(playerRef.current);
    playerRef.current = null;
    setPlayback(createInitialPlayback());
}

function setCurrentTime(setPlayback) {
    return (currentTime) => setPlayback((playback) => ({ ...playback, currentTime }));
}