'use client';

import { Box, Button } from '@mui/material';
import { useAudioPreview } from '@/hooks/useAudioPreview';
import { LyricsDisplay } from './LyricsDisplay';

export function AudioPlayer({ music, lyrics }) {
    const { isPlaying, currentTime, togglePreview } = useAudioPreview(music);

    const isDisabled = !music?.tempo;

    return (
        <Box>
            <Button variant="outlined" onClick={togglePreview} disabled={isDisabled}>
                {isPlaying ? 'Stop preview' : 'Play preview'}
            </Button>

            <LyricsDisplay
                lyrics={lyrics}
                currentTime={currentTime}
                isPlaying={isPlaying}
            />
        </Box>
    );
}