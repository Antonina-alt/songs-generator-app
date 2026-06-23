'use client';

import { TextField } from '@mui/material';

export function SeedInput({ value, onChange, uiText }) {
    return <TextField size="small" label={uiText.controls.seed} value={value} onChange={(event) => onChange(event.target.value)} />;
}
