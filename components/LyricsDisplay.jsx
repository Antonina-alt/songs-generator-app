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

export function LyricsDisplay({ lyrics = [], currentTime = 0, isPlaying = false, uiText }) {
    if (!lyrics.length) return null;
    return <LyricsPanel lyrics={lyrics} currentTime={currentTime} isPlaying={isPlaying} uiText={uiText} />;
}

function LyricsPanel({ lyrics, currentTime, isPlaying, uiText }) {
    const containerRef = useRef(null);
    const activeLineRef = useRef(null);
    const activeIndex = getActiveLineIndex(lyrics, currentTime);

    useActiveLineScroll(containerRef, activeLineRef, activeIndex, isPlaying);
    return <LyricsBox containerRef={containerRef} activeLineRef={activeLineRef} lyrics={lyrics} activeIndex={activeIndex} isPlaying={isPlaying} uiText={uiText} />;
}

function LyricsBox({ containerRef, activeLineRef, lyrics, activeIndex, isPlaying, uiText }) {
    return <Box ref={containerRef} sx={lyricsStyles}><LyricsTitle uiText={uiText} />{lyrics.map((line, index) => {
        const active = isActive(index, activeIndex, isPlaying);
        return <LyricsLine key={createLineKey(line)} ref={active ? activeLineRef : null} line={line} isActive={active} />;
    })}</Box>;
}

function useActiveLineScroll(containerRef, activeLineRef, activeIndex, isPlaying) {
    useEffect(() => scrollActiveLine(containerRef.current, activeLineRef.current, isPlaying), [activeIndex, activeLineRef, containerRef, isPlaying]);
}

function scrollActiveLine(container, line, isPlaying) {
    if (isPlaying && container && line) centerActiveLineInsideContainer(container, line);
}

function centerActiveLineInsideContainer(container, line) {
    container.scrollTop = Math.max(0, getTargetScrollTop(container, line));
}

function getTargetScrollTop(container, line) {
    return getLineTopInsideContainer(container, line) - container.clientHeight / 2 + line.offsetHeight / 2;
}

function getLineTopInsideContainer(container, line) {
    return line.getBoundingClientRect().top - container.getBoundingClientRect().top + container.scrollTop;
}

function isActive(index, activeIndex, isPlaying) {
    return isPlaying && index === activeIndex;
}

function createLineKey(line) {
    return `${line.time}-${line.text}`;
}

function LyricsTitle({ uiText }) {
    return <Typography variant="subtitle2" sx={{ mb: 1 }}>{uiText.player.lyrics}</Typography>;
}

const LyricsLine = forwardRef(function LyricsLine({ line, isActive }, ref) {
    return <Typography ref={ref} sx={createLineStyles(isActive)}>{line.text}</Typography>;
});

LyricsLine.displayName = 'LyricsLine';

function createLineStyles(isActive) {
    return { pl: 1.5, py: 0.4, fontWeight: isActive ? 700 : 400, opacity: isActive ? 1 : 0.55, transform: isActive ? 'scale(1.02)' : 'scale(1)', transformOrigin: 'left center', transition: 'all 0.2s ease' };
}

function getActiveLineIndex(lyrics, currentTime) {
    const index = lyrics.findIndex((line, index) => isActiveLine(lyrics, line, index, currentTime));
    return index === -1 ? 0 : index;
}

function isActiveLine(lyrics, line, index, currentTime) {
    const nextLine = lyrics[index + 1];
    return currentTime >= line.time && (!nextLine || currentTime < nextLine.time);
}
