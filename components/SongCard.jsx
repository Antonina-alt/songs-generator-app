'use client';

import { Box, Card, CardContent } from '@mui/material';
import { SongPreview } from './song/SongPreview';
import { SongCardCover } from './song/SongCover';
import { SongCardMeta } from './song/SongMeta';

const cardStyles = {
    height: '100%',
    display: 'flex',
    flexDirection: 'column'
};

const cardContentStyles = {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column'
};

const playerStyles = {
    mt: 'auto'
};

export function SongCard({ song, uiText }) {
    return (
        <Card sx={cardStyles}>
            <SongCardCover song={song} uiText={uiText} />
            <SongCardContent song={song} uiText={uiText} />
        </Card>
    );
}

function SongCardContent({ song, uiText }) {
    return (
        <CardContent sx={cardContentStyles}>
            <SongCardMeta song={song} uiText={uiText} />
            <Box sx={playerStyles}>
                <SongPreview song={song} uiText={uiText} />
            </Box>
        </CardContent>
    );
}

