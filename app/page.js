'use client';
import { createRandomSeed64 } from '@/lib/randomGenerator';

import { useState } from 'react';
import { Box, Container } from '@mui/material';
import { AppToolbar } from '@/components/AppToolbar';
import { GalleryView } from '@/components/GalleryView';
import { SongsTable } from '@/components/SongsTable';
import { ViewSwitcher } from '@/components/ViewSwitcher';
import { useSongFilters } from '@/hooks/useSongFilters';
import { VIEW_TYPES } from '@/lib/songs/constants';
import { getUiText } from '@/lib/uiText';

export default function HomePage() {
    const [view, setView] = useState(VIEW_TYPES.table);
    const tablePageState = useState(1);
    const { filters, galleryRef, updateFilter } = useSongFilters();
    const uiText = getUiText(filters.region);
    const handlers = createPageHandlers(updateFilter, tablePageState[1]);

    return (
        <PageLayout>
            <AppToolbar {...filters} {...handlers.toolbar} uiText={uiText} />
            <ViewSwitcher view={view} onViewChange={setView} uiText={uiText} />
            <SongsView {...handlers.table} view={view} filters={filters} galleryRef={galleryRef} page={tablePageState[0]} uiText={uiText} />
        </PageLayout>
    );
}

function PageLayout({ children }) {
    return <Container maxWidth="xl"><Box sx={{ py: 3 }}>{children}</Box></Container>;
}

function SongsView({ view, filters, page, galleryRef, onPageChange, uiText }) {
    if (view === VIEW_TYPES.gallery) return <GalleryView ref={galleryRef} {...filters} uiText={uiText} />;
    return <SongsTable {...filters} page={page} onPageChange={onPageChange} uiText={uiText} />;
}

function createPageHandlers(updateFilter, setTablePage) {
    const updateFilters = createFiltersUpdater(updateFilter, setTablePage);
    return { toolbar: createToolbarHandlers(updateFilters), table: { onPageChange: setTablePage } };
}

function createToolbarHandlers(updateFilters) {
    return {
        onRegionChange: updateFilters('region'),
        onSeedChange: updateFilters('seed'),
        onLikesChange: updateFilters('likes'),
        onRandomSeed: () => updateFilters('seed')(createRandomSeed())
    };
}

function createFiltersUpdater(updateFilter, setTablePage) {
    return (name) => (value) => {
        setTablePage(1);
        updateFilter(name, value);
    };
}

function createRandomSeed() {
    return createRandomSeed64();
}
