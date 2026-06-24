'use client';

import { Box, CardMedia } from '@mui/material';

const detailsCoverStyles = {
    width: 220,
    height: 220,
    objectFit: 'cover',
    borderRadius: 2
};

export function SongCardCover({ song, uiText }) {
    return <CardMedia {...createCardCoverProps(song, uiText)} />;
}

export function SongDetailsCover({ song, uiText }) {
    return <Box {...createDetailsCoverProps(song, uiText)} />;
}

function createCardCoverProps(song, uiText) {
    return { component: 'img', height: '220', image: song.coverUrl, alt: getCoverAlt(song, uiText) };
}

function createDetailsCoverProps(song, uiText) {
    return { component: 'img', src: song.coverUrl, alt: getCoverAlt(song, uiText), sx: detailsCoverStyles };
}

function getCoverAlt(song, uiText) {
    return uiText.song.coverAlt(song.title);
}
