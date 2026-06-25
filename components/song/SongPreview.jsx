'use client';

import { AudioPlayer } from '@/components/AudioPlayer';
import { createSongPreviewId } from '@/lib/songs/identity';

export function SongPreview({ song, uiText }) {
    return <AudioPlayer previewId={createSongPreviewId(song)} music={song.music} lyrics={song.lyrics} uiText={uiText} />;
}
