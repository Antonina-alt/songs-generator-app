'use client';

import { TextField } from '@mui/material';
import { isValidSeed64 } from '@/lib/randomGenerator';

export function SeedInput({ value, onChange, uiText }) {
    const isInvalid = isSeedInputInvalid(value);
    return <TextField {...createSeedInputProps(value, onChange, uiText, isInvalid)} />;
}

function createSeedInputProps(value, onChange, uiText, isInvalid) {
    return {
        size: 'small',
        label: uiText.controls.seed,
        value,
        error: isInvalid,
        onChange: createChangeHandler(onChange),
        helperText: getHelperText(isInvalid, uiText),
        slotProps: createSlotProps()
    };
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

const helperTextStyles = {
    position: 'absolute',
    top: '100%',
    m: 0,
    whiteSpace: 'wrap'
};
