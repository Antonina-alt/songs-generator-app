'use client';

import { Typography } from '@mui/material';
import { getUiText } from '@/lib/uiText';

export function ErrorState({ message = getUiText().messages.loadDataError }) {
    return <Typography color="error">{message}</Typography>;
}
