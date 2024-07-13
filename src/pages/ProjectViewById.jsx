import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import supabase from '../supabase';
import Title from '../components/ui_components/Title';
import Subheading from '../components/ui_components/Subheading';
import { Table, TableBody, TableRow, TableCell } from '@mui/material';
import { IconButton, Dialog, DialogTitle, DialogContent, Grid } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import Logs from './Logs';
import ApprovalForm from './Approvals';
import CloseIcon from '@mui/icons-material/Close';
import ApprovalCard from '../components/info_cards/ApprovalCard';
import RefreshIcon from '@mui/icons-material/Refresh';
import SecondaryButton from '../components/ui_components/SecondaryButton';
import FileDisplaySection from '../components/FetchFiles';
import DoneIcon from '@mui/icons-material/Done';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import { Chip } from '@mui/joy';
import Milestones from '../components/Milestones';

const ProjectView = () => {
    const { projectId } = useParams();
    const [project, setProject] = useState(null);
    const [open, setOpen] = useState(false);
    const [buPrg, setBuPrg] = useState([]);
    const [prg, setPrg] = useState([]);
    const [cec, setCec] = useState([]);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const fetchProject = async () => {
        try {
            const { data, error } = await supabase
                .from('projects')
                .select('*')
                .eq('project_id', projectId)
                .single();

            if (error) {
                throw error;
            }
            setProject(data);
        } catch (error) {
            console.error('Error fetching project:', error.message);
        }
    };

    const fetchApprovals = async (stakeholder, setSectionData) => {
        try {
            const { data, error } = await supabase
                .from('approvals')
                .select('*')
                .eq('stakeholder', stakeholder)
                .eq('project_id', projectId);

            if (error) {
                throw error;
            }
            setSectionData(data);
        } catch (error) {
            console.error('Error fetching approvals:', error.message);
        }
    };

    useEffect(() => {
        fetchProject();
        fetchApprovals('BU PRG', setBuPrg);
        fetchApprovals('PRG', setPrg);
        fetchApprovals('CEC', setCec);
    }, [projectId]);

    if (!project) {
        return <div className='bg-white pb-20 p-5 min-w-screen'><Subheading text="Loading..." /></div>;
    }

    const Section = ({ title, updates }) => (
        <div className="w-full p-0 box-border flex flex-col items-center">
            <div className="mb-4">
                <Subheading text={title} />
            </div>
            {updates.length === 0 ? (
                <p className="m-0">No approval updates yet.</p>
            ) : (
                updates.map((update, index) => (
                    <div key={index} className="w-full">
                        <ApprovalCard update={update} />
                    </div>
                ))
            )}

            <FileDisplaySection projectId={projectId} tag={title} />
        </div>
    );

    const formatValue = (field, value) => {
        if (field.isDate) {
            return value ? new Date(value).toLocaleDateString('en-GB') : 'N/A';
        }
        return value || 'N/A';
    };

    const handleRefresh = () => {
        fetchApprovals('BU PRG', setBuPrg);
        fetchApprovals('PRG', setPrg);
        fetchApprovals('CEC', setCec);
    };

    const sendVendor = async () => {
        try {
            const { data, error } = await supabase
                .from('projects')
                .select('sent_to_vendor')
                .eq('project_id', projectId)
                .single();

            if (error) {
                throw new Error(`Error fetching data: ${error.message}`);
            }

            if (data.sent_to_vendor) {
                alert('The data has already been sent to the vendor');
                return;
            }

            const { error: updateError } = await supabase
                .from('projects')
                .update({ sent_to_vendor: true })
                .eq('project_id', projectId)
                .eq('sent_to_vendor', false);

            if (updateError) {
                throw new Error(`Error updating data: ${updateError.message}`);
            }

            alert('Success: The data has been sent to the vendor');
        } catch (error) {
            console.error('Error:', error.message);
            alert(`Error: ${error.message}`);
        }
    };

    const changeStatus = async (status) => {
        try {
            // Fetch the current status of the project
            const { data, error } = await supabase
                .from('projects')
                .select('status')
                .eq('project_id', projectId)
                .single();

            if (error) {
                throw new Error(`Error fetching data: ${error.message}`);
            }

            const currentStatus = data.status;

            // Determine the new status
            const newStatus = currentStatus === 'upcoming'
                ? 'ongoing'
                : currentStatus === 'ongoing'
                    ? 'completed'
                    : currentStatus; // No change if it's already 'completed'

            // Update the project status
            const { error: updateError } = await supabase
                .from('projects')
                .update({ status: newStatus })
                .eq('project_id', projectId);

            if (updateError) {
                throw new Error(`Error updating data: ${updateError.message}`);
            }

            alert('Success: The project status has been updated');
        } catch (error) {
            console.error('Error:', error.message);
            alert(`Error: ${error.message}`);
        }
    };


    return (
        <div className='bg-blue-50 pb-20 p-5 min-w-screen'>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around' }}>
                <Title text={project.project_title ? project.project_title : 'Unknown Project'} />
                <Chip size="sm" variant="outlined" color="primary">
                    {project.status}
                </Chip>
                {project.status === 'completed'
                    ? ''
                    : project.status === 'ongoing'
                        ? <IconButton onClick={() => changeStatus(project.status)}>
                            <DoneIcon color="primary" sx={{ fontSize: 30 }} />
                        </IconButton>
                        : project.status === 'upcoming'
                            ? <IconButton onClick={() => changeStatus(project.status)}>
                                <PlayCircleOutlineIcon color="primary" sx={{ fontSize: 30 }} />
                            </IconButton>
                            : 'Status Unknown'}
            </div>


            <div className="py-5 pb-1 mx-auto w-full sm:w-4/5 lg:w-3/4">
                <div className="w-full overflow-x-auto">
                    <Table className="w-full sm:w-90 lg:w-75">
                        <TableBody>
                            {Object.keys(project).map((field, index) => (
                                <TableRow key={index}>
                                    <TableCell>{field.replace(/_/g, ' ')}</TableCell>
                                    <TableCell>{formatValue({ isDate: field.includes('date') }, project[field])}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Title text="Approvals" />
                    <IconButton onClick={handleRefresh}>
                        <RefreshIcon sx={{ fontSize: 30 }} />
                    </IconButton>
                    <IconButton onClick={handleClickOpen}>
                        <AddIcon sx={{ fontSize: 30 }} />
                    </IconButton>
                </div>
                <Dialog
                    open={open}
                    onClose={handleClose}
                    fullWidth
                    maxWidth="md"
                    PaperProps={{
                        style: {
                            border: 'none',
                            boxShadow: 'none',
                            padding: '0',
                        },
                    }}
                >
                    <DialogTitle>
                        <IconButton
                            edge="end"
                            color="inherit"
                            onClick={handleClose}
                            aria-label="close"
                            style={{
                                position: 'absolute',
                                right: 12,
                                top: 12,
                            }}
                        >
                            <CloseIcon />
                        </IconButton>
                    </DialogTitle>
                    <DialogContent style={{ padding: '0' }}>
                        <ApprovalForm projectId={projectId} />
                    </DialogContent>
                </Dialog>

                <Grid container spacing={1}>
                    <Grid item xs={12} md={4}>
                        <Section title="BU PRG" updates={buPrg} />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Section title="PRG" updates={prg} />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Section title="CEC" updates={cec} />
                    </Grid>
                </Grid>

                <br />

                <SecondaryButton text="Send to Vendor" onClick={sendVendor} />
            </div>
            {/* <Logs projectId={projectId} /> */}

            <Milestones projectId={projectId} />
        </div>
    );
};

export default ProjectView;