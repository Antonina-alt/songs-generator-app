'use client';

import { Box, Button } from '@mui/material';
import { useAudioPreview } from '@/hooks/useAudioPreview';
import { LyricsDisplay } from './LyricsDisplay';

export function AudioPlayer({ music, lyrics }) {
    const playback = useAudioPreview(music, lyrics);
    return <Box><PreviewButton music={music} playback={playback} /><PreviewLyrics lyrics={lyrics} playback={playback} /></Box>;
}

function PreviewButton({ music, playback }) {
    return <Button variant="outlined" onClick={playback.togglePreview} disabled={!canPlay(music)}>{getButtonLabel(playback)}</Button>;
}

function PreviewLyrics({ lyrics, playback }) {
    return <LyricsDisplay lyrics={lyrics} currentTime={playback.currentTime} isPlaying={playback.isPlaying} />;
}

function getButtonLabel({ isPlaying }) {
    return isPlaying ? 'Stop preview' : 'Play preview';
}

function canPlay(music) {
    return Boolean(music?.tempo);
}
