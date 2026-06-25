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
    const pageState = useHomePageState();

    return (
        <PageLayout>
            <StickyControls>
                <AppToolbar {...pageState.toolbarProps} />
                <ViewSwitcher {...pageState.viewProps} />
            </StickyControls>
            <SongsView {...pageState.songsViewProps} />
        </PageLayout>
    );
}

function useHomePageState() {
    const [view, setView] = useState(VIEW_TYPES.table);
    const [tablePage, setTablePage] = useState(1);
    const { filters, updateFilter } = useSongFilters();
    const uiText = getUiText(filters.region);

    return createPageState({ view, setView, tablePage, setTablePage, filters, updateFilter, uiText });
}

function createPageState(context) {
    return {
        toolbarProps: createToolbarProps(context),
        viewProps: createViewProps(context),
        songsViewProps: createSongsViewProps(context)
    };
}

function createToolbarProps(context) {
    return { ...context.filters, ...createToolbarHandlers(context), uiText: context.uiText };
}

function createViewProps({ view, setView, uiText }) {
    return { view, onViewChange: setView, uiText };
}

function createSongsViewProps({ view, filters, tablePage, setTablePage, uiText }) {
    return { view, filters, page: tablePage, onPageChange: setTablePage, uiText };
}

function createToolbarHandlers({ updateFilter, setTablePage }) {
    const updateFilters = createFiltersUpdater(updateFilter, setTablePage);

    return {
        onRegionChange: updateFilters('region'),
        onSeedChange: updateFilters('seed'),
        onLikesChange: updateFilters('likes'),
        onRandomSeed: () => updateFilters('seed')(createRandomSeed64())
    };
}

function createFiltersUpdater(updateFilter, setTablePage) {
    return (name) => (value) => {
        setTablePage(1);
        updateFilter(name, value);
    };
}

function PageLayout({ children }) {
    return <Container maxWidth="xl"><Box sx={{ py: 3 }}>{children}</Box></Container>;
}

function SongsView({ view, filters, page, onPageChange, uiText }) {
    if (view === VIEW_TYPES.gallery) {
        return <GalleryView key={createSongQueryKey(VIEW_TYPES.gallery, filters)} {...filters} uiText={uiText} />;
    }
    return (<SongsTable key={createPagedSongQueryKey(VIEW_TYPES.table, { ...filters, page })}{...filters} page={page} onPageChange={onPageChange} uiText={uiText}/>);
}


function StickyControls({ children }) {
    return <Box sx={stickyControlsStyles}>{children}</Box>;
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