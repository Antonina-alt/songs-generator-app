'use client';

import { Box, Button } from '@mui/material';
import { useAudioPreview } from '@/hooks/useAudioPreview';
import { LyricsDisplay } from './LyricsDisplay';

export function AudioPlayer({ music, lyrics, uiText, previewId }) {
    const playback = useAudioPreview(music, previewId);
    return <Box><PreviewButton music={music} playback={playback} uiText={uiText} /><PreviewLyrics lyrics={lyrics} playback={playback} uiText={uiText} /></Box>;
}

function PreviewButton({ music, playback, uiText }) {
    return <Button
        variant="outlined"
        onClick={playback.togglePreview}
        disabled={!canPlay(music) || playback.isLoading}
    >
        {getButtonLabel(playback, uiText)}
    </Button>;
}

function PreviewLyrics({ lyrics, playback, uiText }) {
    return <LyricsDisplay lyrics={lyrics} currentTime={playback.currentTime} isPlaying={playback.isPlaying} uiText={uiText} />;
}

function getButtonLabel({ isPlaying, isLoading }, uiText) {
    if (isLoading) return uiText.player.loadingPreview;
    return isPlaying ? uiText.player.stopPreview : uiText.player.playPreview;
}

function canPlay(music) {
    return Boolean(music?.tempo);
}
