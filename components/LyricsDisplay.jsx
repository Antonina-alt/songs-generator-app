'use client';

import { useEffect, useId } from 'react';
import { Box, Typography } from '@mui/material';

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

const lineBaseStyles = {
    pl: 1.5,
    py: 0.4,
    transformOrigin: 'left center',
    transition: 'all 0.2s ease'
};

const lineStates = {
    active: { fontWeight: 700, opacity: 1, transform: 'scale(1.02)' },
    inactive: { fontWeight: 400, opacity: 0.55, transform: 'scale(1)' }
};

export function LyricsDisplay({ lyrics = [], currentTime = 0, isPlaying = false, uiText }) {
    if (!lyrics.length) return null;
    return <LyricsPanel lyrics={lyrics} currentTime={currentTime} isPlaying={isPlaying} uiText={uiText} />;
}

function LyricsPanel({ lyrics, currentTime, isPlaying, uiText }) {
    const lyricsId = useId();
    const activeIndex = getActiveLineIndex(lyrics, currentTime);
    const activeLineId = createLineId(lyricsId, activeIndex);

    useActiveLineScroll({ lyricsId, activeLineId, isPlaying });
    return <LyricsBox lyricsId={lyricsId} lyrics={lyrics} activeIndex={activeIndex} activeLineId={activeLineId} isPlaying={isPlaying} uiText={uiText} />;
}

function LyricsBox({ lyricsId, lyrics, activeIndex, activeLineId, isPlaying, uiText }) {
    return <Box id={lyricsId} sx={lyricsStyles}><LyricsTitle uiText={uiText} />{lyrics.map((line, index) => renderLine({ line, index, activeIndex, activeLineId, isPlaying }))}</Box>;
}

function renderLine(context) {
    const isActiveLine = isActive(context.index, context.activeIndex, context.isPlaying);
    return <LyricsLine key={createLineKey(context.line)} line={context.line} id={getLineId(context, isActiveLine)} isActive={isActiveLine} />;
}

function LyricsLine({ line, id, isActive }) {
    return <Typography id={id} sx={createLineStyles(isActive)}>{line.text}</Typography>;
}

function useActiveLineScroll(context) {
    useEffect(() => scrollActiveLine(context), [context.lyricsId, context.activeLineId, context.isPlaying]);
}

function scrollActiveLine({ lyricsId, activeLineId, isPlaying }) {
    if (!isPlaying) return;
    centerActiveLine(getElement(lyricsId), getElement(activeLineId));
}

function centerActiveLine(container, line) {
    if (container && line) container.scrollTop = Math.max(0, getTargetScrollTop(container, line));
}

function getTargetScrollTop(container, line) {
    return getLineTopInsideContainer(container, line) - container.clientHeight / 2 + line.offsetHeight / 2;
}

function getLineTopInsideContainer(container, line) {
    return line.getBoundingClientRect().top - container.getBoundingClientRect().top + container.scrollTop;
}

function createLineStyles(isActive) {
    return { ...lineBaseStyles, ...lineStates[isActive ? 'active' : 'inactive'] };
}

function getLineId({ activeLineId }, isActiveLine) {
    return isActiveLine ? activeLineId : undefined;
}

function getElement(id) {
    return document.getElementById(id);
}

function isActive(index, activeIndex, isPlaying) {
    return isPlaying && index === activeIndex;
}

function createLineKey(line) {
    return `${line.time}-${line.text}`;
}

function createLineId(lyricsId, index) {
    return `${lyricsId}-line-${index}`;
}

function LyricsTitle({ uiText }) {
    return <Typography variant="subtitle2" sx={{ mb: 1 }}>{uiText.player.lyrics}</Typography>;
}

function getActiveLineIndex(lyrics, currentTime) {
    const index = lyrics.findIndex((line, index) => isActiveLine(lyrics, line, index, currentTime));
    return index === -1 ? 0 : index;
}

function isActiveLine(lyrics, line, index, currentTime) {
    const nextLine = lyrics[index + 1];
    return currentTime >= line.time && (!nextLine || currentTime < nextLine.time);
}
