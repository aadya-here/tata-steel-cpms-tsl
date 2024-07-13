import React, { useState } from 'react';
import { FormControl, InputLabel, MenuItem, Select, Container } from '@mui/material';
import supabase from '../supabase';
import SubmitButton from '../components/ui_components/PrimaryButton';
import InputField from '../components/ui_components/InputField';
import Title from '../components/ui_components/Title';
import MultiTextField from '../components/ui_components/MultilineText';
import AddFile from '../components/AddFile';
import SecondaryButton from '../components/ui_components/SecondaryButton';
import { Divider } from '@mui/joy';

const approvalStages = [
    "Approved",
    "Revision Needed",
    "Rejected",
];

const stakeholders = [
    "BU PRG",
    "PRG",
    "CEC",
];

const ApprovalForm = ({ projectId }) => {
    const [remarks, setRemarks] = useState('');
    const [reviewedBy, setReviewedBy] = useState('');
    const [reviewerId, setReviewerId] = useState('');
    const [stakeholder, setStakeholder] = useState('');
    const [approvalStage, setApprovalStage] = useState('');
    const [fileUrls, setFileUrls] = useState([]);
    // const [caption, setCaption] = useState('');

    const handleFileAdded = (fileUrl) => {
        setFileUrls([...fileUrls, fileUrl]);
    };

    const handleSubmit = async () => {
        const approvalData = {
            stakeholder,
            remarks,
            reviewed_by: reviewedBy,
            reviewer_id: reviewerId,
            project_id: projectId,
            approval_stage: approvalStage,
            file_urls: fileUrls,
        };

        try {
            const { data, error } = await supabase
                .from('approvals')
                .insert([approvalData]);

            if (error) {
                alert('Error: ' + error.message);
            } else {
                alert('Success: Approval information submitted successfully');
            }
        } catch (error) {
            console.error('Error submitting approval information:', error);
            alert('Error: An unexpected error occurred while submitting the approval information.');
        }
    };

    return (
        <Container className='bg-blue-50 pb-20 min-w-screen w-full'>
            <Title text="Approval Update" />
            <MultiTextField
                label="Remarks"
                value={remarks}
                handleInputChange={setRemarks}
            />
            <InputField
                placeholder="Reviewed By"
                value={reviewedBy}
                handleInputChange={setReviewedBy}
            />
            <InputField
                placeholder="Reviewer ID"
                value={reviewerId}
                handleInputChange={setReviewerId}
                type="number"
            />
            <div className="w-full flex justify-center">
                <div className="p-2 bg-white shadow-md rounded-md flex items-center space-x-4 w-full sm:w-4/5 md:w-4/5 lg:w-full" style={{ maxWidth: '600px' }}>
                    <FormControl fullWidth margin="normal">
                        <InputLabel id="stakeholder-label">Stakeholder Org</InputLabel>
                        <Select
                            labelId="stakeholder-label"
                            id="stakeholder"
                            value={stakeholder}
                            name="stakeholder"
                            onChange={(e) => setStakeholder(e.target.value)}
                        >
                            {stakeholders.map((org, index) => (
                                <MenuItem key={index} value={org}>{org}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl fullWidth margin="normal">
                        <InputLabel id="approval-stage-label">Approval Stage</InputLabel>
                        <Select
                            labelId="approval-stage-label"
                            id="approval-stage"
                            value={approvalStage}
                            name="approval_stage"
                            onChange={(e) => setApprovalStage(e.target.value)}
                        >
                            {approvalStages.map((stage, index) => (
                                <MenuItem key={index} value={stage}>{stage}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </div>
            </div>
            <AddFile
                projectId={projectId}
                logId={null}
                // userId={reviewerId}
                // caption={caption}
                folderPath="approvals"
                onFileAdded={handleFileAdded}
                tag={`${stakeholder}`}
            />
            <SubmitButton text="Submit" handleSubmit={handleSubmit} />
        </Container>
    );
};

export default ApprovalForm;