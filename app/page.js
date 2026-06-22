'use client';

import { useState } from 'react';
import { Box, Container } from '@mui/material';
import { AppToolbar } from '@/components/AppToolbar';
import { GalleryView } from '@/components/GalleryView';
import { SongsTable } from '@/components/SongsTable';
import { ViewSwitcher } from '@/components/ViewSwitcher';
import { useSongFilters } from '@/hooks/useSongFilters';
import { DEFAULT_SEED, VIEW_TYPES } from '@/lib/songs/constants';

export default function HomePage() {
    const [view, setView] = useState(VIEW_TYPES.table);
    const [tablePage, setTablePage] = useState(1);
    const { filters, galleryRef, updateFilter } = useSongFilters();
    const updateFilters = createFiltersUpdater(updateFilter, setTablePage);
    return <PageLayout><AppToolbar {...filters} onRegionChange={updateFilters('region')} onSeedChange={updateFilters('seed')} onLikesChange={updateFilters('likes')} onRandomSeed={() => updateFilters('seed')(createRandomSeed())} /><ViewSwitcher view={view} onViewChange={setView} /><SongsView view={view} filters={filters} tablePage={tablePage} galleryRef={galleryRef} onPageChange={setTablePage} /></PageLayout>;
}

function PageLayout({ children }) {
    return <Container maxWidth="xl"><Box sx={{ py: 3 }}>{children}</Box></Container>;
}

function SongsView({ view, filters, tablePage, galleryRef, onPageChange }) {
    if (view === VIEW_TYPES.gallery) return <GalleryView ref={galleryRef} {...filters} />;
    return <SongsTable {...filters} page={tablePage} onPageChange={onPageChange} />;
}

function createFiltersUpdater(updateFilter, setTablePage) {
    return (name) => (value) => {
        setTablePage(1);
        updateFilter(name, value);
    };
}

function createRandomSeed() {
    return String(Math.floor(Math.random() * Number.MAX_SAFE_INTEGER) || DEFAULT_SEED);
}
