'use client';

import { TextField } from '@mui/material';
import { isValidSeed64 } from '@/lib/seed';

const seedInputStyles = {
    width: 300
};

const helperTextStyles = {
    m: '3px 0 0',
    minHeight: '2.4em',
    lineHeight: 1.2,
    whiteSpace: 'normal'
};

export function SeedInput({ value, onChange, uiText }) {
    const isInvalid = isSeedInputInvalid(value);
    return <TextField {...createSeedInputProps(value, onChange, uiText, isInvalid)} />;
}

function createSeedInputProps(value, onChange, uiText, isInvalid) {
    return {...createSeedInputBaseProps(value, uiText, isInvalid), onChange: createChangeHandler(onChange), sx: seedInputStyles, slotProps: createSlotProps()};
}

function createSeedInputBaseProps(value, uiText, isInvalid) {
    return { size: 'small', label: uiText.controls.seed, value, error: isInvalid, helperText: getHelperText(isInvalid, uiText) };
}

function isSeedInputInvalid(value) {
    return value.trim() !== '' && !isValidSeed64(value);
}

function createChangeHandler(onChange) {
    return (event) => onChange(event.target.value);
}

function getHelperText(isInvalid, uiText) {
    return isInvalid ? uiText.error.seedInputError : ' ';
}

function createSlotProps() {
    return { formHelperText: { sx: helperTextStyles } };
}
