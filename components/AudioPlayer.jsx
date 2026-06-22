'use client';

import { Button } from '@mui/material';
import { useAudioPreview } from '@/hooks/useAudioPreview';

export function AudioPlayer({ music }) {
    const { isPlaying, togglePreview } = useAudioPreview(music);
    return <Button variant="outlined" onClick={togglePreview}>{isPlaying ? 'Stop preview' : 'Play preview'}</Button>;
}
