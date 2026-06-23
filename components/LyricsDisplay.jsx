'use client';

import { Box, Typography } from '@mui/material';
import { forwardRef, useEffect, useRef } from 'react';

const lyricsStyles = {
    mt: 2,
    p: 2,
    pl: 4,
    borderRadius: 2,
    bgcolor: 'grey.100',
    maxHeight: 180,
    overflowY: 'auto',
    scrollBehavior: 'smooth'
};

export function LyricsDisplay({ lyrics = [], currentTime = 0, isPlaying = false }) {
    if (!lyrics.length) return null;

    return (
        <LyricsPanel
            lyrics={lyrics}
            currentTime={currentTime}
            isPlaying={isPlaying}
        />
    );
}

function LyricsPanel({ lyrics, currentTime, isPlaying }) {
    const containerRef = useRef(null);
    const activeLineRef = useRef(null);
    const activeIndex = getActiveLineIndex(lyrics, currentTime);

    useEffect(() => {
        if (!isPlaying) return;
        if (!containerRef.current || !activeLineRef.current) return;

        centerActiveLineInsideContainer(containerRef.current, activeLineRef.current);
    }, [activeIndex, isPlaying]);

    return (
        <Box ref={containerRef} sx={lyricsStyles}>
            <LyricsTitle />

            {lyrics.map((line, index) => {
                const isActive = isPlaying && index === activeIndex;

                return (
                    <LyricsLine
                        key={`${line.time}-${line.text}`}
                        ref={isActive ? activeLineRef : null}
                        line={line}
                        isActive={isActive}
                    />
                );
            })}
        </Box>
    );
}

function centerActiveLineInsideContainer(container, line) {
    const containerRect = container.getBoundingClientRect();
    const lineRect = line.getBoundingClientRect();

    const lineTopInsideContainer = lineRect.top - containerRect.top + container.scrollTop;
    const targetScrollTop = lineTopInsideContainer - container.clientHeight / 2 + line.offsetHeight / 2;

    container.scrollTop = Math.max(0, targetScrollTop);
}

function LyricsTitle() {
    return (
        <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Lyrics
        </Typography>
    );
}

const LyricsLine = forwardRef(function LyricsLine({ line, isActive }, ref) {
    return (
        <Typography ref={ref} sx={createLineStyles(isActive)}>
            {line.text}
        </Typography>
    );
});

function createLineStyles(isActive) {
    return {
        pl: 1.5,
        py: 0.4,
        fontWeight: isActive ? 700 : 400,
        opacity: isActive ? 1 : 0.55,
        transform: isActive ? 'scale(1.02)' : 'scale(1)',
        transformOrigin: 'left center',
        transition: 'all 0.2s ease'
    };
}

function getActiveLineIndex(lyrics, currentTime) {
    const index = lyrics.findIndex((line, index) =>
        isActiveLine(lyrics, line, index, currentTime)
    );

    return index === -1 ? 0 : index;
}

function isActiveLine(lyrics, line, index, currentTime) {
    const nextLine = lyrics[index + 1];

    return currentTime >= line.time && (!nextLine || currentTime < nextLine.time);
}