import React, { useState, useEffect } from 'react';
import supabase from '../supabase'; // Adjust path as necessary
import { useNavigate } from 'react-router-dom'; // Assuming you're using react-router-dom for navigation
import { CircularProgress, IconButton } from '@mui/material'; // Material-UI components
import RefreshIcon from '@mui/icons-material/Refresh'; // Material-UI icon
import Title from '../components/ui_components/Title'; // Adjust path as necessary
import Subheading from '../components/ui_components/Subheading';
import LogCard from '../components/info_cards/LogCard';

const Logs = ({ projectId }) => { // Added projectId prop
    const [logs, setLogs] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetchLogs();

    }, [projectId]); // Added projectId to dependency array to refetch when it changes

    const fetchLogs = async () => {
        setRefreshing(true);
        try {
            let query = supabase
                .from('logs')
                .select('*')
                .order('created_on', { ascending: false })
                .order('log_id', { ascending: false });

            if (projectId) {
                query = query.eq('project_id', projectId); // Filter by projectId if it is provided
            }

            const { data: logData, error: logError } = await query;

            if (logError) {
                console.error('Error fetching logs:', logError);
                return;
            }

            const { data: vendorData, error: vendorError } = await supabase
                .from('vendors')
                .select('*');

            if (vendorError) {
                console.error('Error fetching vendor names:', vendorError);
                return;
            }

            const vendorMap = vendorData.reduce((vid, vendor) => {
                vid[vendor.vendor_id] = vendor.vendor_name;
                return vid;
            }, {});

            const { data: projectData, error: projectError } = await supabase
                .from('projects')
                .select('project_id, project_title');

            if (projectError) {
                console.error('Error fetching project names:', projectError);
                return;
            }

            const projectMap = projectData.reduce((pid, project) => {
                pid[project.project_id] = project.project_title;
                return pid;
            }, {});

            const processedLogs = logData.map(log => {
                const createdOn = new Date(log.created_on);
                const date = createdOn.toLocaleDateString();
                const day = createdOn.toLocaleDateString('en-US', { weekday: 'long' });
                const projectName = projectMap[log.project_id] || 'Unknown Project';
                const vendorName = vendorMap[log.vendor_id] || 'Unknown Vendor';

                return {
                    ...log,
                    date,
                    day,
                    project_title: projectName,
                    vendor_name: vendorName
                };
            }).sort((a, b) => new Date(b.created_on).getTime() - new Date(a.created_on).getTime());

            setLogs(processedLogs);
        } catch (error) {
            console.error('Error fetching logs:', error.message);
        }
        setRefreshing(false);
    };

    return (
        <div className="bg-blue-50 pb-20 p-5 min-h-screen">
            <div className="flex justify-between items-center mb-4">
                <Title text={projectId ? `Logs for Project ${projectId}` : 'Logs'} />
                <IconButton onClick={fetchLogs}>
                    <RefreshIcon />
                </IconButton>
            </div>
            {refreshing ? (
                <div className="flex justify-center items-center">
                    <CircularProgress />
                </div>
            ) : (
                <div className="items-center justify-center flex flex-col">
                    {logs.length === 0 ? (
                        <Subheading text="No logs Available" />
                    ) : (
                        logs.map(log => (
                            <LogCard key={log.log_id} log={log} />
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export default Logs;
