import React from 'react';
import { Card, Typography, Divider, CardActions, Button } from '@mui/joy';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import { useMediaQuery } from '@mui/material';
import { Link } from 'react-router-dom';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';

const LogCard = ({ log }) => {
    const isLargeScreen = useMediaQuery('(min-width:600px)');
    const formattedDate = new Date(log.created_on).toLocaleDateString('en-GB'); // Format as dd/mm/yyyy
    const day = new Date(log.created_on).toLocaleDateString('en-US', { weekday: 'short' });

    return (
        <Card
            size="md"
            variant="outlined"
            sx={{
                maxHeight: isLargeScreen ? '220px' : '200px',
                minWidth: isLargeScreen ? '600px' : '300px',
                mb: 2, // Margin bottom for spacing
            }}
        >
            <Typography level="h4">{log.project_title}</Typography>
            <div className="flex justify-between items-center">
                <Typography level="body1">{formattedDate} | {day}</Typography>
                <Typography level="body1"> {log.work_permit}</Typography> {/* Assuming work_permit exists */}
            </div>
            <Divider inset="none" />
            <CardActions className="flex justify-between items-center">
                <Button
                    size="sm"
                    variant="soft"
                    color="neutral"
                    endDecorator={<KeyboardArrowRight />}
                    component={Link}
                    to={`/logs/${log.log_id}`}
                >
                    View Details
                </Button>

                <Button
                    size="sm"
                    variant="outline"
                    color="neutral"
                // startDecorator={<LocationOnOutlinedIcon />}
                >
                    {log.vendor_name}
                </Button>
            </CardActions>
        </Card>
    );
};

export default LogCard;
