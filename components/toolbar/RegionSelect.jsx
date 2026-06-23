'use client';

import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { getRegionOptions } from '@/lib/uiText';

export function RegionSelect({ value, onChange, uiText }) {
    return <FormControl size="small" sx={{ minWidth: 180 }}><InputLabel>{uiText.controls.language}</InputLabel><RegionSelectInput value={value} onChange={onChange} uiText={uiText} /></FormControl>;
}

function RegionSelectInput({ value, onChange, uiText }) {
    return <Select label={uiText.controls.language} value={value} onChange={(event) => onChange(event.target.value)}>{getRegionOptions(uiText).map(renderOption)}</Select>;
}

function renderOption(option) {
    return <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>;
}
