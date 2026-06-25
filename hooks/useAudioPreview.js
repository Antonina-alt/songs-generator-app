'use client';

import { useCallback, useEffect, useId, useRef, useState } from 'react';
import * as Tone from 'tone';
import { createPlayer, disposePlayer } from '@/lib/audio/player';
import { activatePreview, deactivatePreview } from '@/lib/audio/previewCoordinator';

export function useAudioPreview(music, previewId) {
    const fallbackId = useId();
    const id = previewId ?? fallbackId;
    const refs = usePreviewRefs();
    const [playback, setPlayback] = useState(createIdlePlayback);
    usePreviewCleanup(refs, id);
    return usePlaybackApi(music, id, playback, refs, setPlayback);
}

function usePreviewRefs() {
    return { playerRef: useRef(null), requestRef: useRef(0) };
}

function usePreviewCleanup({ playerRef, requestRef }, previewId) {
    useEffect(() => createCleanup({ playerRef, requestRef, previewId }), [playerRef, requestRef, previewId]);
}

function usePlaybackApi(music, previewId, playback, refs, setPlayback) {
    const togglePreview = useTogglePreview(music, previewId, playback.status, refs.playerRef, refs.requestRef, setPlayback);
    return createPlaybackApi(playback, togglePreview);
}

function useTogglePreview(music, previewId, status, playerRef, requestRef, setPlayback) {
    return useCallback(
        () => handleToggle({ music, previewId, status, playerRef, requestRef, setPlayback }),
        [music, previewId, status, playerRef, requestRef, setPlayback]
    );
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
    return () => {
        deactivatePreview(context.previewId);
        disposePreview(context);
    };
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
    activatePreview(context.previewId, () => stopPreview(context));
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
    deactivatePreview(context.previewId);
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
