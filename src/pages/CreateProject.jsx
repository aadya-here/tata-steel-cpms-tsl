import React, { useState, useEffect } from 'react';
import InputField from '../components/ui_components/InputField';
import DatePickerField from '../components/ui_components/Datepicker'; // Assuming you have a DatePickerField component
import SubmitButton from '../components/ui_components/PrimaryButton'; // Assuming you have a SubmitButton component
import supabase from '../supabase';
import Title from '../components/ui_components/Title';
import { FormControl, InputLabel, MenuItem, Select, IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useNavigate } from 'react-router-dom';
import { set } from 'date-fns';

const CreateProject = () => {
    const [selectedVendor, setSelectedVendor] = useState(null);
    const [selectedType, setSelectedType] = useState(null);
    const [vendorList, setVendorList] = useState([]);
    const [projectTitle, setProjectTitle] = useState('');
    const [location, setLocation] = useState('');
    const [plannedStartDate, setPlannedStartDate] = useState(new Date());
    const [actualStartDate, setActualStartDate] = useState(new Date());
    const [plannedEndDate, setPlannedEndDate] = useState(new Date());
    const [actualEndDate, setActualEndDate] = useState(new Date());
    const [deliveryEndDate, setDeliveryEndDate] = useState(new Date());
    const [validityEndDate, setValidityEndDate] = useState(new Date());
    const [projectGoal, setProjectGoal] = useState('');
    const [schemeNumber, setSchemeNumber] = useState('');
    const [networkNumber, setNetworkNumber] = useState('');
    const [workOrderNumber, setWorkOrderNumber] = useState('');

    const [projectId, setProjectId] = useState(null);

    const navigate = useNavigate();

    const dropdownType = [
        { label: 'Renovation', value: 'renovation' },
        { label: 'Construction', value: 'construction' },
    ];

    useEffect(() => {
        const fetchVendors = async () => {
            try {
                const { data, error } = await supabase
                    .from('vendors')
                    .select('*');

                if (error) {
                    console.error('Error fetching vendors:', error);
                    return;
                }

                const formattedVendors = data.map((vendor) => ({
                    label: vendor.vendor_name,
                    value: vendor.vendor_id
                }));

                setVendorList(formattedVendors);
            } catch (error) {
                console.log('Unexpected error fetching vendors:', error.message);
            }
        };

        fetchVendors();
    }, []);

    const getUserId = async () => {
        try {
            const { data: { user }, error } = await supabase.auth.getUser();
            if (error) {
                console.error('Error fetching user:', error);
                return null;
            }
            return user?.id ?? null;
        } catch (error) {
            console.error('Unexpected error fetching user:', error);
            return null;
        }
    };

    const handleSubmit = async () => {
        try {
            const userId = await getUserId();
            if (!userId) {
                alert("Error: Unable to fetch user ID.");
                return;
            }
            const { data, error } = await supabase
                .from('projects')
                .insert([
                    {
                        project_title: projectTitle,
                        project_goal: projectGoal,
                        location: location,
                        scheme_num: schemeNumber,
                        network_num: networkNumber,
                        // work_order_num: workOrderNumber,
                        planned_start_date: plannedStartDate,
                        actual_start_date: actualStartDate,
                        planned_end_date: plannedEndDate,
                        actual_end_date: actualEndDate,
                        delivery_end_date: deliveryEndDate,
                        validity_end_date: validityEndDate,
                        status: 'upcoming',
                        vendor_id: selectedVendor,
                        type: selectedType,
                        created_by: userId,
                        created_on: new Date(),
                    },
                ]).select();




            if (error) {
                alert('Error: ' + error.message);
            } else {
                const pid = data[0].project_id;
                // console.log('Project created:', pid);
                setProjectId(pid);

                alert('Success: Project created successfully');
            }
        } catch (error) {

            console.error('Error creating project:', error);
            alert('Error: An unexpected error occurred while creating the project.');
        }
    };

    console.log(projectId);
    return (
        <div className='bg-blue-50 pb-20'>
            <div className="flex justify-between items-center mb-4">
                <IconButton onClick={() => navigate(-1)}>
                    <ArrowBackIcon />
                </IconButton>
                <Title text="Create Project" />
                <IconButton onClick={() => navigate(`/projects/approval/${projectId}`)}>
                    <ArrowForwardIcon />
                </IconButton>
            </div>

            <div className='items-center justify-center flex flex-col'>
                <InputField placeholder="Project Title" handleInputChange={setProjectTitle} />
                <InputField placeholder="Project Goal" handleInputChange={setProjectGoal} />
                <InputField placeholder="Location" handleInputChange={setLocation} />
                <InputField placeholder="Scheme Number" handleInputChange={setSchemeNumber} />
                <InputField placeholder="Network Number" handleInputChange={setNetworkNumber} />
                {/* <InputField placeholder="Work Order Number" handleInputChange={setWorkOrderNumber} /> */}

                <div className="w-full flex justify-center">
                    <div className="my-2 p-2 bg-white shadow-md rounded-md flex items-center space-x-4 w-full sm:w-4/5 md:w-4/5 lg:w-full   " style={{ maxWidth: '600px' }}>



                        <FormControl fullWidth margin="normal">
                            <InputLabel id="vendor-select-label">Vendor</InputLabel>
                            <Select
                                labelId="vendor-select-label"
                                value={selectedVendor}
                                onChange={(e) => setSelectedVendor(e.target.value)}
                                label="Vendor"
                            >
                                {vendorList.map((vendor) => (
                                    <MenuItem key={vendor.value} value={vendor.value}>
                                        {vendor.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControl fullWidth margin="normal">
                            <InputLabel id="type-select-label">Project Type</InputLabel>
                            <Select
                                labelId="type-select-label"
                                value={selectedType}
                                onChange={(e) => setSelectedType(e.target.value)}
                                label="Project Type"
                            >
                                {dropdownType.map((type) => (
                                    <MenuItem key={type.value} value={type.value}>
                                        {type.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                    </div>
                </div>

                <DatePickerField label="Planned Start Date" date={plannedStartDate} setDate={setPlannedStartDate} />
                <DatePickerField label="Actual Start Date" date={actualStartDate} setDate={setActualStartDate} />
                <DatePickerField label="Planned End Date" date={plannedEndDate} setDate={setPlannedEndDate} />
                <DatePickerField label="Actual End Date" date={actualEndDate} setDate={setActualEndDate} />
                <DatePickerField label="Delivery End Date" date={deliveryEndDate} setDate={setDeliveryEndDate} />
                <DatePickerField label="Validity End Date" date={validityEndDate} setDate={setValidityEndDate} />

            </div>
            <SubmitButton text="Create Project" handleSubmit={handleSubmit} />

        </div>
    );
};

export default CreateProject;
