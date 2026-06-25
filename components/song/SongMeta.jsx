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
    const title = `${song.index}. ${song.title}`;
    return [
        createCardTitleItem(title),
        createCardMutedItem('artist', song.artist),
        createCardMutedItem('album', song.album),
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

function createBodyItem(key, text, sx) {
    return createMetaItem(key, text, { variant: 'body2', sx });
}

function createMetaItem(key, text, props) {
    return { key, text, props };
}

function createCardTitleItem(text) {
    return createMetaItem('title', text, {
        variant: 'h6',
        sx: [cardTitleStyles, getCardTitleFitStyles(text)]
    });
}

function createCardMutedItem(key, text) {
    return createMetaItem(key, text, {
        variant: 'body2',
        color: 'text.secondary',
        sx: cardSecondaryTextStyles
    });
}

function getCardTitleFitStyles(text) {
    if (text.length > 70) return { fontSize: '0.9rem', lineHeight: 1.2 };
    if (text.length > 48) return { fontSize: '1rem', lineHeight: 1.25 };
    return {};
}
