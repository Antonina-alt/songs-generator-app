'use client';

import { useEffect, useRef } from 'react';
import { Box, CircularProgress, Grid } from '@mui/material';
import { QueryState } from './common/QueryState';
import { SongCard } from './SongCard';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { useInfiniteSongsQuery } from '@/hooks/useInfiniteSongsQuery';

const galleryStyles = {
    maxHeight: '75vh',
    overflowY: 'auto',
    pr: 1
};

export function GalleryView({ uiText, ...queryParams }) {
    const query = useInfiniteSongsQuery(queryParams);
    const galleryRef = useGalleryReset(queryParams);
    const loaderRef = useGalleryInfiniteScroll(query);

    return (
        <QueryState query={query} errorMessage={uiText.messages.loadSongsError}>
            <GalleryPanel galleryRef={galleryRef} songs={getQuerySongs(query)} loaderRef={loaderRef} isLoading={query.isFetchingNextPage} uiText={uiText} />
        </QueryState>
    );
}

function GalleryPanel({ galleryRef, songs, loaderRef, isLoading, uiText }) {
    return <Box ref={galleryRef} sx={galleryStyles}><GalleryGrid songs={songs} uiText={uiText} /><Loader loaderRef={loaderRef} isLoading={isLoading} /></Box>;
}

function GalleryGrid({ songs, uiText }) {
    return <Grid container spacing={2}>{songs.map((song) => renderSongCard(song, uiText))}</Grid>;
}

function renderSongCard(song, uiText) {
    return <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={song.index}><SongCard song={song} uiText={uiText} /></Grid>;
}

function Loader({ loaderRef, isLoading }) {
    return <Box ref={loaderRef} sx={{ py: 3, textAlign: 'center' }}>{isLoading ? <CircularProgress size={24} /> : null}</Box>;
}

function useGalleryReset(queryParams) {
    const galleryRef = useRef(null);
    useEffect(() => scrollToTop(galleryRef.current), [queryParams.region, queryParams.seed, queryParams.likes]);
    return galleryRef;
}

function scrollToTop(element) {
    element?.scrollTo({ top: 0, behavior: 'smooth' });
}

function getQuerySongs(query) {
    return query.data?.pages.flatMap((page) => page.items) ?? [];
}

function useGalleryInfiniteScroll(query) {
    return useInfiniteScroll({ canLoad: canLoadNextPage(query), onLoad: query.fetchNextPage });
}

function canLoadNextPage(query) {
    return query.hasNextPage && !query.isFetchingNextPage;
}
