import { useParams } from 'react-router-dom';
import supabase from '../supabase';
import React, { useEffect, useState } from 'react';
import Title from '../components/ui_components/Title';
import Subheading from '../components/ui_components/Subheading';


import { Divider } from '@mui/joy';

import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import TableComponent from '../components/TableComponent';

function FormsView() {
    const { formName, formId, formLogId } = useParams();
    const [data, setData] = useState(null);
    const [approvalData, setApprovalData] = useState(null);
    const [projectId, setProjectId] = useState(null);
    const [projectName, setProjectName] = useState('');

    const [vendorName, setVendorName] = useState('');

    const vendorId = 3;


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

                {approvalData && (
                    <div className="py-5 pb-10">
                        <Subheading text="Approval Details" />

                        {/* Use TableComponent for Approval Details */}
                        <TableComponent data={approvalData} />
                    </div>
                )}
            </div>
        </div>

    );
}

export default FormsView;
