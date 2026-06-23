'use client';

import { Fragment, useState } from 'react';
import { Box, Collapse, IconButton, Pagination, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { ErrorState } from './common/ErrorState';
import { LoadingState } from './common/LoadingState';
import { SongDetails } from './SongDetails';
import { TABLE_COLUMNS, TABLE_PAGE_COUNT } from '@/lib/songs/constants';
import { useSongsQuery } from '@/hooks/useSongsQuery';

export function SongsTable(props) {
    const [expandedId, setExpandedId] = useState(null);
    const query = useSongsQuery(createQueryParams(props));

    if (query.isLoading) return <LoadingState />;
    if (query.isError) return <ErrorState message="Failed to load songs." />;
    return <SongsTableContent {...props} songs={query.data.items} expandedId={expandedId} onExpand={setExpandedId} />;
}

function SongsTableContent({ songs, page, expandedId, onExpand, onPageChange }) {
    return <Box><SongsTablePanel songs={songs} expandedId={expandedId} onExpand={onExpand} /><TablePagination page={page} onPageChange={onPageChange} /></Box>;
}

function SongsTablePanel({ songs, expandedId, onExpand }) {
    return <TableContainer component={Paper}><Table><TableHeader /><TableBody>{songs.map((song) => renderSongRow(song, expandedId, onExpand))}</TableBody></Table></TableContainer>;
}

function TableHeader() {
    return <TableHead><TableRow>{TABLE_COLUMNS.map(renderHeaderCell)}</TableRow></TableHead>;
}

function renderHeaderCell(column) {
    return <TableCell key={column}>{column}</TableCell>;
}

function renderSongRow(song, expandedId, onExpand) {
    return <SongRow key={song.index} song={song} isExpanded={expandedId === song.index} onExpand={onExpand} />;
}

function SongRow({ song, isExpanded, onExpand }) {
    return <Fragment><SongSummaryRow song={song} isExpanded={isExpanded} onExpand={onExpand} /><SongDetailsRow song={song} isExpanded={isExpanded} /></Fragment>;
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

function SongDetailsRow({ song, isExpanded }) {
    return <TableRow><TableCell colSpan={TABLE_COLUMNS.length} sx={{ py: 0 }}><Collapse in={isExpanded} timeout="auto" unmountOnExit><SongDetails song={song} /></Collapse></TableCell></TableRow>;
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
