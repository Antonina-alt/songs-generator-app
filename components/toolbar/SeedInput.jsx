'use client';

import { TextField } from '@mui/material';

export function SeedInput({ value, onChange }) {
    return <TextField size="small" label="Seed" value={value} onChange={(event) => onChange(event.target.value)} />;
}
