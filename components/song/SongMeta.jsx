'use client';

import { Typography } from '@mui/material';

export function SongCardMeta({ song, uiText }) {
    return <SongMetaLayout items={createCardMetaItems(song, uiText)} />;
}

export function SongDetailsMeta({ song }) {
    return <SongMetaLayout items={createDetailsMetaItems(song)} />;
}

function SongMetaLayout({ items }) {
    return <>{items.map(renderMetaItem)}</>;
}

function renderMetaItem(item) {
    return <Typography key={item.key} {...item.props}>{item.text}</Typography>;
}

function createCardMetaItems(song, uiText) {
    return [
        createTitleItem(`${song.index}. ${song.title}`, true),
        createMutedItem('artist', song.artist, true),
        createMutedItem('album', song.album, true),
        createBodyItem('stats', `${song.genre} · ${song.likes} ${uiText.song.likes}`, { mb: 1 })
    ];
}

function createDetailsMetaItems(song) {
    return [
        createTitleItem(song.title),
        createSubtitleItem('artist', song.artist),
        createBodyItem('albumGenre', `${song.album} · ${song.genre}`, { mb: 2 })
    ];
}

function createTitleItem(text, noWrap = false) {
    return createMetaItem('title', text, { variant: 'h6', noWrap });
}

function createSubtitleItem(key, text) {
    return createMetaItem(key, text, { variant: 'subtitle1' });
}

function createMutedItem(key, text, noWrap) {
    return createMetaItem(key, text, { variant: 'body2', color: 'text.secondary', noWrap });
}

function createBodyItem(key, text, sx) {
    return createMetaItem(key, text, { variant: 'body2', sx });
}

function createMetaItem(key, text, props) {
    return { key, text, props };
}
