'use client';

import { Fragment, useState } from 'react';
import { Box, Collapse, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination as MuiTablePagination } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { QueryState } from './common/QueryState';
import { SongDetails } from './SongDetails';
import { useSongsQuery } from '@/hooks/useSongsQuery';
import { SONGS_PAGE_SIZE } from '@/lib/songs/constants';

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
    return <Box><SongsTablePanel songs={songs} expandedId={expandedId} onExpand={onExpand} uiText={uiText} /><SongsTablePagination page={page} onPageChange={onPageChange} uiText={uiText}/></Box>;
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

function SongsTablePagination({ page, onPageChange, uiText }) {
    return (
        <Box sx={{ mt: 2 }}>
            <MuiTablePagination
                component="div"
                count={-1}
                page={page - 1}
                rowsPerPage={SONGS_PAGE_SIZE}
                rowsPerPageOptions={[]}
                onPageChange={(_, nextPage) => onPageChange(nextPage + 1)}
                labelDisplayedRows={({ from, to }) =>
                    uiText.table.pagination.displayedRows(from, to, page)
                }
                getItemAriaLabel={(type) =>
                    uiText.table.pagination.ariaLabel[type]
                }
            />
        </Box>
    );
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
