'use client';

import { Fragment, useState } from 'react';
import {
    Box,
    Collapse,
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination as MuiTablePagination,
    TableRow
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { QueryState } from './common/QueryState';
import { SongDetails } from './SongDetails';
import { useSongsQuery } from '@/hooks/useSongsQuery';
import { SONGS_PAGE_SIZE } from '@/lib/songs/constants';

const summaryRowStyles = { cursor: 'pointer' };
const detailsCellStyles = { py: 0 };
const paginationStyles = { mt: 2 };

export function SongsTable(props) {
    const [expandedId, setExpandedId] = useState(null);
    const query = useSongsQuery(createQueryParams(props));

    return <SongsTableQueryState query={query} props={props} expandedId={expandedId} onExpand={setExpandedId} />;
}

function SongsTableQueryState({ query, props, expandedId, onExpand }) {
    return (
        <QueryState query={query} errorMessage={props.uiText.messages.loadSongsError}>
            <SongsTableContent {...props} songs={getSongs(query)} expandedId={expandedId} onExpand={onExpand} />
        </QueryState>
    );
}

function SongsTableContent({ songs, page, expandedId, onExpand, onPageChange, uiText }) {
    return <Box><SongsTablePanel songs={songs} expandedId={expandedId} onExpand={onExpand} uiText={uiText} /><SongsTablePagination page={page} onPageChange={onPageChange} uiText={uiText} /></Box>;
}

function SongsTablePanel({ songs, expandedId, onExpand, uiText }) {
    return <TableContainer component={Paper}><Table><TableHeader columns={uiText.table.columns} /><TableBody>{renderSongRows(songs, expandedId, onExpand, uiText)}</TableBody></Table></TableContainer>;
}

function TableHeader({ columns }) {
    return <TableHead><TableRow>{columns.map(renderHeaderCell)}</TableRow></TableHead>;
}

function renderHeaderCell(column) {
    return <TableCell key={column}>{column}</TableCell>;
}

function renderSongRows(songs, expandedId, onExpand, uiText) {
    return songs.map((song) => renderSongRow(song, expandedId, onExpand, uiText));
}

function renderSongRow(song, expandedId, onExpand, uiText) {
    return <SongRow key={song.index} song={song} isExpanded={expandedId === song.index} onExpand={onExpand} uiText={uiText} />;
}

function SongRow({ song, isExpanded, onExpand, uiText }) {
    return <Fragment><SongSummaryRow song={song} isExpanded={isExpanded} onExpand={onExpand} /><SongDetailsRow song={song} isExpanded={isExpanded} uiText={uiText} /></Fragment>;
}

function SongSummaryRow({ song, isExpanded, onExpand }) {
    return <TableRow hover sx={summaryRowStyles} onClick={() => toggleSongRow(song, isExpanded, onExpand)}><ExpandCell isExpanded={isExpanded} /><SongCells song={song} /></TableRow>;
}

function ExpandCell({ isExpanded }) {
    return <TableCell><ExpandIcon isExpanded={isExpanded} /></TableCell>;
}

function ExpandIcon({ isExpanded }) {
    return <IconButton size="small">{isExpanded ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}</IconButton>;
}

function SongCells({ song }) {
    return <>{getSongRowValues(song).map((value, index) => renderSongCell(song, value, index))}</>;
}

function renderSongCell(song, value, index) {
    return <TableCell key={`${song.index}-${index}`}>{value}</TableCell>;
}

function SongDetailsRow({ song, isExpanded, uiText }) {
    return <TableRow><TableCell colSpan={uiText.table.columns.length} sx={detailsCellStyles}><SongDetailsCollapse song={song} isExpanded={isExpanded} uiText={uiText} /></TableCell></TableRow>;
}

function SongDetailsCollapse({ song, isExpanded, uiText }) {
    return <Collapse in={isExpanded} timeout="auto" unmountOnExit><SongDetails song={song} uiText={uiText} /></Collapse>;
}

function SongsTablePagination({ page, onPageChange, uiText }) {
    return <Box sx={paginationStyles}><MuiTablePagination {...createPaginationProps(page, onPageChange, uiText)} /></Box>;
}

function createPaginationProps(page, onPageChange, uiText) {
    return { ...createPaginationBaseProps(page), ...createPaginationHandlers(page, onPageChange, uiText) };
}

function createPaginationBaseProps(page) {
    return { component: 'div', count: -1, page: page - 1, rowsPerPage: SONGS_PAGE_SIZE, rowsPerPageOptions: [] };
}

function createPaginationHandlers(page, onPageChange, uiText) {
    return { onPageChange: createPageChangeHandler(onPageChange), labelDisplayedRows: createDisplayedRowsLabel(uiText, page), getItemAriaLabel: createAriaLabel(uiText) };
}

function createPageChangeHandler(onPageChange) {
    return (_, nextPage) => onPageChange(nextPage + 1);
}

function createDisplayedRowsLabel(uiText, page) {
    return ({ from, to }) => uiText.table.pagination.displayedRows(from, to, page);
}

function createAriaLabel(uiText) {
    return (type) => uiText.table.pagination.ariaLabel[type];
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

function getSongs(query) {
    return query.data?.items ?? [];
}
