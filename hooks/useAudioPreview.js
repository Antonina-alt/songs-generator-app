'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import * as Tone from 'tone';
import { createPlayer, disposePlayer } from '@/lib/audio/player';

export function useAudioPreview(music) {
    const refs = usePreviewRefs();
    const [playback, setPlayback] = useState(createIdlePlayback);
    usePreviewCleanup(refs);
    return usePlaybackApi(music, playback, refs, setPlayback);
}

function usePreviewRefs() {
    return { playerRef: useRef(null), requestRef: useRef(0) };
}

function usePreviewCleanup({ playerRef, requestRef }) {
    useEffect(() => createCleanup({ playerRef, requestRef }), [playerRef, requestRef]);
}

function usePlaybackApi(music, playback, refs, setPlayback) {
    const togglePreview = useTogglePreview(music, playback.status, refs.playerRef, refs.requestRef, setPlayback);
    return createPlaybackApi(playback, togglePreview);
}

function useTogglePreview(music, status, playerRef, requestRef, setPlayback) {
    return useCallback(() => handleToggle({ music, status, playerRef, requestRef, setPlayback }), [music, status, playerRef, requestRef, setPlayback]);
}

function createPlaybackApi(playback, togglePreview) {
    return { ...createPlaybackFlags(playback), currentTime: playback.currentTime, togglePreview };
}

function createPlaybackFlags({ status }) {
    return { isPlaying: status === 'playing', isLoading: status === 'loading' };
}

function createIdlePlayback() {
    return { status: 'idle', currentTime: 0 };
}

function createLoadingPlayback() {
    return { status: 'loading', currentTime: 0 };
}

function createPlayingPlayback() {
    return { status: 'playing', currentTime: 0 };
}

function createCleanup(context) {
    return () => disposePreview(context);
}

function handleToggle(context) {
    if (!canToggle(context)) return;
    if (context.status === 'playing') return stopPreview(context);
    return startPreview(context);
}

function canToggle({ music, status }) {
    return Boolean(music?.tempo) && status !== 'loading';
}

async function startPreview(context) {
    const requestId = createRequest(context.requestRef);
    setPlaybackState(context, createLoadingPlayback());

    try {
        return await createPreview(context, requestId);
    } catch {
        return stopPreview(context);
    }
}

function createRequest(requestRef) {
    requestRef.current += 1;
    return requestRef.current;
}

async function createPreview(context, requestId) {
    await Tone.start();
    if (!isLatestRequest(context.requestRef, requestId)) return;
    startPlayer(context);
    setPlaybackState(context, createPlayingPlayback());
}

function startPlayer(context) {
    clearPlayer(context.playerRef);
    context.playerRef.current = createPlayer(context.music, setCurrentTime(context.setPlayback), stopAction(context));
}

function stopAction(context) {
    return () => stopPreview(context);
}

function stopPreview(context) {
    disposePreview(context);
    context.setPlayback(createIdlePlayback());
}

function disposePreview({ playerRef, requestRef }) {
    createRequest(requestRef);
    clearPlayer(playerRef);
}

function clearPlayer(playerRef) {
    disposePlayer(playerRef.current);
    playerRef.current = null;
}

function setPlaybackState({ setPlayback }, state) {
    setPlayback(state);
}

function isLatestRequest(requestRef, requestId) {
    return requestId === requestRef.current;
}

function setCurrentTime(setPlayback) {
    return (currentTime) => setPlayback((playback) => ({ ...playback, currentTime }));
}
