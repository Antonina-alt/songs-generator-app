'use client';

import { Typography } from '@mui/material';

export function SongCardMeta({ song }) {
    return (
        <>
            <SongTitle song={song} />
            <MutedText>{song.artist}</MutedText>
            <MutedText>{song.album}</MutedText>
            <SongStats song={song} />
        </>
    );
}

export function SongDetailsMeta({ song }) {
    return (
        <>
            <Typography variant="h6">{song.title}</Typography>
            <Typography variant="subtitle1">{song.artist}</Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>{song.album} · {song.genre}</Typography>
        </>
    );
}

function SongTitle({ song }) {
    return <Typography variant="h6" noWrap>{song.index}. {song.title}</Typography>;
}

function SongStats({ song }) {
    return <Typography variant="body2" sx={{ mb: 1 }}>{song.genre} · {song.likes} likes</Typography>;
}

function MutedText({ children }) {
    return <Typography variant="body2" color="text.secondary" noWrap>{children}</Typography>;
}
