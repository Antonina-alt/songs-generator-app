'use client';

import { Box, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { VIEW_TYPES } from '@/lib/songs/constants';

const viewOptions = [
    { value: VIEW_TYPES.table, label: 'Table View' },
    { value: VIEW_TYPES.gallery, label: 'Gallery View' }
];

export function ViewSwitcher({ view, onViewChange }) {
    return <Box sx={{ mb: 2 }}><ToggleButtonGroup exclusive value={view} onChange={(_, nextView) => nextView && onViewChange(nextView)}>{viewOptions.map(renderOption)}</ToggleButtonGroup></Box>;
}

function renderOption(option) {
    return <ToggleButton key={option.value} value={option.value}>{option.label}</ToggleButton>;
}
