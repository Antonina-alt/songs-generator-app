'use client';

import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';

const regionOptions = [
    { value: 'en-US', label: 'English (USA)' },
    { value: 'ru-RU', label: 'Russian (Russia)' }
];

export function RegionSelect({ value, onChange }) {
    return <FormControl size="small" sx={{ minWidth: 180 }}><InputLabel>Language</InputLabel><RegionSelectInput value={value} onChange={onChange} /></FormControl>;
}

function RegionSelectInput({ value, onChange }) {
    return <Select label="Language" value={value} onChange={(event) => onChange(event.target.value)}>{regionOptions.map(renderOption)}</Select>;
}

function renderOption(option) {
    return <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>;
}
