'use client';

import { Box, CardMedia } from '@mui/material';

export function SongCardCover({ song }) {
    return <CardMedia component="img" height="220" image={song.coverUrl} alt={getCoverAlt(song)} />;
}

export function SongDetailsCover({ song }) {
    return <Box component="img" src={song.coverUrl} alt={getCoverAlt(song)} sx={detailsCoverStyles} />;
}

function getCoverAlt(song) {
    return `${song.title} cover`;
}

const detailsCoverStyles = {
    width: 220,
    height: 220,
    objectFit: 'cover',
    borderRadius: 2
};
