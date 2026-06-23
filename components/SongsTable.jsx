'use client';

import { Fragment, useState } from 'react';
import { Box, Collapse, IconButton, Pagination, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { QueryState } from './common/QueryState';
import { SongDetails } from './SongDetails';
import { TABLE_PAGE_COUNT } from '@/lib/songs/constants';
import { useSongsQuery } from '@/hooks/useSongsQuery';

export function SongsTable(props) {
    const [expandedId, setExpandedId] = useState(null);
    const query = useSongsQuery(createQueryParams(props));

    return (
        <QueryState query={query} errorMessage={props.uiText.messages.loadSongsError}>
            <SongsTableContent {...props} songs={query.data?.items ?? []} expandedId={expandedId} onExpand={setExpandedId} />
        </QueryState>
    );
}

function SongsTableContent({ songs, page, expandedId, onExpand, onPageChange, uiText }) {
    return <Box><SongsTablePanel songs={songs} expandedId={expandedId} onExpand={onExpand} uiText={uiText} /><TablePagination page={page} onPageChange={onPageChange} /></Box>;
}

function SongsTablePanel({ songs, expandedId, onExpand, uiText }) {
    return <TableContainer component={Paper}><Table><TableHeader columns={uiText.table.columns} /><TableBody>{songs.map((song) => renderSongRow(song, expandedId, onExpand, uiText))}</TableBody></Table></TableContainer>;
}

function TableHeader({ columns }) {
    return <TableHead><TableRow>{columns.map(renderHeaderCell)}</TableRow></TableHead>;
}

function renderHeaderCell(column) {
    return <TableCell key={column}>{column}</TableCell>;
}

function renderSongRow(song, expandedId, onExpand, uiText) {
    return <SongRow key={song.index} song={song} isExpanded={expandedId === song.index} onExpand={onExpand} uiText={uiText} />;
}

function SongRow({ song, isExpanded, onExpand, uiText }) {
    return <Fragment><SongSummaryRow song={song} isExpanded={isExpanded} onExpand={onExpand} /><SongDetailsRow song={song} isExpanded={isExpanded} uiText={uiText} /></Fragment>;
}

function SongSummaryRow({ song, isExpanded, onExpand }) {
    return <TableRow hover sx={{ cursor: 'pointer' }} onClick={() => toggleSongRow(song, isExpanded, onExpand)}><ExpandCell isExpanded={isExpanded} /><SongCells song={song} /></TableRow>;
}

function ExpandCell({ isExpanded }) {
    return <TableCell><ExpandIcon isExpanded={isExpanded} /></TableCell>;
}

function SongCells({ song }) {
    return <>{getSongRowValues(song).map((value, index) => <TableCell key={`${song.index}-${index}`}>{value}</TableCell>)}</>;
}

function ExpandIcon({ isExpanded }) {
    return <IconButton size="small">{isExpanded ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}</IconButton>;
}

function SongDetailsRow({ song, isExpanded, uiText }) {
    return <TableRow><TableCell colSpan={uiText.table.columns.length} sx={{ py: 0 }}><Collapse in={isExpanded} timeout="auto" unmountOnExit><SongDetails song={song} uiText={uiText} /></Collapse></TableCell></TableRow>;
}

function TablePagination({ page, onPageChange }) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}><Pagination page={page} count={TABLE_PAGE_COUNT} onChange={(_, nextPage) => onPageChange(nextPage)} /></Box>;
}

function createQueryParams({ region, seed, likes, page }) {
    return { region, seed, likes, page };
}

function toggleSongRow(song, isExpanded, onExpand) {
    onExpand(isExpanded ? null : song.index);
}

function getSongRowValues(song) {
    return [song.index, song.title, song.artist, song.album, song.genre, song.likes];
}
