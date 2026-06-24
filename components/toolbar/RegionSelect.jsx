'use client';

import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { getRegionOptions } from '@/lib/uiText';

export function RegionSelect({ value, onChange, uiText }) {
    return <FormControl size="small" sx={{ minWidth: 180 }}><RegionLabel uiText={uiText} /><RegionSelectInput value={value} onChange={onChange} uiText={uiText} /></FormControl>;
}

function RegionLabel({ uiText }) {
    return <InputLabel>{uiText.controls.language}</InputLabel>;
}

function RegionSelectInput({ value, onChange, uiText }) {
    return <Select label={uiText.controls.language} value={value} onChange={createRegionChangeHandler(onChange)}>{getRegionOptions(uiText).map(renderOption)}</Select>;
}

function createRegionChangeHandler(onChange) {
    return (event) => onChange(event.target.value);
}

function renderOption(option) {
    return <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>;
}
