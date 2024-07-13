import React from 'react';
import { Box, Card, Chip, Typography, Divider, ListItem, CardActions, Button } from '@mui/joy';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import { useMediaQuery } from '@mui/material';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';

const ApprovalCard = ({ update }) => {
    const isLargeScreen = useMediaQuery('(min-width:600px)');

    const getColor = (status) => {
        switch (status) {
            case 'Approved':
                return 'success';
            case 'Rejected':
                return 'danger';
            case 'Revision Needed':
                return 'warning';
            default:
                return 'neutral';
        }
    };

    return (
        <Card
            size="md"
            variant="outlined"
            sx={{
                // maxHeight: isLargeScreen ? '0px' : '160px',
                maxWidth: isLargeScreen ? '300px' : '220px',
                margin: '5px'
            }}
        >
            {/* <Typography level="h4">{projectName}</Typography> */}
            <div className="flex justify-between items-center">
                <Chip size="sm" variant="outlined" color={getColor(update.approval_stage)}>
                    {update.approval_stage}
                </Chip>
            </div>
            {/* <p><strong>Stakeholder: <br />  </strong>{update.stakeholder}</p> */}
            <p><strong>Remarks: <br />  </strong>{update.remarks}</p>

            <p><strong>Reviewed by: <br />  </strong>{update.reviewed_by}</p>
            <p><strong>Reviewer ID: <br />  </strong>{update.reviewer_id}</p>

            {/* <p><strong>Approval Stage: <br />  </strong>{update.approval_stage}</p> */}

            {/* <Divider inset="none" /> */}
            <CardActions className="flex justify-between items-center">
                {/* <Button
                    size="sm"
                    variant="soft"
                    color="neutral"
                    endDecorator={<KeyboardArrowRight />}
                    component={Link}
                >
                    View
                </Button> */}
            </CardActions>
        </Card>
    );
};

export default ApprovalCard;
