import { useParams } from 'react-router-dom';
import supabase from '../supabase';
import React, { useEffect, useState } from 'react';
import Title from '../components/ui_components/Title';
import Subheading from '../components/ui_components/Subheading';
import { Divider, Button, Modal, Box, TextField } from '@mui/material';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import TableComponent from '../components/TableComponent';
import SecondaryButton from '../components/ui_components/SecondaryButton';
import InputField from '../components/ui_components/InputField';
import SubmitButton from '../components/ui_components/PrimaryButton';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

function FormsView() {
    const { vendorId, formName, formId, formLogId } = useParams();
    const [data, setData] = useState(null);
    const [approvalData, setApprovalData] = useState(null);
    const [projectId, setProjectId] = useState(null);
    const [projectName, setProjectName] = useState('');
    const [vendorName, setVendorName] = useState('');

    const [open, setOpen] = useState(false);
    const [approvedByName, setApprovedByName] = useState('');
    const [approvedByPno, setApprovedByPno] = useState('');
    const [approvalStatus, setApprovalStatus] = useState('');
    const [approvalRemarks, setApprovalRemarks] = useState('');

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const getTableName = (formName) => {
        switch (formName) {
            case 'Chipper Machine Checklist':
                return 'form_chipper_machine';
            case 'Hand Tools and Tackles Checklist':
                return 'form_hand_tools_and_tackles';
            case 'Ply Cutter Machine Checklist':
                return 'form_ply_cutter_machine';
            case 'Vibrator Machine Checklist':
                return 'form_vibrator_machine';
            case 'Full Body Harness Checklist':
                return 'form_full_body_harness';
            case 'Tiles Cutting Machine Checklist':
                return 'form_tiles_cutting_machine';
            case 'Rod Cutting Machine Checklist':
                return 'form_rod_cutting_machine';
            case 'Brick Masonry QC':
                return 'form_brick_masonry_qc';
            case 'Micro Concrete QC':
                return 'form_micro_concrete_qc';
            case 'Mortar Plastering QC':
                return 'form_mortar_plastering_qc';
            case 'Painting QC':
                return 'form_painting_qc';
            case 'Plastering QC':
                return 'form_plastering_qc';
            default:
                return null;
        }
    };

    useEffect(() => {
        const fetchFormData = async () => {
            const tableName = getTableName(formName);
            if (!tableName) {
                console.error('Invalid form name:', formName);
                return;
            }

            try {
                const { data: formData, error: formError } = await supabase
                    .from(tableName)
                    .select('*')
                    .eq('log_id', formId)
                    .single();

                if (formError) {
                    console.error('Error fetching form data:', formError.message);
                } else {
                    setData(formData);
                    setProjectId(formData.project_id); // Set projectId from formData
                }
            } catch (error) {
                console.error('Error in fetchFormData:', error.message);
            }
        };

        const fetchApprovalData = async () => {
            try {
                const { data: approvalData, error: approvalError } = await supabase
                    .from('forms_logs')
                    .select('approved_by_name, approved_by_pno, approval_status, approval_remarks')
                    .eq('form_log_id', formLogId)
                    .single();

                if (approvalError) {
                    console.error('Error fetching approval data:', approvalError.message);
                } else {
                    setApprovalData(approvalData);
                }
            } catch (error) {
                console.error('Error in fetchApprovalData:', error.message);
            }
        };

        const fetchProjectName = async () => {
            try {
                const { data: projData, error: projError } = await supabase
                    .from('projects')
                    .select('project_title')
                    .eq('project_id', projectId) // Use projectId here to fetch project_name
                    .single();

                if (projError) {
                    console.error('Error fetching project data:', projError.message);
                } else {
                    setProjectName(projData.project_title); // Set projectName from fetched data
                }
            } catch (error) {
                console.error('Error in fetchProjectName:', error.message);
            }
        };

        const fetchVendorName = async () => {
            try {
                const { data: vendorData, error: vendorError } = await supabase
                    .from('vendors')
                    .select('vendor_name')
                    .eq('vendor_id', vendorId) // Use projectId here to fetch project_name
                    .single();

                if (vendorError) {
                    console.error('Error fetching vendor data:', vendorError.message);
                } else {
                    setVendorName(vendorData.vendor_name); // Set projectName from fetched data
                }
            } catch (error) {
                console.error('Error in fetchVendorName:', error.message);
            }
        };

        if (formName && formId && formLogId) {
            fetchVendorName();
            fetchProjectName();
            fetchFormData();
            fetchApprovalData();
        }
    }, [formName, formId, formLogId, projectId, projectName, vendorName]);

    const updateApprovalData = async () => {
        const updatedData = {
            approved_by_name: approvedByName,
            approved_by_pno: approvedByPno,
            approval_status: approvalStatus,
            approval_remarks: approvalRemarks
        };

        try {
            const { data: updatedApprovalData, error: updateError } = await supabase
                .from('forms_logs')
                .update(updatedData)
                .eq('form_log_id', formLogId)
                .single();

            if (updateError) {
                console.error('Error updating approval data:', updateError.message);
            } else {
                console.log('Approval data updated successfully:', updatedApprovalData);
                setApprovalData(updatedApprovalData); // Update state with new data
                handleClose(); // Close the modal
            }
        } catch (error) {
            console.error('Error in updateApprovalData:', error.message);
        }
    };

    if (!data) {
        return <div className='bg-white pb-20 p-5 min-w-screen'><Title text="Loading" /></div>;
    }

    const rows = Object.entries(data).map(([key, value]) => ({
        name: key,
        value: value !== null ? value.toString() : 'N/A'
    }));

    const formatFieldName = (fieldName) => {
        return fieldName
            .split('_')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    };

    const handleDownload = () => {
        console.log('download clicked')
    }

    return (
        <div className='bg-white pb-20 p-5 min-w-screen'>
            <div className="py-5 pb-1 mx-auto w-full sm:w-4/5 lg:w-70">
                <div className="flex justify-between mb-4">
                    <button
                        className="flex items-end px-3 py-1 mx-5 bg-blue-200 hover:bg-blue-300 rounded-md ml-auto"
                        onClick={() => handleDownload()}
                    >
                        <FileDownloadOutlinedIcon />
                        Download
                    </button>
                </div>
                <Title text={formName} />
                <div className="w-full flex justify-between items-center">
                    <Subheading text={projectName} />
                    <Subheading text={vendorName} />
                </div>
                <Divider sx={{ width: '80%', margin: 'auto' }} />
                <br />

                <Subheading text="Form Details" />

                {/* Use TableComponent for Form Details */}
                <TableComponent
                    data={Object.fromEntries(rows.map(row => [row.name, row.value]))}
                />
                <br />
                <SecondaryButton text="Approve Form" onClick={handleOpen} />

                {approvalData && (
                    <div className="py-5 pb-10">
                        <Subheading text="Approval Details" />

                        {/* Use TableComponent for Approval Details */}
                        <TableComponent data={approvalData} />

                        <Modal
                            open={open}
                            onClose={handleClose}
                            aria-labelledby="modal-modal-title"
                            aria-describedby="modal-modal-description"
                        >
                            <Box sx={style}>
                                <div className="flex justify-between items-center">
                                    <Subheading text="Approve Form" />
                                    <Button onClick={handleClose} aria-label="Close">
                                        X
                                    </Button>
                                </div>
                                <form onSubmit={(e) => { e.preventDefault(); updateApprovalData(); }}>
                                    <InputField placeholder="Approved By Name" handleInputChange={setApprovedByName} />
                                    <InputField placeholder="Approved By PNO" handleInputChange={setApprovedByPno} />
                                    <InputField placeholder="Approval Status" handleInputChange={setApprovalStatus} />
                                    <InputField placeholder="Approval Remarks" handleInputChange={setApprovalRemarks} />

                                    <SubmitButton text="Submit" handleSubmit={updateApprovalData} />
                                </form>
                            </Box>
                        </Modal>
                    </div>
                )}

            </div>
        </div>
    );
}

export default FormsView;
