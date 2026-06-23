'use client';

import { Box, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { VIEW_TYPES } from '@/lib/songs/constants';

export function ViewSwitcher({ view, onViewChange, uiText }) {
    return <Box sx={{ mb: 2 }}><ToggleButtonGroup exclusive value={view} onChange={(_, nextView) => nextView && onViewChange(nextView)}>{createViewOptions(uiText).map(renderOption)}</ToggleButtonGroup></Box>;
}

function createViewOptions(uiText) {
    return [
        { value: VIEW_TYPES.table, label: uiText.views.table },
        { value: VIEW_TYPES.gallery, label: uiText.views.gallery }
    ];
}

function renderOption(option) {
    return <ToggleButton key={option.value} value={option.value}>{option.label}</ToggleButton>;
}
