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
    return <Box sx={toolbarStyles}><ToolbarControls {...props} /></Box>;
}

function ToolbarControls(props) {
    return (
        <>
            <RegionSelect value={props.region} onChange={props.onRegionChange} uiText={props.uiText} />
            <SeedInput value={props.seed} onChange={props.onSeedChange} uiText={props.uiText} />
            <RandomSeedButton onClick={props.onRandomSeed} uiText={props.uiText} />
            <LikesSlider value={props.likes} onChange={props.onLikesChange} uiText={props.uiText} />
        </>
    );
}

function RandomSeedButton({ onClick, uiText }) {
    return <Button variant="contained" onClick={onClick}>{uiText.controls.randomSeed}</Button>;
}
