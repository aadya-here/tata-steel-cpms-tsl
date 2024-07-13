import React, { useEffect, useState } from 'react';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepContent from '@mui/material/StepContent';
import Button from '@mui/joy/Button';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import RefreshIcon from '@mui/icons-material/Refresh';
import CloseIcon from '@mui/icons-material/Close';
import Modal from '@mui/material/Modal';
import supabase from '../supabase'; // Import your Supabase client
import Title from './ui_components/Title';
import InputField from './ui_components/InputField';
import SubmitButton from './ui_components/PrimaryButton';
import DatePickerField from '../components/ui_components/Datepicker';
import SecondaryButton from './ui_components/SecondaryButton';

const Milestones = ({ projectId }) => {
    const [milestones, setMilestones] = useState([]);
    const [activeStep, setActiveStep] = useState(0);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [targetDate, setTargetDate] = useState(new Date());
    const [modalOpen, setModalOpen] = useState(false);

    useEffect(() => {
        const fetchMilestones = async () => {
            const { data, error } = await supabase
                .from('milestones')
                .select('*')
                .order('milestone_id', { ascending: true })
                .eq('project_id', projectId);

            if (error) {
                console.error('Error fetching milestones:', error.message);
            } else {
                setMilestones(data);

                // Find the first milestone that is not completed and set it as the active step
                const upcomingIndex = data.findIndex(
                    milestone => milestone.status !== 'completed'
                );
                if (upcomingIndex !== -1) {
                    setActiveStep(upcomingIndex);
                }
            }
        };

        fetchMilestones();
    }, [projectId]);

    const handleNext = (event) => {
        // event.preventDefault();
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const updateMilestoneStatus = async (milestoneId, status) => {
        const { error } = await supabase
            .from('milestones')
            .update({ status, completed_on: status === 'completed' ? new Date() : null })
            .eq('milestone_id', milestoneId);

        if (error) {
            console.error('Error updating milestone status:', error.message);
        } else {
            const updatedMilestones = milestones.map((milestone) =>
                milestone.milestone_id === milestoneId
                    ? { ...milestone, status }
                    : milestone
            );
            setMilestones(updatedMilestones);
            handleNext();
        }
    };

    const handleCreateMilestone = async (event) => {
        // event.preventDefault();
        const { data, error } = await supabase
            .from('milestones')
            .insert([
                {
                    project_id: projectId,
                    status: 'upcoming',
                    title,
                    description,
                    target_date: targetDate,
                },
            ])
            .select();

        if (error) {
            console.error('Error creating milestone:', error.message);
        } else if (data && data.length > 0) {
            setMilestones((prevMilestones) => [...prevMilestones, ...data]);
            setTitle('');
            setDescription('');
            setTargetDate(new Date());
            setModalOpen(false);
        } else {
            console.error('No data returned after inserting milestone');
        }
    };

    const handleOpenModal = () => setModalOpen(true);
    const handleCloseModal = () => setModalOpen(false);

    return (
        <div className="w-full flex flex-col items-center">
            <div className="flex items-center justify-between w-full max-w-2xl p-4">
                <Title text="Milestones" />
                <div className="flex items-center space-x-2">
                    <IconButton onClick={handleOpenModal}>
                        <AddIcon />
                    </IconButton>
                    {/* <IconButton onClick={() => window.location.reload()}>
                        <RefreshIcon />
                    </IconButton> */}
                </div>
            </div>

            <Stepper activeStep={activeStep} orientation="vertical">
                {milestones.map((milestone, index) => (
                    <Step key={milestone.title}>
                        <StepLabel
                            optional={index === milestones.length - 1 ? <Typography variant="caption">Last step</Typography> : null}
                        >
                            {milestone.title}
                        </StepLabel>
                        <StepContent>
                            <Typography>{milestone.description}</Typography>
                            <Typography>Target Date: {new Date(milestone.target_date).toLocaleDateString()}</Typography>
                            <div className="mb-2">
                                <div>

                                    {/* <SecondaryButton text="Mark as completed" onClick={() => updateMilestoneStatus(milestone.milestone_id, 'completed')} /> */}
                                    <Button
                                        variant="outlined"
                                        // color='success'
                                        onClick={() => {
                                            // event.preventDefault();
                                            updateMilestoneStatus(milestone.milestone_id, 'completed');
                                        }}
                                        sx={{ mt: 1 }}
                                        disabled={milestone.status === 'completed'}
                                    >
                                        mark as done
                                    </Button>
                                </div>
                            </div>
                        </StepContent>
                    </Step>
                ))}
            </Stepper>
            <Modal open={modalOpen} onClose={handleCloseModal}>
                <div className="flex justify-center items-center h-screen">
                    <div className="bg-blue-50 p-8 rounded-md shadow-md w-full max-w-md relative">
                        <div className="flex justify-between">
                            <p >Create New Milestone</p>
                            <IconButton sx={{ marginRight: 1 }} onClick={handleCloseModal}>
                                <CloseIcon />
                            </IconButton>
                        </div>
                        <form onSubmit={handleCreateMilestone}>
                            <InputField
                                placeholder="Title"
                                value={title}
                                handleInputChange={setTitle}
                            />
                            <InputField
                                placeholder="Description"
                                value={description}
                                handleInputChange={setDescription}
                            />
                            <DatePickerField
                                label="Target Date"
                                date={targetDate}
                                setDate={setTargetDate}
                            />
                            <SubmitButton text="Create Milestone" />
                        </form>
                    </div>
                </div>
            </Modal >
        </div >
    );
};

export default Milestones;
