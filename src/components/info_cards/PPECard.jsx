import React from 'react';
import { Box, Card, Typography, Button, Chip, Tooltip } from '@mui/joy';
import { TrashIcon, PencilIcon } from '@heroicons/react/24/outline';

// Helper function to format the ppe_items entries
const formatEntry = (entry) => {
    return entry
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
};

const PPEEntryCard = ({ entry, onEdit, onDelete }) => {
    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center', // Center horizontally
                width: '100%',
                marginBottom: '10px', // Adjust margin as needed
            }}
        >
            <Card
                size="md"
                variant="outlined"
                sx={{
                    width: '100%', // Take full width of the container
                    maxWidth: '550px',
                    marginX: 'auto',
                    marginTop: '5px', // Center horizontally
                    padding: '14px',
                    '@media (max-width: 600px)': {
                        padding: '8px',
                        maxWidth: '350px',
                    }
                }}
            >
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography level="h5" sx={{ wordBreak: 'break-word' }}>{entry.name}</Typography>
                    <Typography>{entry.p_no}</Typography>
                </Box>
                <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
                    <Box display="flex" flexWrap="wrap" gap={1}>
                        {entry.ppe_items.map((item, index) => (
                            <Chip key={index} size="sm" variant="outlined">
                                {formatEntry(item)}
                            </Chip>
                        ))}
                    </Box>
                    <Box display="flex" gap={1}>
                        {/* <Tooltip title="Edit">
                            <Button
                                size="sm"
                                variant="none"
                                onClick={() => onEdit(entry)}
                            >
                                <PencilIcon className="size-4 text-blue-850" />
                            </Button>
                        </Tooltip> */}
                        <Tooltip title="Delete">
                            <Button
                                size="sm"
                                variant="none"
                                onClick={() => onDelete(entry)}
                            >
                                <TrashIcon className="size-4 text-blue-850" />
                            </Button>
                        </Tooltip>
                    </Box>
                </Box>
            </Card>
        </Box>
    );
};

export default PPEEntryCard;
