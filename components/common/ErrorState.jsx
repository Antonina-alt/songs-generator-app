'use client';

import { Typography } from '@mui/material';

export function ErrorState({ message = 'Failed to load data.' }) {
    return <Typography color="error">{message}</Typography>;
}
