'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { 
    Box, 
    TextField, 
    Typography, 
    InputAdornment, 
    Chip, 
    Avatar,
    IconButton,
    Tooltip
} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import SearchIcon from '@mui/icons-material/Search';
import PhoneCallbackIcon from '@mui/icons-material/PhoneCallback';
import PhoneForwardedIcon from '@mui/icons-material/PhoneForwarded';
import RefreshIcon from '@mui/icons-material/Refresh';

import PageContent from '../../components/dashboard/pageContent'; 
import GlassCard from '../../components/dashboard/glassCard'; 

const getStatusStyles = (status: string) => {
    const s = status?.toLowerCase();
    switch (s) {
        case 'completed':
            return { bgColor: '#e8f5e9', textColor: '#2e7d32', label: 'Completed' };
        case 'in-progress':
        case 'ringing':
            return { bgColor: '#fff3e0', textColor: '#ef6c00', label: 'In-progress' };
        case 'busy':
        case 'no-answer':
        case 'failed':
            return { bgColor: '#ffeeee', textColor: '#c62828', label: 'Missed' };
        default:
            return { bgColor: '#f5f5f5', textColor: '#616161', label: status };
    }
};

// Función para formatear segundos a minutos y segundos
const formatDuration = (totalSeconds: number) => {
    if (!totalSeconds || totalSeconds === 0) return '0s';
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    if (minutes === 0) return `${seconds}s`;
    return `${minutes}m ${seconds}s`;
};

export default function FullCallHistoryPage() {
    const [rows, setRows] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(false);
    const VOICE_URL = process.env.NEXT_PUBLIC_VOICE_SERVICE_URL || 'https://voice.thenationalbuilders.com';

    const loadData = useCallback(async (query = '') => {
        setLoading(true);
        try {
            const res = await fetch(`${VOICE_URL}/call/history/search?search=${query}&limit=100`);
            const result = await res.json();
            setRows(result.data || []);
        } catch (e) {
            console.error("Error loading history:", e);
        } finally {
            setLoading(false);
        }
    }, [VOICE_URL]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const columns: GridColDef[] = [
        { 
            field: 'direction', 
            headerName: 'Type', 
            width: 70,
            sortable: false,
            renderCell: (params) => (
                <Avatar sx={{ 
                    bgcolor: params.value === 'outbound' ? 'rgba(33, 150, 243, 0.08)' : 'rgba(156, 39, 176, 0.08)',
                    width: 32, height: 32 
                }}>
                    {params.value === 'outbound' ? 
                        <PhoneForwardedIcon sx={{ color: '#1976d2', fontSize: 18 }} /> : 
                        <PhoneCallbackIcon sx={{ color: '#9c27b0', fontSize: 18 }} />
                    }
                </Avatar>
            )
        },
        { 
            field: 'createdAt', 
            headerName: 'Date & Time', 
            flex: 1.5,
            minWidth: 180,
            renderCell: (params) => {
                const dateValue = params.row.createdAt;
                if (!dateValue) return <Typography variant="body2">-</Typography>;

                const date = new Date(dateValue);

                const formatter = new Intl.DateTimeFormat('en-US', {
                    month: 'short',   
                    day: 'numeric',   
                    hour: '2-digit',  
                    minute: '2-digit',
                    hour12: true      
                });

                const formattedDate = formatter.format(date);

                return (
                    <Typography variant="body2" sx={{ fontWeight: 500, color: 'text.primary' }}>
                        {formattedDate}
                    </Typography>
                );
            }
        },
        { field: 'fromNumber', headerName: 'From', flex: 1, minWidth: 140 },
        { field: 'toNumber', headerName: 'To', flex: 1, minWidth: 140 },
        { 
            field: 'status', 
            headerName: 'Status', 
            flex: 1,
            minWidth: 130,
            renderCell: (params) => {
                const style = getStatusStyles(params.value);
                return (
                    <Chip 
                        label={style.label} 
                        size="small" 
                        sx={{ 
                            bgcolor: style.bgColor, 
                            color: style.textColor, 
                            fontWeight: '700',
                            fontSize: '0.65rem',
                            textTransform: 'uppercase',
                            borderRadius: '6px'
                        }} 
                    />
                );
            }
        },
        { 
            field: 'duration', 
            headerName: 'Duration', 
            flex: 1,
            minWidth: 110,
            renderCell: (params) => (
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {formatDuration(params.row.duration)}
                </Typography>
            )
        },
        { 
        field: 'recording', 
        headerName: 'Audio Recording', 
        flex: 1.5,
        minWidth: 250,
        sortable: false,
        renderCell: (params) => {
            const recordingUrl = params.row.recordings?.[0]?.recordingUrl || params.row.recordingUrl;

            if (!recordingUrl) {
                return <Typography variant="caption" color="text.disabled">No recording</Typography>;
            }

            return (
                <Box sx={{ width: '100%', pr: 2 }}>
                    <audio 
                        controls 
                        style={{ 
                            height: '30px', 
                            width: '100%', 
                            borderRadius: '8px',
                            filter: 'contrast(0.9) opacity(0.8)'
                        }}
                    >
                        <source src={recordingUrl} type="audio/mpeg" />
                        Your browser does not support the audio element.
                    </audio>
                </Box>
            );
         }
        },
        { field: 'agentId', headerName: 'Agent ID', flex: 0.8, minWidth: 100 },
    ];

    return (
        <PageContent>
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                    <Typography variant="h4" sx={{ fontWeight: 800, color: 'text.secondary', letterSpacing: '-1px' }}>
                        Global Call Logs
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Audit and search through all communication records
                    </Typography>
                </Box>
                <Tooltip title="Reload Data">
                    <IconButton onClick={() => loadData(search)} sx={{ bgcolor: 'background.paper', boxShadow: 1 }}>
                        <RefreshIcon />
                    </IconButton>
                </Tooltip>
            </Box>

            <GlassCard style={{ borderRadius: 24, padding: '30px', border: '1px solid rgba(255,255,255,0.2)' }}>
                <TextField 
                    fullWidth 
                    placeholder="Search by phone number..." 
                    variant="outlined" 
                    value={search}
                    onChange={(e) => {
                        setSearch(e.target.value);
                        loadData(e.target.value); 
                    }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon color="action" />
                            </InputAdornment>
                        ),
                    }}
                    sx={{ 
                        mb: 4,
                        '& .MuiOutlinedInput-root': {
                            borderRadius: '12px',
                            backgroundColor: 'rgba(255,255,255,0.4)'
                        }
                    }}
                />

                <Box sx={{ height: 650, width: '100%' }}>
                    <DataGrid 
                        rows={rows} 
                        columns={columns} 
                        loading={loading}
                        pageSizeOptions={[10, 25, 50]}
                        initialState={{
                            pagination: { paginationModel: { pageSize: 10 } },
                        }}
                        disableRowSelectionOnClick
                        sx={{ 
                            border: 'none',
                            width: '100%',
                            '& .MuiDataGrid-columnHeaders': {
                                backgroundColor: 'rgba(0,0,0,0.02)',
                                fontWeight: 'bold',
                                color: 'text.secondary',
                                textTransform: 'uppercase',
                                fontSize: '0.75rem'
                            },
                            '& .MuiDataGrid-cell': {
                                borderBottom: '1px solid rgba(0,0,0,0.05)',
                                py: 2,
                                display: 'flex',
                                alignItems: 'center'
                            }
                        }}
                    />
                </Box>
            </GlassCard>
        </PageContent>
    );
}