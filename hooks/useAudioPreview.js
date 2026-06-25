'use client';

import { useCallback, useEffect, useId, useRef, useState } from 'react';
import * as Tone from 'tone';
import { createPlayer, disposePlayer } from '@/lib/audio/player';
import { activatePreview, deactivatePreview } from '@/lib/audio/previewCoordinator';

const PLAYBACK = {
    idle: 'idle',
    loading: 'loading',
    playing: 'playing'
};

export function useAudioPreview(music, previewId) {
    const fallbackId = useId();
    const id = previewId ?? fallbackId;
    const playerRef = useRef(null);
    const requestRef = useRef(0);
    const [playback, setPlayback] = useState(createIdlePlayback);

    const disposePreview = useCallback(() => {
        deactivatePreview(id);
        requestRef.current += 1;
        disposePlayer(playerRef.current);
        playerRef.current = null;
    }, [id]);

    const stopPreview = useCallback(() => {
        disposePreview();
        setPlayback(createIdlePlayback());
    }, [disposePreview]);

    const togglePreview = useCallback(async () => {
        if (!music?.tempo || playback.status === PLAYBACK.loading) return;
        if (playback.status === PLAYBACK.playing) return stopPreview();

        const requestId = requestRef.current + 1;
        requestRef.current = requestId;
        activatePreview(id, stopPreview);
        setPlayback(createLoadingPlayback());

        try {
            await Tone.start();
            if (requestId !== requestRef.current) return;

            disposePlayer(playerRef.current);
            playerRef.current = createPlayer(music, updateCurrentTime(setPlayback), stopPreview);
            setPlayback(createPlayingPlayback());
        } catch {
            stopPreview();
        }
    }, [id, music, playback.status, stopPreview]);

    useEffect(() => disposePreview, [disposePreview]);

    return {
        isPlaying: playback.status === PLAYBACK.playing,
        isLoading: playback.status === PLAYBACK.loading,
        currentTime: playback.currentTime,
        togglePreview
    };
}

function createIdlePlayback() {
    return { status: PLAYBACK.idle, currentTime: 0 };
}

function createLoadingPlayback() {
    return { status: PLAYBACK.loading, currentTime: 0 };
}

function createPlayingPlayback() {
    return { status: PLAYBACK.playing, currentTime: 0 };
}

function updateCurrentTime(setPlayback) {
    return (currentTime) => setPlayback((playback) => ({ ...playback, currentTime }));
}
