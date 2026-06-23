'use client';

import {TextField} from '@mui/material';
import {isValidSeed64} from "@/lib/randomGenerator";

export function SeedInput({value, onChange, uiText}) {
    const isInvalid = value.trim() !== '' && !isValidSeed64(value);
    return <TextField size="small" label={uiText.controls.seed} value={value}
                      onChange={(event) => onChange(event.target.value)} error={isInvalid}
                      helperText={isInvalid ? uiText.error.seedInputError : ' '}
                      slotProps={{
                          formHelperText: {
                              sx: {position: 'absolute', top: '100%', m: 0, whiteSpace: 'wrap'}
                          }
                      }}/>;
}