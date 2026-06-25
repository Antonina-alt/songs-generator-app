'use client';

import { useState } from 'react';
import { Box, Container } from '@mui/material';
import { AppToolbar } from '@/components/AppToolbar';
import { GalleryView } from '@/components/GalleryView';
import { SongsTable } from '@/components/SongsTable';
import { ViewSwitcher } from '@/components/ViewSwitcher';
import { useSongFilters } from '@/hooks/useSongFilters';
import { createRandomSeed64 } from '@/lib/randomGenerator';
import { VIEW_TYPES } from '@/lib/songs/constants';
import { createPagedSongQueryKey, createSongQueryKey } from '@/lib/songs/identity';
import { getUiText } from '@/lib/uiText';

export default function HomePage() {
    const [view, setView] = useState(VIEW_TYPES.table);
    const [tablePage, setTablePage] = useState(1);
    const { filters, updateFilter } = useSongFilters();
    const uiText = getUiText(filters.region);

    const updateToolbarFilter = (name) => (value) => {
        setTablePage(1);
        updateFilter(name, value);
    };

    return (
        <PageLayout>
            <StickyControls>
                <AppToolbar
                    {...filters}
                    uiText={uiText}
                    onRegionChange={updateToolbarFilter('region')}
                    onSeedChange={updateToolbarFilter('seed')}
                    onLikesChange={updateToolbarFilter('likes')}
                    onRandomSeed={() => updateToolbarFilter('seed')(createRandomSeed64())}
                />
                <ViewSwitcher view={view} onViewChange={setView} uiText={uiText} />
            </StickyControls>
            <SongsView
                view={view}
                filters={filters}
                page={tablePage}
                onPageChange={setTablePage}
                uiText={uiText}
            />
        </PageLayout>
    );
}

function PageLayout({ children }) {
    return (
        <Container maxWidth="xl">
            <Box sx={{ py: 3 }}>{children}</Box>
        </Container>
    );
}

function StickyControls({ children }) {
    return <Box sx={stickyControlsStyles}>{children}</Box>;
}

function SongsView({ view, filters, page, onPageChange, uiText }) {
    if (view === VIEW_TYPES.gallery) {
        return <GalleryView key={createSongQueryKey(VIEW_TYPES.gallery, filters)} {...filters} uiText={uiText} />;
    }

    return (
        <SongsTable
            key={createPagedSongQueryKey(VIEW_TYPES.table, { ...filters, page })}
            {...filters}
            page={page}
            onPageChange={onPageChange}
            uiText={uiText}
        />
    );
}

const stickyControlsStyles = {
    position: 'sticky',
    top: 0,
    zIndex: (theme) => theme.zIndex.appBar,
    bgcolor: 'background.default',
    py: 2,
    mb: 3,
    borderBottom: 1,
    borderColor: 'divider'
};
