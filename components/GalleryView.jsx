'use client';

import { forwardRef, useRef } from 'react';
import { Box, CircularProgress, Grid } from '@mui/material';
import { ErrorState } from './common/ErrorState';
import { LoadingState } from './common/LoadingState';
import { SongCard } from './SongCard';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { useInfiniteSongsQuery } from '@/hooks/useInfiniteSongsQuery';

const galleryStyles = {
    maxHeight: '75vh',
    overflowY: 'auto',
    pr: 1
};

export const GalleryView = forwardRef(function GalleryView(props, ref) {
    const loaderRef = useRef(null);
    const query = useInfiniteSongsQuery(props);
    const songs = getQuerySongs(query);

    useGalleryInfiniteScroll(loaderRef, query);

    if (query.isLoading) return <LoadingState />;
    if (query.isError) return <ErrorState message="Failed to load songs." />;

    return (
        <Box ref={ref} sx={galleryStyles}>
            <GalleryGrid songs={songs} />
            <Loader ref={loaderRef} isLoading={query.isFetchingNextPage} />
        </Box>
    );
});

function GalleryGrid({ songs }) {
    return <Grid container spacing={2}>{songs.map(renderSongCard)}</Grid>;
}

function renderSongCard(song) {
    return <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={song.index}><SongCard song={song} /></Grid>;
}

const Loader = forwardRef(function Loader({ isLoading }, ref) {
    return <Box ref={ref} sx={{ py: 3, textAlign: 'center' }}>{isLoading ? <CircularProgress size={24} /> : null}</Box>;
});

function getQuerySongs(query) {
    return query.data?.pages.flatMap((page) => page.items) ?? [];
}

function useGalleryInfiniteScroll(loaderRef, query) {
    useInfiniteScroll({
        loaderRef,
        canLoad: query.hasNextPage && !query.isFetchingNextPage,
        onLoad: query.fetchNextPage
    });
}
