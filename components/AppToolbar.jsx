'use client';

import { Box, Button } from '@mui/material';
import { LikesSlider } from './toolbar/LikesSlider';
import { RegionSelect } from './toolbar/RegionSelect';
import { SeedInput } from './toolbar/SeedInput';

const toolbarStyles = {
    display: 'flex',
    gap: 2,
    alignItems: 'center',
    mb: 3,
    flexWrap: 'wrap'
};

export function AppToolbar(props) {
    return <Box sx={toolbarStyles}>{renderToolbarControls(props)}</Box>;
}

function renderToolbarControls(props) {
    return <><RegionSelect value={props.region} onChange={props.onRegionChange} /><SeedInput value={props.seed} onChange={props.onSeedChange} /><RandomSeedButton onClick={props.onRandomSeed} /><LikesSlider value={props.likes} onChange={props.onLikesChange} /></>;
}

function RandomSeedButton({ onClick }) {
    return <Button variant="contained" onClick={onClick}>Random seed</Button>;
}
