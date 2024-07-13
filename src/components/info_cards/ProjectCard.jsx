import React from 'react';
import { Box, Card, Chip, Typography, Divider, ListItem, CardActions, Button } from '@mui/joy';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import { useMediaQuery } from '@mui/material';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';

const ProjectCard = ({ projectName, projectLocation, projectStatus, deliveryEndDate, projectId, type, onClick }) => {
    const isLargeScreen = useMediaQuery('(min-width:600px)');
    const getColor = (type) => {
        switch (type) {
            case 'construction':
                return 'primary';
            case 'renovation':
                return 'warning';
            default:
                return 'neutral';
        }
    };

    const getWeeksLeft = (endDate) => {
        const today = dayjs();
        const end = dayjs(endDate);
        const diff = end.diff(today, 'week');
        return diff > 0 ? `${diff} weeks left` : 'Completed';
    };

    return (

        <Card
            size="md"
            variant="outlined"
            sx={{
                maxHeight: isLargeScreen ? '220px' : '160px',
                minWidth: isLargeScreen ? '400px' : '200px',
                margin: '5px'
            }}
        // onClick={onClick}
        >
            <Typography level="h4">{projectName}</Typography>
            <div className="flex justify-between items-center">
                <Chip size="sm" variant="outlined" color={getColor(type)}>
                    {type}
                </Chip>
                <ListItem size="sm" className="list-none">{projectLocation}</ListItem>
            </div>
            <Divider inset="none" />
            <CardActions className="flex justify-between items-center">
                <Button
                    size="sm"
                    variant="soft"
                    color="neutral"
                    endDecorator={<KeyboardArrowRight />}
                    component={Link}
                    onClick={onClick}
                    to={`${projectId}`}
                >
                    View
                </Button>
                <Typography variant="body2">
                    {getWeeksLeft(deliveryEndDate)}
                </Typography>
            </CardActions>
        </Card>
    );
};

export default ProjectCard;
