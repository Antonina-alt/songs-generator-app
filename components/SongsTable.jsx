'use client';

import { Fragment, useState } from 'react';
import { Box, Collapse, IconButton, Pagination, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { ErrorState } from './common/ErrorState';
import { LoadingState } from './common/LoadingState';
import { SongDetails } from './SongDetails';
import { TABLE_PAGE_COUNT } from '@/lib/songs/constants';
import { useSongsQuery } from '@/hooks/useSongsQuery';

const columns = ['', '#', 'Title', 'Artist', 'Album', 'Genre', 'Likes'];

export function SongsTable({ region, seed, likes, page, onPageChange }) {
    const [expandedId, setExpandedId] = useState(null);
    const query = useSongsQuery({ region, seed, likes, page });
    if (query.isLoading) return <LoadingState />;
    if (query.isError) return <ErrorState message="Failed to load songs." />;
    return <SongsTableContent songs={query.data.items} page={page} expandedId={expandedId} onExpand={setExpandedId} onPageChange={onPageChange} />;
}

function SongsTableContent({ songs, page, expandedId, onExpand, onPageChange }) {
    return <Box><TableContainer component={Paper}><Table><TableHeader /><TableBody>{songs.map((song) => <SongRow key={song.index} song={song} isExpanded={expandedId === song.index} onExpand={onExpand} />)}</TableBody></Table></TableContainer><TablePagination page={page} onPageChange={onPageChange} /></Box>;
}

function TableHeader() {
    return <TableHead><TableRow>{columns.map((column) => <TableCell key={column}>{column}</TableCell>)}</TableRow></TableHead>;
}

function SongRow({ song, isExpanded, onExpand }) {
    return <Fragment><SongSummaryRow song={song} isExpanded={isExpanded} onExpand={onExpand} /><SongDetailsRow song={song} isExpanded={isExpanded} /></Fragment>;
}

function SongSummaryRow({ song, isExpanded, onExpand }) {
    return <TableRow hover sx={{ cursor: 'pointer' }} onClick={() => onExpand(isExpanded ? null : song.index)}><TableCell><ExpandIcon isExpanded={isExpanded} /></TableCell><TableCell>{song.index}</TableCell><TableCell>{song.title}</TableCell><TableCell>{song.artist}</TableCell><TableCell>{song.album}</TableCell><TableCell>{song.genre}</TableCell><TableCell>{song.likes}</TableCell></TableRow>;
}

function ExpandIcon({ isExpanded }) {
    return <IconButton size="small">{isExpanded ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}</IconButton>;
}

function SongDetailsRow({ song, isExpanded }) {
    return <TableRow><TableCell colSpan={columns.length} sx={{ py: 0 }}><Collapse in={isExpanded} timeout="auto" unmountOnExit><SongDetails song={song} /></Collapse></TableCell></TableRow>;
}

function TablePagination({ page, onPageChange }) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}><Pagination page={page} count={TABLE_PAGE_COUNT} onChange={(_, nextPage) => onPageChange(nextPage)} /></Box>;
}
