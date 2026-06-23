'use client';

import { Box, CardMedia } from '@mui/material';

export function SongCardCover({ song, uiText }) {
    return <CardMedia component="img" height="220" image={song.coverUrl} alt={getCoverAlt(song, uiText)} />;
}

export function SongDetailsCover({ song, uiText }) {
    return <Box component="img" src={song.coverUrl} alt={getCoverAlt(song, uiText)} sx={detailsCoverStyles} />;
}

function getCoverAlt(song, uiText) {
    return uiText.song.coverAlt(song.title);
}

const detailsCoverStyles = {
    width: 220,
    height: 220,
    objectFit: 'cover',
    borderRadius: 2
};
