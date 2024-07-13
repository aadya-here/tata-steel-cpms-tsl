import React from 'react';
import Accordion from '@mui/joy/Accordion';
import AccordionSummary from '@mui/joy/AccordionSummary';
import AccordionDetails from '@mui/joy/AccordionDetails';
import Typography from '@mui/joy/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const CustomAccordion = ({ title, content, isExpanded, onToggle }) => (

    <Accordion expanded={isExpanded} onChange={onToggle} className="border rounded-lg">
        <AccordionSummary className="bg-blue-100 hover:bg-blue-300" expandIcon={<ExpandMoreIcon />}>
            <Typography className="font-semibold">{title}</Typography>
        </AccordionSummary>
        <AccordionDetails className="bg-blue-50">
            <Typography>{content}</Typography>
        </AccordionDetails>
    </Accordion>
);

export default CustomAccordion;
