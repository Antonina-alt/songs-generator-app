'use client';

import { Box, Button } from '@mui/material';
import { LikesSlider } from './toolbar/LikesSlider';
import { RegionSelect } from './toolbar/RegionSelect';
import { SeedInput } from './toolbar/SeedInput';

const toolbarStyles = {
    display: 'flex',
    gap: 2,
    alignItems: 'flex-start',
    mb: 2,
    flexWrap: 'nowrap',
    overflow: 'visible'
};

const toolbarControlStyles = {
    flexShrink: 0
};

export function AppToolbar(props) {
    return <Box sx={toolbarStyles}>{createToolbarControls(props)}</Box>;
}

function createToolbarControls(props) {
    return getToolbarControls(props).map(renderToolbarControl);
}

function getToolbarControls(props) {
    return [
        { key: 'region', node: <RegionSelect value={props.region} onChange={props.onRegionChange} uiText={props.uiText} /> },
        { key: 'seed', node: <SeedInput value={props.seed} onChange={props.onSeedChange} uiText={props.uiText} /> },
        { key: 'randomSeed', node: <RandomSeedButton onClick={props.onRandomSeed} uiText={props.uiText} /> },
        { key: 'likes', node: <LikesSlider value={props.likes} onChange={props.onLikesChange} uiText={props.uiText} /> }
    ];
}

function renderToolbarControl({ key, node }) {
    return <Box key={key} sx={toolbarControlStyles}>{node}</Box>;
}

function RandomSeedButton({ onClick, uiText }) {
    return <Button variant="contained" onClick={onClick}>{uiText.controls.randomSeed}</Button>;
}
