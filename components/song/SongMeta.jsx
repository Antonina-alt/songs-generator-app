'use client';

import { Typography } from '@mui/material';

const cardTitleStyles = {
    height: '4.7rem',
    mb: 0.5,
    whiteSpace: 'normal',
    overflowWrap: 'anywhere',
    hyphens: 'auto'
};

const cardSecondaryTextStyles = {
    minHeight: '1.45rem',
    whiteSpace: 'normal',
    overflowWrap: 'anywhere'
};

export function SongCardMeta({ song, uiText }) {
    return (
        <>
            <Typography variant="h6" sx={[cardTitleStyles, getCardTitleFitStyles(song)]}>
                {song.index}. {song.title}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={cardSecondaryTextStyles}>
                {song.artist}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={cardSecondaryTextStyles}>
                {song.album}
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
                {song.genre} · {uiText.song.likes(song.likes)}
            </Typography>
        </>
    );
}

export function SongDetailsMeta({ song }) {
    return (
        <>
            <Typography variant="h6">{song.title}</Typography>
            <Typography variant="subtitle1">{song.artist}</Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
                {song.album} · {song.genre}
            </Typography>
        </>
    );
}

function getCardTitleFitStyles({ title }) {
    if (title.length > 70) return { fontSize: '0.9rem', lineHeight: 1.2 };
    if (title.length > 48) return { fontSize: '1rem', lineHeight: 1.25 };
    return {};
}
