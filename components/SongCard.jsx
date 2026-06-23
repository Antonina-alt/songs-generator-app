'use client';

import { Card, CardContent } from '@mui/material';
import { AudioPlayer } from './AudioPlayer';
import { SongCardCover } from './song/SongCover';
import { SongCardMeta } from './song/SongMeta';

export function SongCard({ song, uiText }) {
    return <Card><SongCardCover song={song} uiText={uiText} /><SongCardContent song={song} uiText={uiText} /></Card>;
}

function SongCardContent({ song, uiText }) {
    return <CardContent><SongCardMeta song={song} uiText={uiText} /><AudioPlayer music={song.music} lyrics={song.lyrics} uiText={uiText} /></CardContent>;
}
