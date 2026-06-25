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

export function SongsTable({ region, seed, likes, page, onPageChange, uiText }) {
    const [expandedId, setExpandedId] = useState(null);
    const query = useSongsQuery({ region, seed, likes, page });
    const songs = query.data?.items ?? [];

    return (
        <QueryState query={query} errorMessage={uiText.messages.loadSongsError}>
            <Box>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHeader columns={uiText.table.columns} />
                        <TableBody>
                            {songs.map((song) => (
                                <SongRow
                                    key={song.index}
                                    song={song}
                                    isExpanded={expandedId === song.index}
                                    onToggle={() => setExpandedId(expandedId === song.index ? null : song.index)}
                                    uiText={uiText}
                                />
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <SongsTablePagination page={page} onPageChange={onPageChange} uiText={uiText} />
            </Box>
        </QueryState>
    );
}

function TableHeader({ columns }) {
    return (
        <TableHead>
            <TableRow>
                {columns.map((column) => <TableCell key={column}>{column}</TableCell>)}
            </TableRow>
        </TableHead>
    );
}

function SongRow({ song, isExpanded, onToggle, uiText }) {
    return (
        <Fragment>
            <TableRow hover sx={summaryRowStyles} onClick={onToggle}>
                <TableCell>
                    <IconButton size="small">
                        {isExpanded ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                </TableCell>
                {getSongRowValues(song).map((value, index) => (
                    <TableCell key={`${song.index}-${index}`}>{value}</TableCell>
                ))}
            </TableRow>
            <TableRow>
                <TableCell colSpan={uiText.table.columns.length} sx={detailsCellStyles}>
                    <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                        <SongDetails song={song} uiText={uiText} />
                    </Collapse>
                </TableCell>
            </TableRow>
        </Fragment>
    );
}

function SongsTablePagination({ page, onPageChange, uiText }) {
    return (
        <Box sx={paginationStyles}>
            <MuiTablePagination
                component="div"
                count={-1}
                page={page - 1}
                rowsPerPage={SONGS_PAGE_SIZE}
                rowsPerPageOptions={[]}
                onPageChange={(_, nextPage) => onPageChange(nextPage + 1)}
                labelDisplayedRows={({ from, to }) => uiText.table.pagination.displayedRows(from, to, page)}
                getItemAriaLabel={(type) => uiText.table.pagination.ariaLabel[type]}
            />
        </Box>
    );
}

function getSongRowValues(song) {
    return [song.index, song.title, song.artist, song.album, song.genre, song.likes];
}
