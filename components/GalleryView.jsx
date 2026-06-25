'use client';

import { useCallback } from 'react';
import { InView } from 'react-intersection-observer';
import { Box, CircularProgress, Grid } from '@mui/material';
import { QueryState } from './common/QueryState';
import { SongCard } from './SongCard';
import { useInfiniteSongsQuery } from '@/hooks/useInfiniteSongsQuery';
import { createSongQueryKey } from '@/lib/songs/identity';
import { VIEW_TYPES } from '@/lib/songs/constants';

const galleryStyles = {
    pb: 4
};

const loaderStyles = {
    py: 3,
    textAlign: 'center'
};

const galleryItemStyles = {
    display: 'flex'
};

export function GalleryView({ uiText, ...queryParams }) {
    const query = useInfiniteSongsQuery(queryParams);

    return (
        <QueryState query={query} errorMessage={uiText.messages.loadSongsError}>
            <GalleryPanel query={query} queryParams={queryParams} uiText={uiText} />
        </QueryState>
    );
}

function GalleryPanel({ query, queryParams, uiText }) {
    return <Box key={createSongQueryKey(VIEW_TYPES.gallery, queryParams)} sx={galleryStyles}><GalleryGrid songs={getQuerySongs(query)} uiText={uiText} /><InfiniteLoader query={query} /></Box>;
}

function GalleryGrid({ songs, uiText }) {
    return <Grid container spacing={2}>{songs.map((song) => renderSongCard(song, uiText))}</Grid>;
}

function InfiniteLoader({ query }) {
    const onChange = useInfiniteLoader(query);
    return <InView rootMargin="200px" onChange={onChange}><Box sx={loaderStyles}>{renderLoader(query)}</Box></InView>;
}

function useInfiniteLoader(query) {
    return useCallback((inView) => loadNextPage(inView, query), [query]);
}

function loadNextPage(inView, query) {
    if (inView && canLoadNextPage(query)) query.fetchNextPage();
}

function renderSongCard(song, uiText) {
    return (<Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={song.index} sx={galleryItemStyles}><SongCard song={song} uiText={uiText} /></Grid>);
}

function renderLoader(query) {
    return query.isFetchingNextPage ? <CircularProgress size={24} /> : null;
}

function canLoadNextPage(query) {
    return query.hasNextPage && !query.isFetchingNextPage;
}


function getQuerySongs(query) {
    return query.data?.pages.flatMap((page) => page.items) ?? [];
}
