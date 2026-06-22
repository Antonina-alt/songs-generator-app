'use client';

import { Box, Slider, Typography } from '@mui/material';

export function LikesSlider({ value, onChange }) {
    return <Box sx={{ width: 260 }}><LikesLabel value={value} /><LikesControl value={value} onChange={onChange} /></Box>;
}

function LikesLabel({ value }) {
    return <Typography variant="body2">Likes per song: {Number(value).toFixed(1)}</Typography>;
}

function LikesControl({ value, onChange }) {
    return <Slider min={0} max={10} step={0.1} value={value} onChange={(_, nextValue) => onChange(nextValue)} />;
}
