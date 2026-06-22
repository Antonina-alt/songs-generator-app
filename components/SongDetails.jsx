'use client';

import { Box, Typography } from '@mui/material';
import { AudioPlayer } from './AudioPlayer';
import { SongDetailsCover } from './song/SongCover';
import { SongDetailsMeta } from './song/SongMeta';

export function SongDetails({ song }) {
    return <Box sx={detailsStyles}><SongDetailsCover song={song} /><SongDetailsContent song={song} /></Box>;
}

function SongDetailsContent({ song }) {
    return <Box><SongDetailsMeta song={song} /><AudioPlayer music={song.music} /><Typography sx={{ mt: 2 }}>{song.review}</Typography></Box>;
}

const detailsStyles = { display: 'flex', gap: 3, p: 3 };
