'use client';

import { forwardRef, useRef } from 'react';
import { Box, CircularProgress, Grid } from '@mui/material';
import { ErrorState } from './common/ErrorState';
import { LoadingState } from './common/LoadingState';
import { SongCard } from './SongCard';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { useInfiniteSongsQuery } from '@/hooks/useInfiniteSongsQuery';

export const GalleryView = forwardRef(function GalleryView(props, ref) {
    const loaderRef = useRef(null);
    const query = useInfiniteSongsQuery(props);
    const songs = query.data?.pages.flatMap((page) => page.items) ?? [];
    useInfiniteScroll({ loaderRef, canLoad: query.hasNextPage && !query.isFetchingNextPage, onLoad: query.fetchNextPage });
    if (query.isLoading) return <LoadingState />;
    if (query.isError) return <ErrorState message="Failed to load songs." />;
    return <GalleryContent ref={ref} songs={songs} loaderRef={loaderRef} isLoadingMore={query.isFetchingNextPage} />;
});

const GalleryContent = forwardRef(function GalleryContent({ songs, loaderRef, isLoadingMore }, ref) {
    return <Box ref={ref} sx={galleryStyles}><Grid container spacing={2}>{songs.map(renderSongCard)}</Grid><Loader ref={loaderRef} isLoading={isLoadingMore} /></Box>;
});

function renderSongCard(song) {
    return <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={song.index}><SongCard song={song} /></Grid>;
}

const Loader = forwardRef(function Loader({ isLoading }, ref) {
    return <Box ref={ref} sx={{ py: 3, textAlign: 'center' }}>{isLoading ? <CircularProgress size={24} /> : null}</Box>;
});

const galleryStyles = {
    maxHeight: '75vh',
    overflowY: 'auto',
    pr: 1
};
