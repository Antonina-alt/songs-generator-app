'use client';

import { Box, Typography } from '@mui/material';

export function LyricsDisplay({ lyrics = [], currentTime = 0, isPlaying = false }) {
    if (!lyrics.length) {
        return null;
    }

    const activeIndex = getActiveLineIndex(lyrics, currentTime);

    return (
        <Box
            sx={{
                mt: 2,
                p: 2,
                borderRadius: 2,
                bgcolor: 'grey.100',
                maxHeight: 180,
                overflowY: 'auto'
            }}
        >
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Lyrics
            </Typography>

            {lyrics.map((line, index) => {
                const isActive = isPlaying && index === activeIndex;

                return (
                    <Typography
                        key={`${line.time}-${line.text}`}
                        sx={{
                            fontWeight: isActive ? 700 : 400,
                            opacity: isActive ? 1 : 0.55,
                            transform: isActive ? 'scale(1.02)' : 'scale(1)',
                            transition: 'all 0.2s ease'
                        }}
                    >
                        {line.text}
                    </Typography>
                );
            })}
        </Box>
    );
}

function getActiveLineIndex(lyrics, currentTime) {
    const index = lyrics.findIndex((line, lineIndex) => {
        const nextLine = lyrics[lineIndex + 1];

        return currentTime >= line.time && (!nextLine || currentTime < nextLine.time);
    });

    return index === -1 ? 0 : index;
}