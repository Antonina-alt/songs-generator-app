'use client';

import { Card, CardContent } from '@mui/material';
import { AudioPlayer } from './AudioPlayer';
import { SongCardCover } from './song/SongCover';
import { SongCardMeta } from './song/SongMeta';

export function SongCard({ song }) {
    return <Card><SongCardCover song={song} /><SongCardContent song={song} /></Card>;
}

function SongCardContent({ song }) {
    return <CardContent><SongCardMeta song={song} /><AudioPlayer music={song.music} /></CardContent>;
}
