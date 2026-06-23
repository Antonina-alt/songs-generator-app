'use client';

import { forwardRef } from 'react';
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

export const GalleryView = forwardRef(function GalleryView({ uiText, ...queryParams }, ref) {
    const query = useInfiniteSongsQuery(queryParams);
    const songs = getQuerySongs(query);
    const loaderRef = useGalleryInfiniteScroll(query);

    return (
        <QueryState query={query} errorMessage={uiText.messages.loadSongsError}>
            <Box ref={ref} sx={galleryStyles}>
                <GalleryGrid songs={songs} uiText={uiText} />
                <Loader ref={loaderRef} isLoading={query.isFetchingNextPage} />
            </Box>
        </QueryState>
    );
});

function GalleryGrid({ songs, uiText }) {
    return <Grid container spacing={2}>{songs.map((song) => renderSongCard(song, uiText))}</Grid>;
}

function renderSongCard(song, uiText) {
    return <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={song.index}><SongCard song={song} uiText={uiText} /></Grid>;
}

const Loader = forwardRef(function Loader({ isLoading }, ref) {
    return <Box ref={ref} sx={{ py: 3, textAlign: 'center' }}>{isLoading ? <CircularProgress size={24} /> : null}</Box>;
});

function getQuerySongs(query) {
    return query.data?.pages.flatMap((page) => page.items) ?? [];
}

function useGalleryInfiniteScroll(query) {
    return useInfiniteScroll({
        canLoad: query.hasNextPage && !query.isFetchingNextPage,
        onLoad: query.fetchNextPage
    });
}
