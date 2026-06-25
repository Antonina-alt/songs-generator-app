'use client';

import { Box, Typography } from '@mui/material';
import { SongPreview } from './song/SongPreview';
import { SongDetailsCover } from './song/SongCover';
import { SongDetailsMeta } from './song/SongMeta';

const detailsStyles = { display: 'flex', gap: 3, p: 3 };

export function SongDetails({ song, uiText }) {
    return <Box sx={detailsStyles}><SongDetailsCover song={song} uiText={uiText} /><SongDetailsContent song={song} uiText={uiText} /></Box>;
}

function SongDetailsContent({ song, uiText }) {
    return <Box><SongDetailsMeta song={song} /><SongPreview song={song} uiText={uiText} /><Typography sx={{ mt: 2 }}>{song.review}</Typography></Box>;
}

